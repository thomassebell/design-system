/**
 * Token build script.
 *
 * Reads Figma's W3C-DTCG exports directly from figma-exports/, merges the
 * foundation + brand-tokens + density-tokens for each (brand × density)
 * combination, and emits one CSS file per combination via Style Dictionary.
 *
 * Output:
 *   dist/sebell-default.css
 *   dist/sebell-compact.css
 *   dist/brand-a-default.css
 *   dist/brand-a-compact.css
 *   dist/brand-b-default.css
 *   dist/brand-b-compact.css
 *   dist/tokens.json     (combined sebell × default, kept for the Swift generator)
 *   dist/_<brand>-theme-src.json  (resolved base/light/dark trees per brand at
 *                                  default density — fed to the NativeWind
 *                                  theme generator, transforms/generate-nativewind)
 */

import StyleDictionary from "style-dictionary";
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, readdirSync } from "fs";
import { execSync } from "child_process";
import { BRANDS as BRAND_DEFS, DENSITIES as DENSITY_DEFS } from "./brands.config.js";

const EXPORTS_DIR = "figma-exports";
const OUT_DIR = "dist";
// Brands and densities come from the single source of truth shared with
// Storybook — see ./brands.config.js. build.mjs only needs the id strings, so
// we map the rich {id,title} defs down to ids here; every loop below keeps
// working with plain string arrays exactly as before.
// Order matters: BRANDS[0] × DENSITIES[0] is `firstCombo`, which feeds
// dist/tokens.json → DesignTokens.swift. Sebell is the production brand;
// brand-a and brand-b stay as test fixtures that exercise the multi-brand
// pipeline (cross-brand consistency, alias misalignment, structural diff).
const BRANDS = BRAND_DEFS.map((b) => b.id);
const DENSITIES = DENSITY_DEFS.map((d) => d.id);

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
  Montserrat: ", system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  "DM Sans": ", system-ui, sans-serif",
  "JetBrains Mono": ", 'SF Mono', Menlo, Consolas, monospace",
  "Noto Serif": ", Georgia, 'Times New Roman', serif",
  "Noto Sans": ", -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
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

    // Figma color object → hex string. For colours with alpha < 1 (e.g. the
    // transparent form fills used on dark surfaces) the 6-digit hex drops the
    // alpha, so emit rgba() from the raw components instead to preserve it.
    if (value && typeof value === "object" && !Array.isArray(value) && "hex" in value) {
      if (typeof value.alpha === "number" && value.alpha < 1 && Array.isArray(value.components)) {
        const [r, g, b] = value.components.map((c) => Math.round(c * 255));
        value = `rgba(${r}, ${g}, ${b}, ${+value.alpha.toFixed(3)})`;
      } else {
        value = value.hex;
      }
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

// ── Pre-flight: Figma export health ─────────────────
// Catch authoring drift before it reaches the build. Each check is a
// distinct class of bug we've either hit or are likely to hit:
//   1. Cross-brand alias misalignment (brand-X aliases brand-Y-foundation)
//   2. Cross-brand inconsistency (token in one brand-tokens but not the other),
//      with Levenshtein-close names flagged as likely typos
//   3. $type mismatches across brands (same path, different $type)

function walkLeaves(node, fn, path = []) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return;
  if ("$value" in node) {
    fn(path, node);
    return;
  }
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    walkLeaves(v, fn, [...path, k]);
  }
}

function collectLeafIndex(raw) {
  const index = new Map(); // dot-path → { type }
  walkLeaves(raw, (path, leaf) => {
    index.set(path.join("."), { type: leaf.$type ?? null });
  });
  return index;
}

function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }
  return dp[a.length][b.length];
}

function closestPath(needle, haystack, maxDistance = 2) {
  let best = null;
  let bestDist = Infinity;
  for (const candidate of haystack) {
    const d = levenshtein(needle, candidate);
    if (d < bestDist) {
      bestDist = d;
      best = candidate;
    }
  }
  return bestDist <= maxDistance ? { path: best, distance: bestDist } : null;
}

function findCrossBrandAliases(node, fileBrand) {
  const wrongBrandFoundations = BRANDS
    .filter((b) => b !== fileBrand)
    .map((b) => `${b}-foundation`);
  const issues = [];
  function walk(n, path) {
    if (!n || typeof n !== "object" || Array.isArray(n)) return;
    const aliasData = n.$extensions?.["com.figma.aliasData"];
    if (aliasData && wrongBrandFoundations.includes(aliasData.targetVariableSetName)) {
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

const preflightIssues = { aliasMisalignment: [], missing: [], likelyTypos: [], typeMismatches: [] };

const brandTokenIndexes = {};
const brandTokenRawByBrand = {};
for (const brand of BRANDS) {
  const filename = `${brand}.tokens.json`;
  const raw = JSON.parse(readFileSync(`${EXPORTS_DIR}/${filename}`, "utf-8"));
  brandTokenRawByBrand[brand] = raw;
  brandTokenIndexes[brand] = collectLeafIndex(raw);
  for (const issue of findCrossBrandAliases(raw, brand)) {
    preflightIssues.aliasMisalignment.push({ file: filename, ...issue });
  }
}

// Cross-brand consistency + typo detection + type mismatches.
// For each pair of brands, walk one's index and check the other.
for (let i = 0; i < BRANDS.length; i++) {
  for (let j = i + 1; j < BRANDS.length; j++) {
    const a = BRANDS[i], b = BRANDS[j];
    const aIndex = brandTokenIndexes[a];
    const bIndex = brandTokenIndexes[b];
    const aPaths = [...aIndex.keys()];
    const bPaths = [...bIndex.keys()];

    for (const path of aPaths) {
      if (bIndex.has(path)) {
        const aType = aIndex.get(path).type;
        const bType = bIndex.get(path).type;
        if (aType !== bType) {
          preflightIssues.typeMismatches.push({ path, [a]: aType, [b]: bType });
        }
      } else {
        const close = closestPath(path, bPaths);
        if (close) {
          preflightIssues.likelyTypos.push({
            inBrand: a, missingFromBrand: b, path, suggestion: close.path, distance: close.distance,
          });
        } else {
          preflightIssues.missing.push({ inBrand: a, missingFromBrand: b, path });
        }
      }
    }
    for (const path of bPaths) {
      if (!aIndex.has(path)) {
        const close = closestPath(path, aPaths);
        if (close) {
          // Already flagged from a-side scan if path-pair is symmetric; dedupe.
          const already = preflightIssues.likelyTypos.some(
            (t) => t.path === close.path && t.suggestion === path,
          );
          if (!already) {
            preflightIssues.likelyTypos.push({
              inBrand: b, missingFromBrand: a, path, suggestion: close.path, distance: close.distance,
            });
          }
        } else {
          preflightIssues.missing.push({ inBrand: b, missingFromBrand: a, path });
        }
      }
    }
  }
}

let preflightFatal = false;

if (preflightIssues.aliasMisalignment.length > 0) {
  preflightFatal = true;
  console.error(`\n✗ ${preflightIssues.aliasMisalignment.length} cross-brand alias misalignment(s):`);
  for (const i of preflightIssues.aliasMisalignment) {
    console.error(`    ${i.file} :: ${i.path}`);
    console.error(`      → ${i.targetSet}::${i.targetVar}`);
  }
  console.error("  Re-point these aliases in Figma to the same-brand foundation, then re-export.");
}

if (preflightIssues.typeMismatches.length > 0) {
  preflightFatal = true;
  console.error(`\n✗ ${preflightIssues.typeMismatches.length} $type mismatch(es) across brands:`);
  for (const m of preflightIssues.typeMismatches) {
    const types = BRANDS.map((b) => `${b}=${m[b] ?? "missing"}`).join(", ");
    console.error(`    ${m.path}: ${types}`);
  }
}

if (preflightIssues.likelyTypos.length > 0) {
  console.warn(`\n⚠ ${preflightIssues.likelyTypos.length} likely typo(s) — token names differ by 1–2 characters across brands:`);
  for (const t of preflightIssues.likelyTypos) {
    console.warn(`    "${t.path}" exists in ${t.inBrand} but not ${t.missingFromBrand}`);
    console.warn(`      closest match in ${t.missingFromBrand}: "${t.suggestion}" (distance ${t.distance})`);
    console.warn(`      → fix the typo in Figma, in whichever file's name is wrong`);
  }
}

if (preflightIssues.missing.length > 0) {
  console.warn(`\n⚠ ${preflightIssues.missing.length} token(s) defined in only one brand:`);
  for (const m of preflightIssues.missing) {
    console.warn(`    "${m.path}" — defined in ${m.inBrand}, missing from ${m.missingFromBrand}`);
  }
}

if (preflightFatal) {
  throw new Error("Token validation failed — fix the errors above and re-export.");
}

if (
  preflightIssues.likelyTypos.length === 0 &&
  preflightIssues.missing.length === 0 &&
  preflightIssues.typeMismatches.length === 0 &&
  preflightIssues.aliasMisalignment.length === 0
) {
  console.log("✓ Figma export health: all brands consistent, no alias misalignment");
}

// ── Structural diff vs git HEAD ─────────────────────
// Compares current figma-exports against the last committed version.
// Surfaces added / removed / renamed / retyped tokens, and for genuinely
// removed tokens, greps packages/react/src for stale `var(--…)` references.
// Strictly informational — never blocks the build.

function loadJSONFromGit(cwdRelativePath) {
  // Prefix with ./ so git treats the path as cwd-relative (build script runs
  // from packages/tokens/, not the repo root).
  try {
    const content = execSync(`git show HEAD:./${cwdRelativePath}`, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return JSON.parse(content);
  } catch (_) {
    return null;
  }
}

function indexAllTokens(jsonFiles) {
  const merged = {};
  for (const f of jsonFiles) {
    if (!f) continue;
    function mergeRaw(target, source) {
      for (const [k, v] of Object.entries(source)) {
        if (k.startsWith("$")) continue;
        if (v && typeof v === "object" && !Array.isArray(v) && !("$value" in v)) {
          target[k] = target[k] || {};
          mergeRaw(target[k], v);
        } else {
          target[k] = v;
        }
      }
    }
    mergeRaw(merged, f);
  }
  const index = new Map();
  walkLeaves(merged, (path, leaf) => {
    index.set(path.join("."), { type: leaf.$type ?? null });
  });
  return index;
}

const exportNames = readdirSync(EXPORTS_DIR).filter((f) => f.endsWith(".json"));

const currentExports = exportNames.map((f) =>
  JSON.parse(readFileSync(`${EXPORTS_DIR}/${f}`, "utf-8")),
);

// List whatever figma-exports were committed at HEAD (file names may differ
// from current — e.g. after a rename — so don't look up by current names).
function listExportsAtHead() {
  try {
    const out = execSync(
      `git ls-tree --name-only HEAD ${EXPORTS_DIR}/`,
      { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] },
    );
    return out.trim().split("\n").filter((p) => p.endsWith(".json"));
  } catch (_) {
    return [];
  }
}

const previousExports = listExportsAtHead()
  .map((p) => loadJSONFromGit(p))
  .filter(Boolean);

if (previousExports.length > 0) {
  const currentIndex = indexAllTokens(currentExports);
  const previousIndex = indexAllTokens(previousExports);
  const currentPaths = new Set(currentIndex.keys());
  const previousPaths = new Set(previousIndex.keys());

  const removed = [...previousPaths].filter((p) => !currentPaths.has(p));
  const added = [...currentPaths].filter((p) => !previousPaths.has(p));

  // Rename detection: pair each removed with its closest-spelled added.
  const renames = [];
  const trulyRemoved = [];
  const claimedAdded = new Set();
  for (const r of removed) {
    const pool = added.filter((a) => !claimedAdded.has(a));
    const close = closestPath(r, pool, 3);
    if (close) {
      renames.push({ from: r, to: close.path });
      claimedAdded.add(close.path);
    } else {
      trulyRemoved.push(r);
    }
  }
  const trulyAdded = added.filter((a) => !claimedAdded.has(a));

  const retyped = [];
  for (const path of previousPaths) {
    if (currentPaths.has(path)) {
      const oldType = previousIndex.get(path).type;
      const newType = currentIndex.get(path).type;
      if (oldType !== newType) {
        retyped.push({ path, from: oldType, to: newType });
      }
    }
  }

  // Grep CSS Modules + plain CSS for stale var(--…) references.
  // For renames, the reference is *also* stale (still points at old name).
  const staleQuery = [
    ...trulyRemoved.map((p) => ({ kind: "removed", path: p })),
    ...renames.map((r) => ({ kind: "renamed", path: r.from, to: r.to })),
  ];
  const staleRefs = [];
  for (const q of staleQuery) {
    const cssVar = "--" + q.path.replace(/\./g, "-");
    try {
      const out = execSync(
        `grep -rn --include="*.css" -F "var(${cssVar})" . || true`,
        { encoding: "utf-8", cwd: "../react/src" },
      ).trim();
      if (out) {
        staleRefs.push({ ...q, cssVar, refs: out.split("\n") });
      }
    } catch (_) {}
  }

  const total = trulyAdded.length + renames.length + retyped.length + trulyRemoved.length;
  if (total > 0) {
    console.log("\nStructural diff vs. git HEAD:");
    if (trulyAdded.length) {
      console.log(`  + added (${trulyAdded.length}):`);
      for (const a of trulyAdded.slice(0, 20)) console.log(`      ${a}`);
      if (trulyAdded.length > 20) console.log(`      … +${trulyAdded.length - 20} more`);
    }
    if (renames.length) {
      console.log(`  ↻ renamed (${renames.length}):`);
      for (const r of renames) console.log(`      ${r.from} → ${r.to}`);
    }
    if (retyped.length) {
      console.log(`  ↻ retyped (${retyped.length}):`);
      for (const t of retyped) console.log(`      ${t.path}: ${t.from} → ${t.to}`);
    }
    if (trulyRemoved.length) {
      console.log(`  − removed (${trulyRemoved.length}):`);
      for (const r of trulyRemoved) console.log(`      ${r}`);
    }
    if (staleRefs.length) {
      console.log(`\n  ⚠ ${staleRefs.length} of those still referenced in code — fix before shipping:`);
      for (const s of staleRefs) {
        const verb = s.kind === "renamed" ? `renamed → ${s.to}` : "removed";
        console.log(`      var(${s.cssVar})  [${verb}]:`);
        for (const ref of s.refs) console.log(`        ${ref}`);
      }
    }
  } else {
    console.log("Structural diff vs. git HEAD: no token additions, removals, renames, or type changes.");
  }
}

// ── Build ──────────────────────────────────────────

if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

// ── Pre-flight: appearance light/dark parity ───────
// The dark override only works if every light appearance token has a dark
// counterpart (and vice-versa) — a mismatch would silently drop or add a var
// in one surface. Compare the two trees' leaf paths before building.
{
  const leafPaths = (tree, prefix = [], acc = []) => {
    for (const [k, v] of Object.entries(tree)) {
      if (v && typeof v === "object" && "value" in v) acc.push([...prefix, k].join("."));
      else if (v && typeof v === "object") leafPaths(v, [...prefix, k], acc);
    }
    return acc;
  };
  const lp = new Set(leafPaths(loadAndConvert("light.tokens.json")));
  const dp = new Set(leafPaths(loadAndConvert("dark.tokens.json")));
  const onlyLight = [...lp].filter((p) => !dp.has(p));
  const onlyDark = [...dp].filter((p) => !lp.has(p));
  if (onlyLight.length || onlyDark.length) {
    console.error("✗ appearance light/dark mismatch:");
    if (onlyLight.length) console.error(`  only in light: ${onlyLight.join(", ")}`);
    if (onlyDark.length) console.error(`  only in dark: ${onlyDark.join(", ")}`);
    process.exit(1);
  }
  console.log(`✓ appearance: ${lp.size} tokens, light/dark in parity`);
}

let firstCombo = null;

// Appearance tokens live under these unique top-level groups (no overlap with
// brand `color`/`components` or foundation `primitive`), so we can build a pass
// over the FULL merged tree — so cross-references into brand resolve — yet emit
// only the appearance vars via this filter.
const APPEARANCE_ROOTS = new Set(["text", "border", "icon", "button", "forms", "tab-bar"]);

// Build a CSS selector block containing only the appearance tokens (resolved
// against the full tree) and append it to an existing file. One Style
// Dictionary pass with the same transformGroup → identical var names.
async function appendSelectorBlock(mainFile, fullTree, selector, tag) {
  const tmp = `${OUT_DIR}/_${tag}.css`;
  const sd = new StyleDictionary({
    tokens: fullTree,
    platforms: {
      css: {
        transformGroup: "css/sebell",
        buildPath: `${OUT_DIR}/`,
        files: [
          {
            destination: `_${tag}.css`,
            format: "css/variables",
            filter: (token) => APPEARANCE_ROOTS.has(token.path[0]),
            options: { selector, outputReferences: false },
          },
        ],
      },
    },
    log: { warnings: "disabled", verbosity: "default" },
  });
  await sd.buildAllPlatforms();
  writeFileSync(mainFile, `${readFileSync(mainFile, "utf-8")}\n${readFileSync(tmp, "utf-8")}`);
  rmSync(tmp);
}

// Collapse a resolved token tree ({value,type,_alias} leaves) down to a plain
// nested object of string values — the same shape Style Dictionary's
// json/nested emits. The NativeWind generator (transforms/generate-nativewind)
// consumes this. We dump the base + light + dark trees so a JS/Tailwind theme
// can be produced for any consumer that can't read CSS variables (e.g. a React
// Native app using NativeWind).
function flattenValues(node) {
  if (node && typeof node === "object" && "value" in node) return node.value;
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (v && typeof v === "object") out[k] = flattenValues(v);
  }
  return out;
}

for (const brand of BRANDS) {
  for (const density of DENSITIES) {
    const label = `${brand} × ${density}`;
    process.stdout.write(`▸ ${label}… `);

    const foundation = loadAndConvert(`${brand}-foundation.tokens.json`);
    const brandTokens = loadAndConvert(`${brand}.tokens.json`);
    const densityTokens = loadAndConvert(`${density}.tokens.json`);

    // Resolve aliases bottom-up so each layer sees its dependencies as
    // literal values, not as references that point back into themselves.
    // Brand's context includes density too — brand semantic tokens
    // sometimes reference layout primitives (e.g. focus-ring/width →
    // primitive/size-2), and those primitives live in the density tree.
    // No cycle risk: density's intra-tree aliases use Style Dictionary
    // {…} syntax, not the aliasData extension this resolver follows.
    resolveAliases(foundation, foundation);
    resolveAliases(brandTokens, deepMerge({}, foundation, densityTokens, brandTokens));
    resolveAliases(densityTokens, deepMerge({}, foundation, brandTokens));

    // Appearance (light/dark surface mode). The appearance tokens alias into
    // brand semantics/components, so resolve them against this combo's brand
    // tree to get per-brand light and dark values. They are emitted as two
    // self-contained selector blocks appended below (NOT merged into :root) so
    // a nested subtree can override the surface in either direction.
    const appearanceLight = loadAndConvert("light.tokens.json");
    const appearanceDark = loadAndConvert("dark.tokens.json");
    const brandContext = deepMerge({}, foundation, densityTokens, brandTokens);
    resolveAliases(appearanceLight, brandContext);
    resolveAliases(appearanceDark, brandContext);

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

    // Append the appearance surface blocks. Light is scoped to both :root (the
    // default surface) and [data-surface="light"] so a light island can reset
    // inside a dark section; dark is scoped to [data-surface="dark"]. Both are
    // descendant-matchable, so nesting overrides the surface either direction.
    const mainFile = `${OUT_DIR}/${brand}-${density}.css`;
    const lightTree = deepMerge({}, foundation, brandTokens, densityTokens, appearanceLight);
    const darkTree = deepMerge({}, foundation, brandTokens, densityTokens, appearanceDark);
    await appendSelectorBlock(mainFile, lightTree, ':root,\n[data-surface="light"]', `light-${brand}-${density}`);
    await appendSelectorBlock(mainFile, darkTree, '[data-surface="dark"]', `dark-${brand}-${density}`);

    // Dump the resolved trees (default density only) for the NativeWind theme
    // generator. base = brand surfaces/status/spacing/type; light/dark = the
    // appearance foreground sets. Static phone themes don't use compact, so we
    // only emit the default-density combo.
    if (density === DENSITIES[0]) {
      writeFileSync(
        `${OUT_DIR}/_${brand}-theme-src.json`,
        JSON.stringify(
          { base: flattenValues(tokens), light: flattenValues(lightTree), dark: flattenValues(darkTree) },
          null,
          2,
        ),
      );
    }

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
