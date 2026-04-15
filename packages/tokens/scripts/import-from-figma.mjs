import { readFileSync, writeFileSync, mkdirSync } from "fs";

const BASE_FONT_SIZE = 16;
const inputPath = process.argv[2];
const brandName = process.argv[3];

if (!inputPath) {
  console.error("Usage:");
  console.error("  Brand tokens:  node scripts/import-from-figma.mjs <json-file> <brand-name>");
  console.error("  Shared tokens: node scripts/import-from-figma.mjs <json-file>");
  console.error("");
  console.error("Examples:");
  console.error("  node scripts/import-from-figma.mjs ~/Downloads/brand-a.json brand-a");
  console.error("  node scripts/import-from-figma.mjs ~/Downloads/ds-shared.json");
  process.exit(1);
}

const dtcg = JSON.parse(readFileSync(inputPath, "utf-8"));

function colorToHex(value) {
  if (typeof value === "string") return value;
  if (typeof value !== "object" || value === null) return value;
  if (value.components && Array.isArray(value.components)) {
    const [r, g, b] = value.components.map(function(c) { return Math.round(Math.min(1, Math.max(0, c)) * 255); });
    const a = value.alpha !== undefined ? value.alpha : 1;
    const hex = "#" + [r, g, b].map(function(c) { return c.toString(16).padStart(2, "0"); }).join("").toUpperCase();
    if (a < 1) return hex + Math.round(a * 255).toString(16).padStart(2, "0").toUpperCase();
    return hex;
  }
  if ("r" in value) {
    const r = Math.round((value.r || 0) * 255);
    const g = Math.round((value.g || 0) * 255);
    const b = Math.round((value.b || 0) * 255);
    const a = value.a !== undefined ? value.a : 1;
    const hex = "#" + [r, g, b].map(function(c) { return c.toString(16).padStart(2, "0"); }).join("").toUpperCase();
    if (a < 1) return hex + Math.round(a * 255).toString(16).padStart(2, "0").toUpperCase();
    return hex;
  }
  return value;
}

function pxToRem(px) {
  const rem = px / BASE_FONT_SIZE;
  return parseFloat(rem.toFixed(4)) + "rem";
}

function shouldBeRem(pathStr) {
  return pathStr.includes("font") && pathStr.includes("size");
}

function shouldBePx(pathStr) {
  return pathStr.includes("spacing") || pathStr.includes("radius");
}

function shouldBeMs(pathStr) {
  return pathStr.includes("duration") || pathStr.includes("motion");
}

function convertDimension(value, path) {
  const pathStr = path.join(".");
  let numericVal = null;
  let unit = null;

  if (typeof value === "string") {
    const match = value.match(/^([\d.]+)(px|rem|ms|em|%)?$/);
    if (match) {
      numericVal = parseFloat(match[1]);
      unit = match[2] || null;
    } else {
      return value;
    }
  } else if (typeof value === "number") {
    numericVal = value;
  } else {
    return value;
  }

  if (numericVal === 0) return "0";
  if (shouldBeMs(pathStr)) return numericVal + "ms";
  if (shouldBeRem(pathStr)) {
    if (unit === "rem") return value;
    return pxToRem(numericVal);
  }
  if (shouldBePx(pathStr)) return numericVal + "px";
  if (unit) return numericVal + unit;
  return value;
}

const fontFallbacks = {
  "Inter": "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  "DM Sans": "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  "JetBrains Mono": "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
  "Cabinet Grotesk": "'Cabinet Grotesk', 'Inter', sans-serif",
  "Outfit": "'Outfit', 'DM Sans', sans-serif",
};

function convertValue(value, type, path) {
  const pathStr = path.join(".");

  if (type === "color") return colorToHex(value);

  if (type === "fontFamily" && typeof value === "string") {
    return fontFallbacks[value] || value;
  }

  if (type === "dimension") return convertDimension(value, path);

  if (type === "number" || type === "borderRadius" || type === "spacing" || type === "fontSize") {
    if (typeof value === "number" && value > 0) {
      if (shouldBeRem(pathStr)) return pxToRem(value);
      if (shouldBePx(pathStr)) return value + "px";
      if (shouldBeMs(pathStr)) return value + "ms";
    }
    return value;
  }

  if (type === "duration") {
    if (typeof value === "object" && value !== null && "value" in value) return value.value + (value.unit || "ms");
    if (typeof value === "number") return value + "ms";
    if (typeof value === "string") return convertDimension(value, path);
    return value;
  }

  if (type === "cubicBezier" && Array.isArray(value)) {
    return "cubic-bezier(" + value.join(", ") + ")";
  }

  if (type === "fontWeight") {
    const weightMap = {
      "thin": "100", "extralight": "200", "light": "300",
      "regular": "400", "normal": "400", "medium": "500",
      "semibold": "600", "bold": "700", "extrabold": "800", "black": "900",
    };
    if (typeof value === "string") return weightMap[value.toLowerCase()] || value;
    return String(value);
  }

  if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) return value;

  return value;
}

function mapTypeBack(dtcgType, path) {
  const pathStr = path.join(".");
  if (dtcgType === "color") return "color";
  if (dtcgType === "fontFamily") return "fontFamily";
  if (dtcgType === "string" && pathStr.includes("font") && pathStr.includes("family")) return "fontFamily";
  if (dtcgType === "fontWeight") return "fontWeight";
  if (dtcgType === "duration") return "duration";
  if (dtcgType === "cubicBezier") return "cubicBezier";
  if (dtcgType === "shadow") return "boxShadow";
  if (dtcgType === "dimension" || dtcgType === "number") {
    if (pathStr.includes("spacing")) return "spacing";
    if (pathStr.includes("radius")) return "borderRadius";
    if (pathStr.includes("font") && pathStr.includes("size")) return "fontSize";
    if (pathStr.includes("letterSpacing")) return "letterSpacing";
    if (pathStr.includes("lineHeight") || pathStr.includes("lineheight")) return "lineHeight";
    if (pathStr.includes("duration") || pathStr.includes("motion")) return "duration";
    if (dtcgType === "number") return "number";
    return "dimension";
  }
  return dtcgType || "string";
}

function fromDTCG(obj, path) {
  if (!path) path = [];
  const result = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (key.startsWith("$")) continue;
    if (val && typeof val === "object" && "$value" in val) {
      const currentPath = path.concat([key]);
      const type = mapTypeBack(val.$type, currentPath);
      const token = {
        value: convertValue(val.$value, type, currentPath),
        type: type,
      };
      if (val.$description) token.comment = val.$description;
      result[key] = token;
    } else if (val && typeof val === "object" && !("$value" in val)) {
      const child = fromDTCG(val, path.concat([key]));
      if (Object.keys(child).length > 0) result[key] = child;
    }
  }
  return result;
}

// ── Convert ──────────────────────────────────────

const converted = fromDTCG(dtcg);

// ── Output: Brand mode ───────────────────────────

if (brandName) {
  mkdirSync("brands", { recursive: true });

  const brandColors = {};
  if (converted.color && converted.color.primitive) {
    brandColors.color = { primitive: converted.color.primitive };
  }

  const brandOverrides = {};
  if (converted.font) {
    brandOverrides.font = {};
    if (converted.font.family) brandOverrides.font.family = converted.font.family;
    if (converted.font.weight) brandOverrides.font.weight = converted.font.weight;
  }
  if (converted.radius) brandOverrides.radius = converted.radius;
  if (converted.shadow) brandOverrides.shadow = converted.shadow;

  if (Object.keys(brandColors).length > 0) {
    writeFileSync("brands/" + brandName + "-colors.json", JSON.stringify(brandColors, null, 2) + "\n");
    console.log("✓ brands/" + brandName + "-colors.json updated");
  }

  if (Object.keys(brandOverrides).length > 0) {
    writeFileSync("brands/" + brandName + "-overrides.json", JSON.stringify(brandOverrides, null, 2) + "\n");
    console.log("✓ brands/" + brandName + "-overrides.json updated");
  }

  console.log("");
  console.log("Brand \"" + brandName + "\" updated. Run: node build.mjs");
}

// ── Output: Shared mode (no brand name) ──────────

if (!brandName) {
  if (converted.color) {
    const semantic = {};
    for (const key of Object.keys(converted.color)) {
      if (key !== "primitive") semantic[key] = converted.color[key];
    }
    if (Object.keys(semantic).length > 0) {
      writeFileSync("src/color-semantic.json", JSON.stringify({ color: semantic }, null, 2) + "\n");
      console.log("✓ src/color-semantic.json updated");
    }
  }

  if (converted.font) {
    const shared = {};
    for (const key of Object.keys(converted.font)) {
      if (key !== "family" && key !== "weight") shared[key] = converted.font[key];
    }
    if (Object.keys(shared).length > 0) {
      writeFileSync("src/typography-shared.json", JSON.stringify({ font: shared }, null, 2) + "\n");
      console.log("✓ src/typography-shared.json updated");
    }
  }

  const spacingShared = {};
  if (converted.spacing) spacingShared.spacing = converted.spacing;
  if (converted.motion) spacingShared.motion = converted.motion;
  if (Object.keys(spacingShared).length > 0) {
    writeFileSync("src/spacing-shared.json", JSON.stringify(spacingShared, null, 2) + "\n");
    console.log("✓ src/spacing-shared.json updated");
  }

  console.log("");
  console.log("Shared tokens updated. Run: node build.mjs");
}
