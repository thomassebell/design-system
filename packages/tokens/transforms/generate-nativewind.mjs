/**
 * Generate a NativeWind / Tailwind theme fragment per brand.
 *
 * Reads packages/tokens/dist/_<brand>-theme-src.json (written by build.mjs:
 * the resolved base + light + dark trees for <brand> × default density) and
 * emits dist/<brand>-theme.cjs — a CommonJS Tailwind theme fragment a React
 * Native app (Expo + NativeWind) spreads into its tailwind.config's
 * `theme.extend`. This is the third output format alongside the web CSS and the
 * iOS Swift file: same resolved token tree, a format NativeWind can consume.
 *
 * v1 is LIGHT-ONLY by deliberate choice (see brand spec / work list): the app
 * defers dark mode, so foreground colours use the light appearance values. The
 * dark tree is still dumped by build.mjs, so a dark variant can be layered on
 * later without re-touching the build.
 *
 * Mapping (DS token tree → Tailwind theme key):
 *   color.surface.*                   → colors.surface.*      (backgrounds)
 *   color.{error,warning,success,info}→ colors.*             (status, DEFAULT = main)
 *   appearance text/border/icon (light)→ colors.text/border/icon (foreground)
 *   radius.*                          → borderRadius.*
 *   semantic.layout.*                 → spacing['layout-*']
 *   semantic.components.*             → spacing['comp-*']
 *   typography.font-size.*            → fontSize.*  (rem → px for RN)
 *   typography.line-height.*          → lineHeight.*
 *   typography.font-weight.*          → fontWeight.*  (name → numeric)
 *   typography.font-family.*          → fontFamily.*
 *
 * The app then writes classes like `bg-surface-primary`, `text-text-default`,
 * `rounded-medium`, `gap-layout-medium`, `text-display-1`, `font-header`.
 *
 * NOTE: the appearance border/icon sets are currently thin (just `default`).
 * That's a DS appearance-layer limitation, not this generator's — expand those
 * tokens in Figma if the app needs more border/icon shades.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { BRANDS as BRAND_DEFS } from "../brands.config.js";

const OUT_DIR = "dist";
const BRANDS = BRAND_DEFS.map((b) => b.id);

// ── Value helpers ─────────────────────────────────

/** "16px" → "16px"; "1rem" → "16px"; otherwise null. Phones have no rem. */
function dimToPx(value) {
  if (typeof value !== "string") return null;
  if (value.endsWith("px")) return value;
  if (value.endsWith("rem")) {
    const n = parseFloat(value);
    return Number.isNaN(n) ? null : `${Math.round(n * 16 * 1000) / 1000}px`;
  }
  return null;
}

/** Figma weight name ("Regular", "ExtraLight") → CSS numeric weight string. */
function weightToNumber(value) {
  const v = String(value).toLowerCase().trim();
  const map = {
    thin: "100", hairline: "100",
    "extra light": "200", extralight: "200", ultralight: "200",
    light: "300",
    regular: "400", normal: "400", book: "400",
    medium: "500",
    "semi bold": "600", semibold: "600", demibold: "600",
    bold: "700",
    "extra bold": "800", extrabold: "800", ultrabold: "800",
    black: "900", heavy: "900",
  };
  return map[v] ?? "400";
}

const isColor = (v) => typeof v === "string" && /^(#|rgba?\()/.test(v);

// ── Reference resolution ──────────────────────────
// Spacing + type tokens alias primitives with Style Dictionary's {a.b.c}
// syntax (e.g. semantic.layout.xsmall → "{primitive.size-8}"). Those are
// resolved by Style Dictionary at CSS-emit time, NOT by build.mjs's own
// resolver, so the dumped tree still carries them as literal strings. Resolve
// them here against the tree's own primitives (refs can chain).

function getPath(root, segments) {
  let node = root;
  for (const seg of segments) {
    if (node == null || typeof node !== "object") return undefined;
    node = node[seg];
  }
  return node;
}

function resolveRef(value, root, depth = 0) {
  let v = value;
  while (typeof v === "string" && /^\{(.+)\}$/.test(v) && depth < 20) {
    const path = v.slice(1, -1).split(".");
    v = getPath(root, path);
    depth++;
  }
  return v;
}

/** Walk a tree, replacing every {a.b.c} leaf with its resolved value. */
function deepResolve(node, root) {
  if (typeof node === "string") return resolveRef(node, root);
  if (!node || typeof node !== "object") return node;
  const out = {};
  for (const [k, v] of Object.entries(node)) out[k] = deepResolve(v, root);
  return out;
}

// ── Tree → theme builders ─────────────────────────

/**
 * Recurse a colour subtree, keeping hex/rgba leaves. For any group that has a
 * `main` or `default` leaf, add a `DEFAULT` alias so `bg-surface-primary` /
 * `text-text` resolve to the obvious value.
 */
function mapColors(node) {
  if (isColor(node)) return node;
  if (!node || typeof node !== "object") return null;
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    const mapped = mapColors(v);
    if (mapped !== null) out[k] = mapped;
  }
  if (typeof out.main === "string") out.DEFAULT = out.main;
  else if (typeof out.default === "string") out.DEFAULT = out.default;
  return Object.keys(out).length ? out : null;
}

/**
 * Flatten a subtree to dash-joined keys, transforming each leaf. Keys are
 * relative to the passed node (e.g. font-size.display.1 → "display-1"). Leaves
 * whose transform returns null are dropped.
 */
function flatten(node, transform, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(node ?? {})) {
    const key = prefix ? `${prefix}-${k}` : k;
    if (v && typeof v === "object") {
      flatten(v, transform, key, out);
    } else {
      const t = transform(v);
      if (t !== null) out[key] = t;
    }
  }
  return out;
}

function buildTheme(src) {
  const base = deepResolve(src.base, src.base);
  const light = deepResolve(src.light, src.light);
  const colorNs = base.color ?? {};

  const colors = {};
  // Backgrounds + status from the base brand tree.
  if (colorNs.surface) colors.surface = mapColors(colorNs.surface);
  for (const status of ["error", "warning", "success", "info"]) {
    if (colorNs[status]) colors[status] = mapColors(colorNs[status]);
  }
  // Foreground from the light appearance tree (the modern semantic API).
  // tab-bar rides along because the RN apps are where tab bars live; the other
  // component groups (button, forms) stay web-only until an app needs them.
  for (const fg of ["text", "border", "icon", "tab-bar"]) {
    if (light[fg]) colors[fg] = mapColors(light[fg]);
  }

  const typo = base.typography ?? {};
  return {
    colors,
    spacing: {
      ...flatten(base.semantic?.layout ?? {}, dimToPx, "layout"),
      ...flatten(base.semantic?.components ?? {}, dimToPx, "comp"),
    },
    borderRadius: flatten(base.radius ?? {}, dimToPx),
    fontSize: flatten(typo["font-size"] ?? {}, dimToPx),
    lineHeight: flatten(typo["line-height"] ?? {}, dimToPx),
    fontWeight: flatten(typo["font-weight"] ?? {}, (v) => (v == null ? null : weightToNumber(v))),
    fontFamily: flatten(typo["font-family"] ?? {}, (v) =>
      typeof v === "string" ? [String(v).split(",")[0].replace(/['"]/g, "").trim()] : null,
    ),
  };
}

// ── Emit ──────────────────────────────────────────

const emitted = [];
for (const brand of BRANDS) {
  const srcPath = `${OUT_DIR}/_${brand}-theme-src.json`;
  if (!existsSync(srcPath)) continue;
  const src = JSON.parse(readFileSync(srcPath, "utf-8"));
  const theme = buildTheme(src);

  const header =
    "// ──────────────────────────────────────────────\n" +
    `// ${brand}-theme.cjs — NativeWind / Tailwind theme fragment\n` +
    "// Auto-generated by @ds/tokens — do not edit.\n" +
    `// Source: ${brand} × default (light appearance). Run \`npm run tokens:build\`.\n` +
    "// Consume: spread into tailwind.config.js → theme.extend.\n" +
    "// ──────────────────────────────────────────────\n";
  writeFileSync(`${OUT_DIR}/${brand}-theme.cjs`, `${header}module.exports = ${JSON.stringify(theme, null, 2)};\n`);

  const nColors = Object.keys(theme.colors).length;
  emitted.push(
    `${brand}: ${nColors} colour groups, ${Object.keys(theme.spacing).length} spacing, ` +
      `${Object.keys(theme.fontSize).length} font sizes`,
  );
}

console.log(`✓ NativeWind themes generated (${emitted.length}):`);
for (const line of emitted) console.log(`    dist/${line.split(":")[0]}-theme.cjs — ${line.split(": ")[1]}`);
