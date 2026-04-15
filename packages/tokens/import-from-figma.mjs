import { readFileSync, writeFileSync, mkdirSync } from "fs";

var BASE_FONT_SIZE = 16;
var inputPath = process.argv[2];
var dimension = process.argv[3]; // "brand" or "density"
var modeName = process.argv[4];  // e.g. "brand-a", "brand-b", "default", "compact"

if (!inputPath || !dimension || !modeName) {
  console.error("Usage:");
  console.error("  node scripts/import-from-figma.mjs <json-file> brand <brand-name>");
  console.error("  node scripts/import-from-figma.mjs <json-file> density <density-name>");
  console.error("");
  console.error("Examples:");
  console.error("  node scripts/import-from-figma.mjs ~/Downloads/Brand_A.json brand brand-a");
  console.error("  node scripts/import-from-figma.mjs ~/Downloads/Brand_B.json brand brand-b");
  console.error("  node scripts/import-from-figma.mjs ~/Downloads/default.json density default");
  console.error("  node scripts/import-from-figma.mjs ~/Downloads/compact.json density compact");
  process.exit(1);
}

var dtcg = JSON.parse(readFileSync(inputPath, "utf-8"));

// ── Color conversion ─────────────────────────────

function colorToHex(value) {
  if (typeof value === "string") return value;
  if (typeof value !== "object" || value === null) return value;

  // Figma native format: { colorSpace, components, alpha, hex }
  if (value.hex) return value.hex;

  if (value.components && Array.isArray(value.components)) {
    var comps = value.components;
    var r = Math.round(Math.min(1, Math.max(0, comps[0])) * 255);
    var g = Math.round(Math.min(1, Math.max(0, comps[1])) * 255);
    var b = Math.round(Math.min(1, Math.max(0, comps[2])) * 255);
    var a = value.alpha !== undefined ? value.alpha : 1;
    var hex = "#" + [r, g, b].map(function(c) { return c.toString(16).padStart(2, "0"); }).join("").toUpperCase();
    if (a < 1) return hex + Math.round(a * 255).toString(16).padStart(2, "0").toUpperCase();
    return hex;
  }

  if ("r" in value) {
    var r2 = Math.round((value.r || 0) * 255);
    var g2 = Math.round((value.g || 0) * 255);
    var b2 = Math.round((value.b || 0) * 255);
    var a2 = value.a !== undefined ? value.a : 1;
    var hex2 = "#" + [r2, g2, b2].map(function(c) { return c.toString(16).padStart(2, "0"); }).join("").toUpperCase();
    if (a2 < 1) return hex2 + Math.round(a2 * 255).toString(16).padStart(2, "0").toUpperCase();
    return hex2;
  }

  return value;
}

// ── Unit conversion ──────────────────────────────

function pxToRem(px) {
  var rem = px / BASE_FONT_SIZE;
  return parseFloat(rem.toFixed(4)) + "rem";
}

function shouldBeRem(pathStr) {
  return (pathStr.includes("font") && pathStr.includes("size")) ||
         pathStr.includes("font-size");
}

function shouldBePx(pathStr) {
  return pathStr.includes("spacing") || pathStr.includes("radius") ||
         pathStr.includes("corner") || pathStr.includes("primitive") ||
         pathStr.includes("line-height") || pathStr.includes("lineHeight");
}

function shouldBeMs(pathStr) {
  return pathStr.includes("duration") || pathStr.includes("motion");
}

// ── Font fallbacks ───────────────────────────────

var fontFallbacks = {
  "Inter": "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  "DM Sans": "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  "JetBrains Mono": "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
  "Cabinet Grotesk": "'Cabinet Grotesk', 'Inter', sans-serif",
  "Outfit": "'Outfit', 'DM Sans', sans-serif",
};

// ── Font weight conversion ───────────────────────

var weightMap = {
  "thin": "100", "hairline": "100",
  "extra light": "200", "extralight": "200", "ultra light": "200",
  "light": "300",
  "regular": "400", "normal": "400",
  "medium": "500",
  "semi bold": "600", "semibold": "600", "demi bold": "600",
  "bold": "700",
  "extra bold": "800", "extrabold": "800", "ultra bold": "800",
  "black": "900", "heavy": "900",
};

// ── Value conversion ─────────────────────────────

function convertValue(value, type, pathStr) {
  // DTCG references — keep as-is
  if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
    return value;
  }

  // Colors
  if (type === "color") return colorToHex(value);

  // Font family
  if (type === "fontFamily" && typeof value === "string") {
    return fontFallbacks[value] || value;
  }

  // Font weight
  if (type === "fontWeight") {
    if (typeof value === "string") {
      var lookup = value.toLowerCase().trim();
      return weightMap[lookup] || value;
    }
    return String(value);
  }

  // Dimensions (string like "16px" or "1rem")
  if (typeof value === "string") {
    var match = value.match(/^([\d.]+)(px|rem|ms|em|%)?$/);
    if (match) {
      var num = parseFloat(match[1]);
      var unit = match[2] || null;
      if (num === 0) return "0";
      if (shouldBeMs(pathStr)) return num + "ms";
      if (shouldBeRem(pathStr)) return unit === "rem" ? value : pxToRem(num);
      if (shouldBePx(pathStr)) return num + "px";
      if (unit) return num + unit;
      return value;
    }
    return value;
  }

  // Numbers
  if (typeof value === "number") {
    if (value === 0) return "0";
    if (shouldBeMs(pathStr)) return value + "ms";
    if (shouldBeRem(pathStr)) return pxToRem(value);
    if (shouldBePx(pathStr)) return value + "px";
    return value;
  }

  return value;
}

// ── Type mapping ─────────────────────────────────

function mapType(dtcgType, pathStr) {
  if (dtcgType === "color") return "color";
  if (dtcgType === "string" && (pathStr.includes("font-family") || pathStr.includes("fontFamily") || pathStr.includes("font.family"))) return "fontFamily";
  if (dtcgType === "string" && (pathStr.includes("font-weight") || pathStr.includes("fontWeight") || pathStr.includes("font.weight"))) return "fontWeight";
  if (dtcgType === "string") return "string";
  if (dtcgType === "number") {
    if (pathStr.includes("spacing") || pathStr.includes("primitive")) return "spacing";
    if (pathStr.includes("radius") || pathStr.includes("corner")) return "borderRadius";
    if (shouldBeRem(pathStr)) return "fontSize";
    if (pathStr.includes("line-height") || pathStr.includes("lineHeight")) return "lineHeight";
    if (pathStr.includes("font-weight") || pathStr.includes("fontWeight")) return "fontWeight";
    return "number";
  }
  if (dtcgType === "dimension") {
    if (pathStr.includes("spacing")) return "spacing";
    if (pathStr.includes("radius") || pathStr.includes("corner")) return "borderRadius";
    if (shouldBeRem(pathStr)) return "fontSize";
    return "dimension";
  }
  if (dtcgType === "duration") return "duration";
  if (dtcgType === "cubicBezier") return "cubicBezier";
  if (dtcgType === "shadow") return "boxShadow";
  return dtcgType || "string";
}

// ── DTCG → Style Dictionary ──────────────────────

function fromDTCG(obj, path) {
  if (!path) path = [];
  var result = {};
  for (var key of Object.keys(obj)) {
    if (key.startsWith("$")) continue;
    var val = obj[key];

    if (val && typeof val === "object" && "$value" in val) {
      var currentPath = path.concat([key]);
      var pathStr = currentPath.join(".");
      var type = mapType(val.$type, pathStr);
      var converted = convertValue(val.$value, type, pathStr);

      var token = {
        value: converted,
        type: type,
      };
      if (val.$description) token.comment = val.$description;
      result[key] = token;
    } else if (val && typeof val === "object") {
      var child = fromDTCG(val, path.concat([key]));
      if (Object.keys(child).length > 0) result[key] = child;
    }
  }
  return result;
}

// ── Convert ──────────────────────────────────────

var converted = fromDTCG(dtcg);

// ── Output ───────────────────────────────────────

if (dimension === "brand") {
  mkdirSync("brands", { recursive: true });
  writeFileSync("brands/" + modeName + ".json", JSON.stringify(converted, null, 2) + "\n");
  console.log("✓ brands/" + modeName + ".json updated");
  console.log("");
  console.log("Contains:");
  for (var key of Object.keys(converted)) {
    console.log("  - " + key);
  }
  console.log("");
  console.log("Run: node build.mjs");
}

if (dimension === "density") {
  mkdirSync("densities", { recursive: true });
  writeFileSync("densities/" + modeName + ".json", JSON.stringify(converted, null, 2) + "\n");
  console.log("✓ densities/" + modeName + ".json updated");
  console.log("");
  console.log("Contains:");
  for (var key of Object.keys(converted)) {
    console.log("  - " + key);
  }
  console.log("");
  console.log("Run: node build.mjs");
}
