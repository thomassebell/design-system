import { readFileSync, writeFileSync } from "fs";

const BASE_FONT_SIZE = 16;
const inputPath = process.argv[2];

if (!inputPath) {
  console.error("Usage: node scripts/import-from-figma.mjs <path-to-dtcg-json>");
  process.exit(1);
}

const dtcg = JSON.parse(readFileSync(inputPath, "utf-8"));

function colorToHex(value) {
  if (typeof value === "string") return value;
  if (typeof value !== "object" || value === null) return value;
  if (value.components && Array.isArray(value.components)) {
    const [r, g, b] = value.components.map(c => Math.round(Math.min(1, Math.max(0, c)) * 255));
    const a = value.alpha ?? 1;
    const hex = "#" + [r, g, b].map(c => c.toString(16).padStart(2, "0")).join("").toUpperCase();
    if (a < 1) return hex + Math.round(a * 255).toString(16).padStart(2, "0").toUpperCase();
    return hex;
  }
  if ("r" in value) {
    const r = Math.round((value.r ?? 0) * 255);
    const g = Math.round((value.g ?? 0) * 255);
    const b = Math.round((value.b ?? 0) * 255);
    const a = value.a ?? 1;
    const hex = "#" + [r, g, b].map(c => c.toString(16).padStart(2, "0")).join("").toUpperCase();
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
  return pathStr.includes("spacing") ||
    pathStr.includes("radius") ||
    (pathStr.includes("font") && pathStr.includes("size"));
}

function convertDimension(value, path) {
  const pathStr = path.join(".");
  if (typeof value === "string") {
    const pxMatch = value.match(/^([\d.]+)px$/);
    if (pxMatch) {
      const px = parseFloat(pxMatch[1]);
      if (px === 0) return "0";
      if (shouldBeRem(pathStr)) return pxToRem(px);
      return value;
    }
    return value;
  }
  if (typeof value === "number") {
    if (value === 0) return "0";
    if (shouldBeRem(pathStr)) return pxToRem(value);
    return value + "px";
  }
  return value;
}

function convertValue(value, type, path) {
  const pathStr = path.join(".");

  if (type === "color") return colorToHex(value);

  if (type === "dimension") return convertDimension(value, path);

  if (type === "number") {
    if (typeof value === "number" && value > 0 && shouldBeRem(pathStr)) {
      return pxToRem(value);
    }
    return value;
  }

  if (type === "duration") {
    if (typeof value === "object" && value !== null && "value" in value) return value.value + (value.unit || "ms");
    if (typeof value === "number") return value + "ms";
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
    if (dtcgType === "number") return "number";
    return "dimension";
  }
  return dtcgType || "string";
}

function fromDTCG(obj, path = []) {
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith("$")) continue;
    if (val && typeof val === "object" && "$value" in val) {
      const currentPath = [...path, key];
      const type = mapTypeBack(val.$type, currentPath);
      const token = {
        value: convertValue(val.$value, val.$type, currentPath),
        type: type,
      };
      if (val.$description) token.comment = val.$description;
      result[key] = token;
    } else if (val && typeof val === "object" && !("$value" in val)) {
      const child = fromDTCG(val, [...path, key]);
      if (Object.keys(child).length > 0) result[key] = child;
    }
  }
  return result;
}

const converted = fromDTCG(dtcg);

const files = {
  "src/color-primitives.json": {},
  "src/color-semantic.json": {},
  "src/typography.json": {},
  "src/spacing-and-effects.json": {},
};

if (converted.color) {
  if (converted.color.primitive) {
    files["src/color-primitives.json"] = { color: { primitive: converted.color.primitive } };
  }
  const semantic = { ...converted.color };
  delete semantic.primitive;
  if (Object.keys(semantic).length > 0) files["src/color-semantic.json"] = { color: semantic };
}
if (converted.font) files["src/typography.json"] = { font: converted.font };

const effectKeys = ["spacing", "radius", "shadow", "motion"];
const effects = {};
for (const key of effectKeys) {
  if (converted[key]) effects[key] = converted[key];
}
if (Object.keys(effects).length > 0) files["src/spacing-and-effects.json"] = effects;

let count = 0;
for (const [filePath, data] of Object.entries(files)) {
  if (Object.keys(data).length > 0) {
    writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
    console.log("✓ " + filePath + " updated");
    count++;
  }
}

if (count === 0) {
  writeFileSync("src/figma-tokens.json", JSON.stringify(converted, null, 2) + "\n");
  console.log("✓ src/figma-tokens.json created");
} else {
  console.log("\n" + count + " files updated. Now run:");
  console.log("  npx style-dictionary build --config style-dictionary.config.mjs");
  console.log("  node transforms/generate-swift.mjs");
}
