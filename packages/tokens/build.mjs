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

    const out = { value, type };

    // Preserve Figma's alias target so we can re-resolve it at build time
    // against the current brand × density combo. Without this we'd be stuck
    // with whatever value Figma baked at export time, which is wrong for
    // any combo other than the one that was active during the export.
    const aliasTarget = node.$extensions?.["com.figma.aliasData"]?.targetVariableName;
    if (aliasTarget) out._alias = aliasTarget;

    return out;
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

// ── Alias resolution ───────────────────────────────
// Figma's exporter writes the alias chain (e.g. density.radius.small →
// brand.radius.small → primitive.radius.round) as metadata, but bakes the
// resolved value at the moment of export. That value is correct only for
// whichever brand was active when the user clicked Export, so for any
// other combo we re-resolve the alias against the *current* combo's tree.
//
// Each layer resolves against the trees beneath it in the cascade:
//   foundation  → resolves against itself (primitives, usually no aliases)
//   brand       → resolves against (foundation + brand)
//   density     → resolves against (foundation + brand) — *not* itself,
//                  otherwise an alias like `radius/small` would self-reference.

function getByPath(tree, slashPath) {
  let cur = tree;
  for (const seg of slashPath.split("/")) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = cur[seg];
  }
  return cur;
}

function resolveAliases(tree, context) {
  const MAX_DEPTH = 16;

  function chase(target, depth) {
    if (depth > MAX_DEPTH) {
      throw new Error(`Alias chain exceeded depth ${MAX_DEPTH}`);
    }
    if (!target || typeof target !== "object" || !("value" in target)) return target;
    if (!target._alias) return target;
    const next = getByPath(context, target._alias);
    return chase(next, depth + 1);
  }

  function walk(node) {
    if (!node || typeof node !== "object") return;
    if ("value" in node) {
      if (node._alias) {
        const resolved = chase(getByPath(context, node._alias), 0);
        if (resolved && "value" in resolved) {
          node.value = resolved.value;
        } else {
          console.warn(`  ⚠ alias "${node._alias}" not found — keeping baked value`);
        }
        delete node._alias;
      }
      return;
    }
    for (const v of Object.values(node)) walk(v);
  }
  walk(tree);
}

// ── Pre-flight: detect cross-brand alias misalignment ──
// Brand-X tokens should never alias values from brand-Y's foundation —
// it silently makes brand X "borrow" brand Y's primitives. We hit this
// twice when re-pointing greys/sands between brand-a-foundation and
// brand-b-foundation; this check makes the next occurrence a hard
// build failure with a pointer to the offending Figma variable.

function findCrossBrandAliases(node, fileBrand) {
  const wrongBrand = fileBrand === "brand-a" ? "brand-b" : "brand-a";
  const issues = [];

  function walk(n, path) {
    if (!n || typeof n !== "object" || Array.isArray(n)) return;
    const aliasData = n.$extensions?.["com.figma.aliasData"];
    if (aliasData?.targetVariableSetName === `${wrongBrand}-foundation`) {
      issues.push({
        path: path.join("."),
        targetSet: aliasData.targetVariableSetName,
        targetVar: aliasData.targetVariableName,
      });
    }
    for (const [k, v] of Object.entries(n)) {
      if (k.startsWith("$")) continue;
      walk(v, [...path, k]);
    }
  }

  walk(node, []);
  return issues;
}

const crossBrandIssues = [];
for (const brand of BRANDS) {
  const filename = `${brand}-tokens.json`;
  const raw = JSON.parse(readFileSync(`${EXPORTS_DIR}/${filename}`, "utf-8"));
  for (const issue of findCrossBrandAliases(raw, brand)) {
    crossBrandIssues.push({ file: filename, ...issue });
  }
}
if (crossBrandIssues.length > 0) {
  console.error(`\n✗ Found ${crossBrandIssues.length} cross-brand alias misalignment(s):\n`);
  for (const i of crossBrandIssues) {
    console.error(`  ${i.file} :: ${i.path}`);
    console.error(`    → ${i.targetSet}::${i.targetVar}`);
  }
  console.error(
    "\nRe-point these aliases in Figma to the matching same-brand " +
      "foundation, then re-export.\n",
  );
  throw new Error("Cross-brand alias misalignment detected");
}

// ── Build ──────────────────────────────────────────

if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

let firstCombo = null;

for (const brand of BRANDS) {
  for (const density of DENSITIES) {
    const label = `${brand} × ${density}`;
    process.stdout.write(`▸ ${label}… `);

    const foundation = loadAndConvert(`${brand}-foundation.json`);
    const brandTokens = loadAndConvert(`${brand}-tokens.json`);
    const densityTokens = loadAndConvert(`${density}-tokens.json`);

    // Resolve aliases bottom-up so each layer sees its dependencies as
    // literal values, not as references that point back into themselves.
    resolveAliases(foundation, foundation);
    resolveAliases(brandTokens, deepMerge({}, foundation, brandTokens));
    resolveAliases(densityTokens, deepMerge({}, foundation, brandTokens));

    const tokens = deepMerge({}, foundation, brandTokens, densityTokens);

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
