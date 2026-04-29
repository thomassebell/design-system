/**
 * Token build script.
 *
 * Reads Figma's W3C-DTCG exports directly from figma-exports/, merges the
 * foundation + brand-tokens + density-tokens for each (brand × density)
 * combination, and emits one CSS file per combination via Style Dictionary.
 *
 * Output:
 *   dist/brand-a-default.css
 *   dist/brand-a-compact.css
 *   dist/brand-b-default.css
 *   dist/brand-b-compact.css
 *   dist/tokens.json     (combined brand-a × default, kept for the Swift generator)
 */

import StyleDictionary from "style-dictionary";
import { readFileSync, mkdirSync, existsSync, rmSync } from "fs";

const EXPORTS_DIR = "figma-exports";
const OUT_DIR = "dist";
const BRANDS = ["brand-a", "brand-b"];
const DENSITIES = ["default", "compact"];

// ── Font-weight string → numeric transform ─────────
// Figma needs the human weight name ("Semi Bold") to render text on its
// canvas, but CSS expects the numeric weight. We register a Style Dictionary
// transform that maps recognised weight names to their CSS values.

const FONT_WEIGHT_MAP = {
  thin: 100,
  hairline: 100,
  "extra light": 200, extralight: 200, ultralight: 200,
  light: 300,
  regular: 400, normal: 400, book: 400,
  medium: 500,
  "semi bold": 600, semibold: 600, demibold: 600,
  bold: 700,
  "extra bold": 800, extrabold: 800, ultrabold: 800,
  black: 900, heavy: 900,
};

StyleDictionary.registerTransform({
  name: "font-weight/numeric",
  type: "value",
  filter: (token) => {
    const path = token.path.join(".").toLowerCase();
    return path.includes("font-weight") || path.includes("font.weight");
  },
  transform: (token) => {
    const raw = String(token.value).trim().toLowerCase();
    return FONT_WEIGHT_MAP[raw] ?? token.value;
  },
});

// ── Font-family fallback transform ─────────────────
// Figma stores only the chosen typeface name (e.g. "Inter"). For CSS we
// append a sensible fallback chain so missing fonts don't render in Times.

const FONT_FALLBACKS = {
  Inter: ", system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  Roboto: ", system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  Gabarito: ", 'Inter', system-ui, sans-serif",
  "DM Sans": ", system-ui, sans-serif",
  "JetBrains Mono": ", 'SF Mono', Menlo, Consolas, monospace",
};

StyleDictionary.registerTransform({
  name: "font-family/fallbacks",
  type: "value",
  filter: (token) => {
    const path = token.path.join(".").toLowerCase();
    return path.includes("font-family") || path.includes("font.family");
  },
  transform: (token) => {
    const raw = String(token.value).trim();
    const fallback = FONT_FALLBACKS[raw];
    return fallback ? `'${raw}'${fallback}` : `'${raw}', system-ui, sans-serif`;
  },
});

// Custom transform group: kebab-cased CSS var names + our two font
// transforms + the built-in CSS color transform. We deliberately do not
// include any size/rem transform here — the DTCG preprocessor already
// applied px/rem units up front, so we want SD to pass values through
// unchanged.

StyleDictionary.registerTransformGroup({
  name: "css/sebell",
  transforms: [
    "attribute/cti",
    "name/kebab",
    "color/css",
    "font-weight/numeric",
    "font-family/fallbacks",
  ],
});

// ── DTCG → Style Dictionary conversion ─────────────
// Figma exports use the W3C DTCG schema ($value, $type, $extensions). Style
// Dictionary v4 supports DTCG natively but Figma's color objects are nested
// ({colorSpace, components, alpha, hex}) and dimensional values are bare
// numbers, so we walk the tree once and normalise.

function convertNode(node, path = []) {
  if (node === null || typeof node !== "object") return node;
  if (Array.isArray(node)) return node.map((n, i) => convertNode(n, [...path, String(i)]));

  // Leaf token: has $value (DTCG) or value (already-converted).
  if ("$value" in node || "value" in node) {
    let value = node.$value ?? node.value;
    const type = node.$type ?? node.type;

    // Figma color object → hex string.
    if (value && typeof value === "object" && !Array.isArray(value) && "hex" in value) {
      value = value.hex;
    }

    // Bare numeric values: add a unit. Font sizes go to rem, everything
    // else (radius, spacing, line-height, weight) stays in px or stays
    // unitless if it's a font-weight.
    if (typeof value === "number") {
      const pathStr = path.join(".").toLowerCase();
      if (pathStr.includes("font-weight") || pathStr.includes("weight")) {
        // Numeric weight, no unit.
      } else if (pathStr.includes("font-size") || pathStr.includes("font.size")) {
        value = `${+(value / 16).toFixed(4)}rem`;
      } else {
        value = `${value}px`;
      }
    }

    return { value, type };
  }

  // Branch: recurse, dropping all $-prefixed metadata keys.
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    out[k] = convertNode(v, [...path, k]);
  }
  return out;
}

// ── Deep merge of token trees ──────────────────────

function deepMerge(target, ...sources) {
  for (const source of sources) {
    if (!source || typeof source !== "object") continue;
    for (const [k, v] of Object.entries(source)) {
      const isLeaf = v && typeof v === "object" && "value" in v;
      if (!isLeaf && v && typeof v === "object" && !Array.isArray(v)) {
        target[k] = deepMerge(target[k] || {}, v);
      } else {
        target[k] = v;
      }
    }
  }
  return target;
}

function loadAndConvert(filename) {
  const raw = JSON.parse(readFileSync(`${EXPORTS_DIR}/${filename}`, "utf-8"));
  return convertNode(raw);
}

// ── Build ──────────────────────────────────────────

if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

let firstCombo = null;

for (const brand of BRANDS) {
  for (const density of DENSITIES) {
    const label = `${brand} × ${density}`;
    process.stdout.write(`▸ ${label}… `);

    const tokens = deepMerge(
      {},
      loadAndConvert(`${brand}-foundation.json`),
      loadAndConvert(`${brand}-tokens.json`),
      loadAndConvert(`${density}-tokens.json`),
    );

    const platforms = {
      css: {
        transformGroup: "css/sebell",
        buildPath: `${OUT_DIR}/`,
        files: [
          {
            destination: `${brand}-${density}.css`,
            format: "css/variables",
            options: { outputReferences: true },
          },
        ],
      },
    };

    // Also emit a JSON dump of the first combination — the Swift generator
    // reads it to produce DesignTokens.swift for iOS.
    if (!firstCombo) {
      firstCombo = `${brand}-${density}`;
      platforms.json = {
        transformGroup: "js",
        buildPath: `${OUT_DIR}/`,
        files: [
          { destination: "tokens.json", format: "json/nested" },
        ],
      };
    }

    const sd = new StyleDictionary({
      tokens,
      platforms,
      log: { warnings: "disabled", verbosity: "default" },
    });

    await sd.buildAllPlatforms();
    process.stdout.write("✓\n");
  }
}

console.log("\nOutput:");
for (const brand of BRANDS) {
  for (const density of DENSITIES) {
    console.log(`  ${OUT_DIR}/${brand}-${density}.css`);
  }
}
console.log(`  ${OUT_DIR}/tokens.json    (from ${firstCombo}, for Swift generator)`);
