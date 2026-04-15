/**
 * export-to-figma.mjs
 *
 * Exports tokens as W3C DTCG-formatted JSON for importing into Figma.
 *
 * Usage:
 *   Brand export:  node scripts/export-to-figma.mjs brand-a
 *   Shared export: node scripts/export-to-figma.mjs shared
 *
 * Output: figma/brand-a.json or figma/shared.json
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";

const target = process.argv[2];

if (!target) {
  console.error("Usage:");
  console.error("  node scripts/export-to-figma.mjs brand-a    (export brand primitives)");
  console.error("  node scripts/export-to-figma.mjs shared     (export shared DS tokens)");
  process.exit(1);
}

function loadJSON(path) {
  if (!existsSync(path)) return {};
  return JSON.parse(readFileSync(path, "utf-8"));
}

function deepMerge(target, source) {
  const result = Object.assign({}, target);
  for (var key of Object.keys(source)) {
    var val = source[key];
    if (val && typeof val === "object" && !Array.isArray(val) && !("value" in val)) {
      result[key] = deepMerge(result[key] || {}, val);
    } else {
      result[key] = val;
    }
  }
  return result;
}

// ── DTCG type mapping ────────────────────────────

function mapType(type) {
  var map = {
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
    number: "number",
    string: "string",
  };
  return map[type] || type || "string";
}

function convertValue(value, type) {
  // Convert Style Dictionary references to DTCG format
  if (typeof value === "string" && value.startsWith("{") && value.endsWith("}")) {
    return value;
  }

  // cubicBezier: convert CSS string to array
  if (type === "cubicBezier" && typeof value === "string") {
    var match = value.match(/cubic-bezier\(([^)]+)\)/);
    if (match) {
      return match[1].split(",").map(function(n) { return parseFloat(n.trim()); });
    }
  }

  // Font family: strip fallbacks, keep just the primary font name
  if (type === "fontFamily" && typeof value === "string") {
    // Extract first font from the fallback chain
    var first = value.split(",")[0].trim().replace(/^'|'$/g, "");
    return first;
  }

  return value;
}

function toDTCG(obj) {
  var result = {};
  for (var key of Object.keys(obj)) {
    var val = obj[key];
    if (val && typeof val === "object" && "value" in val) {
      var dtcgToken = {
        "$value": convertValue(val.value, val.type),
        "$type": mapType(val.type),
      };
      if (val.comment) {
        dtcgToken["$description"] = val.comment;
      }
      result[key] = dtcgToken;
    } else if (val && typeof val === "object") {
      result[key] = toDTCG(val);
    }
  }
  return result;
}

// ── Load and export ──────────────────────────────

mkdirSync("figma", { recursive: true });

if (target === "shared") {
  // Export shared tokens: semantic colors, spacing, typography (sizes, line-heights)
  var shared = {};
  shared = deepMerge(shared, loadJSON("src/color-semantic.json"));
  shared = deepMerge(shared, loadJSON("src/typography-shared.json"));
  shared = deepMerge(shared, loadJSON("src/spacing-shared.json"));

  var dtcg = toDTCG(shared);
  writeFileSync("figma/shared.json", JSON.stringify(dtcg, null, 2));
  console.log("✓ figma/shared.json generated");
  console.log("  → Import into your DS Figma file");
} else {
  // Export brand tokens: primitive colors + overrides (fonts, weights, radius, shadows)
  var brand = {};
  brand = deepMerge(brand, loadJSON("brands/" + target + "-colors.json"));
  brand = deepMerge(brand, loadJSON("brands/" + target + "-overrides.json"));

  var dtcg = toDTCG(brand);
  writeFileSync("figma/" + target + ".json", JSON.stringify(dtcg, null, 2));
  console.log("✓ figma/" + target + ".json generated");
  console.log("  → Import into your " + target + " Figma file");
}
