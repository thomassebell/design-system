/**
 * export-to-figma.mjs
 *
 * Reads your Style Dictionary source tokens and outputs a single
 * W3C DTCG-formatted JSON file that can be imported into Figma
 * using the "Variables JSON Import" plugin (by Microsoft) or
 * any DTCG-compatible import tool.
 *
 * Usage:  node scripts/export-to-figma.mjs
 * Output: figma/import-to-figma.json
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";

// ── Load all source token files ──────────────────

const srcDir = "src";
const files = readdirSync(srcDir).filter((f) => f.endsWith(".json"));

let merged = {};
for (const file of files) {
  const data = JSON.parse(readFileSync(join(srcDir, file), "utf-8"));
  merged = deepMerge(merged, data);
}

// ── Convert to DTCG format ──────────────────────

function toDTCG(obj, path = []) {
  const result = {};

  for (const [key, val] of Object.entries(obj)) {
    if (val && typeof val === "object" && "value" in val) {
      // This is a token leaf node
      const dtcgToken = {
        $value: convertValue(val.value, val.type),
        $type: mapType(val.type),
      };
      if (val.comment) {
        dtcgToken.$description = val.comment;
      }
      result[key] = dtcgToken;
    } else if (val && typeof val === "object") {
      // This is a group
      result[key] = toDTCG(val, [...path, key]);
    }
  }

  return result;
}

function mapType(type) {
  const map = {
    color: "color",
    fontSize: "dimension",
    fontFamily: "fontFamily",
    fontWeight: "fontWeight",
    lineHeight: "number",
    letterSpacing: "dimension",
    spacing: "dimension",
    borderRadius: "dimension",
    boxShadow: "shadow",
    duration: "duration",
    cubicBezier: "cubicBezier",
  };
  return map[type] || type || "string";
}

function convertValue(value, type) {
  // Convert Style Dictionary references {x.y.z} to DTCG format {x.y.z}
  if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
    return value; // DTCG uses the same {path.to.token} syntax
  }

  // Colors: Figma DTCG expects hex strings
  if (type === "color") {
    return value;
  }

  // cubicBezier: DTCG expects an array of 4 numbers
  if (type === "cubicBezier" && typeof value === "string") {
    const match = value.match(/cubic-bezier\(([^)]+)\)/);
    if (match) {
      return match[1].split(",").map((n) => parseFloat(n.trim()));
    }
  }

  // Duration: DTCG expects "150ms" format (already correct)
  // Dimensions: DTCG expects "0.5rem" format (already correct)

  return value;
}

function deepMerge(target, source) {
  const result = { ...target };
  for (const [key, val] of Object.entries(source)) {
    if (val && typeof val === "object" && !Array.isArray(val) && !("value" in val)) {
      result[key] = deepMerge(result[key] || {}, val);
    } else {
      result[key] = val;
    }
  }
  return result;
}

// ── Write output ─────────────────────────────────

const dtcg = toDTCG(merged);

mkdirSync("figma", { recursive: true });
writeFileSync("figma/import-to-figma.json", JSON.stringify(dtcg, null, 2));

console.log("✓ figma/import-to-figma.json generated");
console.log("  → Install 'Variables JSON Import' plugin in Figma");
console.log("  → Run the plugin and select this file to create your variables");
