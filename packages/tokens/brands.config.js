/**
 * Single source of truth for the brands and densities the design system ships.
 *
 * Adding (or removing) a brand or density is ONE edit in this file. Everything
 * that needs to enumerate the brand × density matrix reads from here, so the
 * lists can never drift out of sync:
 *
 *   - packages/tokens/build.mjs            — which CSS files to emit; the first
 *                                            brand × first density is the combo
 *                                            fed to the iOS Swift generator
 *                                            (dist/tokens.json).
 *   - packages/react/.storybook/preview.js — toolbar items, the per-mode token
 *                                            stylesheets, Chromatic snapshot
 *                                            modes, the initial globals, and
 *                                            the web-font loading (via
 *                                            GOOGLE_FONTS_URL below).
 *
 * ORDER MATTERS: the FIRST brand and FIRST density are the system defaults
 * (Storybook's initial view + the iOS default combo). Keep the production
 * brand (sebell) first. brand-a / brand-b are test fixtures that exercise the
 * multi-brand pipeline.
 *
 * `id`    — the slug used in token filenames (e.g. `sebell-default.css`),
 *           CSS mode names, and Storybook global values. Must match the
 *           figma-exports / dist filenames exactly.
 * `title` — the human label shown in the Storybook toolbar.
 * `fonts` — the Google Fonts families + weights the brand's type ramp uses,
 *           plus each family's CSS fallback chain (what follows the family
 *           name in the emitted font-family value). Keep in sync with the
 *           brand's typography/font-family and font-weight tokens in Figma;
 *           the token build has no font-file knowledge, so this is where a
 *           font change (e.g. Prep+Eat's Montserrat → IBM Plex Sans,
 *           July 2026) must be mirrored.
 */

const SANS_FALLBACK = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

export const BRANDS = [
  {
    id: "sebell",
    title: "Sebell",
    fonts: [
      {
        family: "Noto Serif",
        weights: [300, 400, 500, 700],
        fallback: "Georgia, 'Times New Roman', serif",
      },
      {
        family: "Noto Sans",
        weights: [300, 400, 500, 700],
        fallback: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      },
    ],
  },
  {
    id: "brand-a",
    title: "Brand A",
    fonts: [
      { family: "Inter", weights: [200, 400, 500, 600, 700], fallback: SANS_FALLBACK },
    ],
  },
  {
    id: "brand-b",
    title: "Brand B",
    fonts: [
      {
        family: "Gabarito",
        weights: [300, 400, 500, 600, 700],
        fallback: "'Inter', system-ui, sans-serif",
      },
      { family: "Roboto", weights: [300, 400, 700], fallback: SANS_FALLBACK },
    ],
  },
  {
    id: "prep-eat",
    title: "Prep+Eat",
    fonts: [
      { family: "Montserrat", weights: [200, 400, 700], fallback: SANS_FALLBACK },
      { family: "IBM Plex Sans", weights: [200, 400, 700], fallback: SANS_FALLBACK },
    ],
  },
];

export const DENSITIES = [
  { id: "default", title: "Default" },
  { id: "compact", title: "Compact" },
];

/** First brand × first density — the default everywhere (Storybook + iOS). */
export const DEFAULT_BRAND = BRANDS[0].id;
export const DEFAULT_DENSITY = DENSITIES[0].id;

/**
 * One Google Fonts URL covering every brand's families. Families appearing in
 * several brands get their weight lists merged, so each family is requested
 * exactly once.
 */
export const GOOGLE_FONTS_URL = (() => {
  const weightsByFamily = new Map();
  for (const brand of BRANDS) {
    for (const { family, weights } of brand.fonts ?? []) {
      const merged = weightsByFamily.get(family) ?? new Set();
      for (const w of weights) merged.add(w);
      weightsByFamily.set(family, merged);
    }
  }
  const params = [...weightsByFamily]
    .map(
      ([family, weights]) =>
        `family=${family.replaceAll(" ", "+")}:wght@${[...weights].sort((a, b) => a - b).join(";")}`,
    )
    .join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
})();
