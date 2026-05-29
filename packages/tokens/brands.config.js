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
 *                                            modes, and the initial globals.
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
 */

export const BRANDS = [
  { id: "sebell", title: "Sebell" },
  { id: "brand-a", title: "Brand A" },
  { id: "brand-b", title: "Brand B" },
];

export const DENSITIES = [
  { id: "default", title: "Default" },
  { id: "compact", title: "Compact" },
];

/** First brand × first density — the default everywhere (Storybook + iOS). */
export const DEFAULT_BRAND = BRANDS[0].id;
export const DEFAULT_DENSITY = DENSITIES[0].id;
