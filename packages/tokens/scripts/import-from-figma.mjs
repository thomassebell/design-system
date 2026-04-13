/**
 * import-from-figma.mjs
 *
 * Takes a W3C DTCG-formatted JSON file exported from Figma
 * (using "Token Press - DTCG Exporter" or similar) and converts
 * it into Style Dictionary source format.
 *
 * Usage:  node scripts/import-from-figma.mjs path/to/figma-export.json
 * Output: Overwrites files in src/ with updated token values
 */

import { readFileSync, writeFileSync } from "fs";

// ── Read input ───────────────────────────────────

const inputPath = process.argv[2];

if (!inputPath) {
  console.error("Usage: node scripts/import-from-figma.mjs <path-to-dtcg-json>");
  console.error("Example: node scripts/import-from-figma.mjs figma/exported-tokens.json");
  process.exit(1);
}

const dtcg = JSON.parse(readFileSync(inputPath, "utf-8"));

// ── Convert DTCG → Style Dictionary ──────────────

function fromDTCG(obj) {
  const result = {};

  for (const [key, val] of Object.entries(obj)) {
    // Skip DTCG group-level properties
    if (key.startsWith("$")) continue;

    if (val && typeof val === "object" && "$value" in val) {
      // Token leaf node
      const token = {
        value: convertValueBack(val.$value, val.$type),
        type: mapTypeBack(val.$type),
      };
      if (val.$description) {
        token.comment = val.$description;
      }
      result[key] = token;
    } else if (val && typeof val === "object") {
      // Group
      result[key] = fromDTCG(val);
    }
  }

  return result;
}

function mapTypeBack(dtcgType) {
  const map = {
    color: "color",
    dimension: "spacing", // will be refined below based on context
    fontFamily: "fontFamily",
    fontWeight: "fontWeight",
    number: "lineHeight",
    shadow: "boxShadow",
    duration: "duration",
    cubicBezier: "cubicBezier",
  };
  return map[dtcgType] || dtcgType || "string";
}

function convertValueBack(value, type) {
  // cubicBezier: convert array back to CSS string
  if (type === "cubicBezier" && Array.isArray(value)) {
    return `cubic-bezier(${value.join(", ")})`;
  }

  // DTCG references {x.y.z} stay as-is (Style Dictionary uses same format)
  return value;
}

// ── Split into logical files ─────────────────────

const converted = fromDTCG(dtcg);

// Try to split into the same file structure we use
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
  // Everything else under color goes to semantic
  const semantic = { ...converted.color };
  delete semantic.primitive;
  if (Object.keys(semantic).length > 0) {
    files["src/color-semantic.json"] = { color: semantic };
  }
}

if (converted.font) {
  files["src/typography.json"] = { font: converted.font };
}

// Spacing, radius, shadow, motion → spacing-and-effects
const effectKeys = ["spacing", "radius", "shadow", "motion"];
const effects = {};
for (const key of effectKeys) {
  if (converted[key]) {
    effects[key] = converted[key];
  }
}
if (Object.keys(effects).length > 0) {
  files["src/spacing-and-effects.json"] = effects;
}

// ── Write files ──────────────────────────────────

let count = 0;
for (const [path, data] of Object.entries(files)) {
  if (Object.keys(data).length > 0) {
    writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
    console.log(`✓ ${path} updated`);
    count++;
  }
}

if (count === 0) {
  // If we couldn't split nicely, write everything to a single file
  writeFileSync("src/figma-tokens.json", JSON.stringify(converted, null, 2) + "\n");
  console.log("✓ src/figma-tokens.json created (couldn't split into known files)");
  console.log("  You may need to reorganize this manually.");
} else {
  console.log(`\n${count} files updated. Now run:`);
  console.log("  npx style-dictionary build --config style-dictionary.config.mjs");
  console.log("  node transforms/generate-swift.mjs");
}
