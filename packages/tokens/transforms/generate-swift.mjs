/**
 * Generate Swift design tokens from the merged token JSON.
 *
 * Reads packages/tokens/dist/tokens.json (currently the sebell × default
 * combination produced by build.mjs — controlled by BRANDS[0] in build.mjs)
 * and emits a SwiftUI-friendly DesignTokens.swift into the ios-tokens
 * package.
 *
 * Output layout:
 *   extension Color { ... semantic + component colors }
 *   enum DSRadius { ... }
 *   enum DSSpacing.{Layout, Components} { ... }
 *   enum DSFontSize { ... }
 *   enum DSLineHeight { ... }
 *   enum DSFontWeight { ... } (typed as Font.Weight)
 *   enum DSFontFamily { ... } (typed as String)
 *
 * iOS apps using SwiftPM consume this via `import DSTokens` and reference
 *   Color.surfacePrimaryMain
 *   DSSpacing.Components.medium
 *   etc.
 *
 * Multi-brand iOS support is future work — currently only one Swift file
 * is emitted (matching the brand × density chosen by build.mjs's
 * `firstCombo`). To support more brands, generate per-combination Swift
 * files and let the consuming app pick at link time.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";

const TOKENS_PATH = "dist/tokens.json";
const OUTPUT_PATH = "../ios-tokens/output/DesignTokens.swift";

const tokens = JSON.parse(readFileSync(TOKENS_PATH, "utf-8"));

// ── Helpers ───────────────────────────────────────

/** Walk the nested object, yielding `{ path, value }` for every string leaf. */
function* leaves(obj, path = []) {
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string") {
      yield { path: [...path, k], value: v };
    } else if (v && typeof v === "object") {
      yield* leaves(v, [...path, k]);
    }
  }
}

const all = [...leaves(tokens)];

const SWIFT_KEYWORDS = new Set([
  "default", "class", "struct", "enum", "protocol", "extension",
  "for", "while", "if", "else", "switch", "case", "break", "continue",
  "return", "func", "var", "let", "init", "deinit", "self", "super",
  "true", "false", "nil", "import", "as", "is", "in", "guard", "defer",
]);

/** Camel-case a path of segments (each segment may contain hyphens). */
function camelize(parts) {
  let out = "";
  let isFirst = true;
  for (const part of parts) {
    for (const word of part.split("-")) {
      if (!word) continue;
      if (isFirst) {
        out += word.toLowerCase();
        isFirst = false;
      } else {
        out += word[0].toUpperCase() + word.slice(1).toLowerCase();
      }
    }
  }
  return out;
}

/** Wrap Swift keywords in backticks so they're valid identifiers. */
function safeIdentifier(name) {
  return SWIFT_KEYWORDS.has(name) ? `\`${name}\`` : name;
}

/** Convert a 6/8-char hex string into a SwiftUI Color initializer. */
function hexToColor(hex) {
  const h = hex.replace("#", "");
  if (h.length !== 6 && h.length !== 8) return null;
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  const f = (n) => n.toFixed(3);
  if (h.length === 8) {
    const a = parseInt(h.substring(6, 8), 16) / 255;
    return `Color(red: ${f(r)}, green: ${f(g)}, blue: ${f(b)}, opacity: ${f(a)})`;
  }
  return `Color(red: ${f(r)}, green: ${f(g)}, blue: ${f(b)})`;
}

/** "16px" → 16; "1rem" → 16; "0.875rem" → 14. */
function dimensionToCGFloat(value) {
  if (typeof value !== "string") return null;
  const num = parseFloat(value);
  if (Number.isNaN(num)) return null;
  if (value.endsWith("rem")) return Math.round(num * 16 * 100) / 100;
  if (value.endsWith("px")) return num;
  return null;
}

/** Map Figma font-weight names to SwiftUI Font.Weight cases. */
function fontWeightToSwift(value) {
  const v = String(value).toLowerCase().trim();
  const map = {
    "thin": ".thin",
    "hairline": ".thin",
    "extra light": ".ultraLight",
    "extralight": ".ultraLight",
    "ultralight": ".ultraLight",
    "light": ".light",
    "regular": ".regular",
    "normal": ".regular",
    "book": ".regular",
    "medium": ".medium",
    "semi bold": ".semibold",
    "semibold": ".semibold",
    "demibold": ".semibold",
    "bold": ".bold",
    "extra bold": ".heavy",
    "extrabold": ".heavy",
    "heavy": ".heavy",
    "black": ".black",
  };
  return map[v] ?? ".regular";
}

const isHex = (v) => typeof v === "string" && /^#[0-9a-fA-F]{6,8}$/.test(v);

// ── Categorize ────────────────────────────────────

const semanticColors = all.filter((t) => t.path[0] === "color" && isHex(t.value));
const componentColors = all.filter((t) => t.path[0] === "components" && isHex(t.value));
const radii = all.filter(
  (t) => t.path[0] === "radius" && dimensionToCGFloat(t.value) !== null,
);
const semanticLayout = all.filter((t) => t.path[0] === "semantic" && t.path[1] === "layout");
const semanticComponents = all.filter((t) => t.path[0] === "semantic" && t.path[1] === "components");
const fontSizes = all.filter((t) => t.path[0] === "typography" && t.path[1] === "font-size");
const lineHeights = all.filter((t) => t.path[0] === "typography" && t.path[1] === "line-height");
const fontWeights = all.filter((t) => t.path[0] === "typography" && t.path[1] === "font-weight");
const fontFamilies = all.filter((t) => t.path[0] === "typography" && t.path[1] === "font-family");

// ── Build output ──────────────────────────────────

const lines = [
  "// ──────────────────────────────────────────────",
  "// DesignTokens.swift",
  "// Auto-generated by @ds/tokens — do not edit.",
  "// Source: packages/tokens/dist/tokens.json (brand-a × default).",
  "// Run `npm run tokens:build` to regenerate.",
  "// ──────────────────────────────────────────────",
  "",
  "import SwiftUI",
  "",
];

// Colors (semantic + component-specific).
if (semanticColors.length || componentColors.length) {
  lines.push("// MARK: - Colors", "extension Color {");
  for (const t of semanticColors) {
    const c = hexToColor(t.value);
    if (!c) continue;
    const name = safeIdentifier(camelize(t.path.slice(1))); // drop "color" prefix
    lines.push(`    static let ${name} = ${c}`);
  }
  for (const t of componentColors) {
    const c = hexToColor(t.value);
    if (!c) continue;
    const name = safeIdentifier(camelize(t.path)); // keep "components" prefix
    lines.push(`    static let ${name} = ${c}`);
  }
  lines.push("}", "");
}

// Radius.
if (radii.length) {
  lines.push("// MARK: - Radius", "enum DSRadius {");
  for (const t of radii) {
    const v = dimensionToCGFloat(t.value);
    const name = safeIdentifier(camelize(t.path.slice(1))); // drop "radius" prefix
    lines.push(`    static let ${name}: CGFloat = ${v}`);
  }
  lines.push("}", "");
}

// Spacing — split into Layout (between things) and Components (inside things).
if (semanticLayout.length || semanticComponents.length) {
  lines.push("// MARK: - Spacing", "enum DSSpacing {");
  if (semanticLayout.length) {
    lines.push("    enum Layout {");
    for (const t of semanticLayout) {
      const v = dimensionToCGFloat(t.value);
      if (v === null) continue;
      const name = safeIdentifier(camelize(t.path.slice(2)));
      lines.push(`        static let ${name}: CGFloat = ${v}`);
    }
    lines.push("    }");
  }
  if (semanticComponents.length) {
    lines.push("    enum Components {");
    for (const t of semanticComponents) {
      const v = dimensionToCGFloat(t.value);
      if (v === null) continue;
      const name = safeIdentifier(camelize(t.path.slice(2)));
      lines.push(`        static let ${name}: CGFloat = ${v}`);
    }
    lines.push("    }");
  }
  lines.push("}", "");
}

// Font sizes (including the typography.font-size.components.* sub-namespace).
if (fontSizes.length) {
  lines.push("// MARK: - Font Sizes", "enum DSFontSize {");
  for (const t of fontSizes) {
    const v = dimensionToCGFloat(t.value);
    if (v === null) continue;
    const name = safeIdentifier(camelize(t.path.slice(2))); // drop "typography.font-size"
    lines.push(`    static let ${name}: CGFloat = ${v}`);
  }
  lines.push("}", "");
}

// Line heights.
if (lineHeights.length) {
  lines.push("// MARK: - Line Heights", "enum DSLineHeight {");
  for (const t of lineHeights) {
    const v = dimensionToCGFloat(t.value);
    if (v === null) continue;
    const name = safeIdentifier(camelize(t.path.slice(2)));
    lines.push(`    static let ${name}: CGFloat = ${v}`);
  }
  lines.push("}", "");
}

// Font weights — typed as Font.Weight, mapped from Figma's display strings.
if (fontWeights.length) {
  lines.push("// MARK: - Font Weights", "enum DSFontWeight {");
  for (const t of fontWeights) {
    const sw = fontWeightToSwift(t.value);
    const name = safeIdentifier(camelize(t.path.slice(2)));
    lines.push(`    static let ${name}: Font.Weight = ${sw}`);
  }
  lines.push("}", "");
}

// Font families — strip any fallback chain, expose just the primary face.
if (fontFamilies.length) {
  lines.push("// MARK: - Font Families", "enum DSFontFamily {");
  for (const t of fontFamilies) {
    const primary = String(t.value).split(",")[0].replace(/['"]/g, "").trim();
    const name = safeIdentifier(camelize(t.path.slice(2)));
    lines.push(`    static let ${name}: String = "${primary}"`);
  }
  lines.push("}", "");
}

// ── Write ─────────────────────────────────────────

const outDir = OUTPUT_PATH.split("/").slice(0, -1).join("/");
mkdirSync(outDir, { recursive: true });
writeFileSync(OUTPUT_PATH, lines.join("\n") + "\n");
console.log(
  `✓ ${OUTPUT_PATH} generated — ` +
    `${semanticColors.length + componentColors.length} colors, ` +
    `${radii.length} radii, ` +
    `${semanticLayout.length + semanticComponents.length} spacings, ` +
    `${fontSizes.length} font sizes, ${lineHeights.length} line heights, ` +
    `${fontWeights.length} weights, ${fontFamilies.length} families`,
);
