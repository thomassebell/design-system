# Sebell Design System — agent guide

This file is auto-loaded by Claude Code when working in this repo. It tells future sessions where to find canonical context, what conventions to respect, and how to scaffold a new brand without inventing ad-hoc steps.

## What this repo is

A multi-brand design system that ships:
- **Web tokens + components** via `@ds/tokens` (CSS variables) and `@ds/react` (Storybook + library).
- **iOS tokens** via `@ds/ios-tokens` (Swift Package consumed by SwiftUI apps).

Active brands:

| Brand | Status | Role |
|-------|--------|------|
| `sebell` | Production | Tseb's own brand — used for real apps and websites. |
| `brand-a` | Test fixture | Generic primary-blue exemplar. Exists to exercise the multi-brand pipeline. |
| `brand-b` | Test fixture | Diverges from Brand A on every axis (green primary, two typefaces, soft radii) so cross-brand consistency checks have something to compare. |

## Where context lives

- **`brand/core.design.md`** — system-level spec: token shape every brand provides, component contracts, the "adding a brand" runbook. Read this first when scaffolding new brand work.
- **`brand/brands/<brand>.design.md`** — per-brand spec: actual values, palette mapping, brand voice. Read this when working on a specific brand's design.
- **`brand/_template.brand.design.md`** — copy-paste skeleton for new brands.
- **`packages/tokens/figma-exports/*.tokens.json`** — Figma source-of-truth exports (DTCG schema). Foundation + brand semantic layers for each brand.
- **`packages/tokens/dist/*.css`** — generated CSS, one file per (brand × density). Do not hand-edit.
- **`packages/tokens/brands.config.js`** — single source of truth for the brand × density matrix. Adding a brand/density is one edit here; both `build.mjs` and `preview.js` read from it. The first `BRANDS` entry is the iOS + Storybook default.
- **`packages/tokens/build.mjs`** — the build pipeline. Reads `brands.config.js` for the matrix.
- **`packages/react/.storybook/preview.js`** — Storybook brand-switching wiring. Toolbar, per-mode stylesheets, and Chromatic modes are all generated from `brands.config.js`.

## Token cascade

For each `(brand × density)` combination:

```
foundation primitives  →  brand semantics  →  density (layout + type ramp)
```

Aliases resolve at build time against the merged tree, so a brand semantic alias like `color.surface.primary.main → primitive/color/pine/pine-30` correctly resolves to the brand's own foundation primitive.

## Adding a brand

There is **one** canonical runbook: the "Adding a brand" section at the bottom of [`brand/core.design.md`](./brand/core.design.md). Follow it step by step. Expected effort: ~30 minutes once the brand exists in Figma. If you find yourself needing more than a one-file edit for any single step, the system has regressed — open an issue rather than working around it.

When you make a change to the Phase 1 / Phase 2 workflow (the build, Storybook wiring, or DESIGN.md structure), update that runbook in the same PR. The runbook is the contract.

## Invariants (do not regress)

### Storybook 10 — never use `defaultValue` on `globalTypes`

The current `packages/react/.storybook/preview.js` correctly uses top-level `initialGlobals` for brand and density. **Do not move these onto `globalTypes` as `defaultValue`** — Storybook 10+ silently breaks Chromatic per-snapshot mode globals when `defaultValue` is set. The breakage is silent (Chromatic just doesn't render the mode), which is why this is documented prominently. Source: user memory `feedback_storybook_initial_globals.md`.

### Components consume semantic tokens, never primitives

Component CSS reads `var(--color-surface-primary-main)`, never `var(--primitive-color-pine-30)`; and `var(--semantic-components-small)`, never `var(--primitive-size-8)`. The semantic layer is what makes both brand-switching **and** density-switching work at the component level — Sebell runs a true density setup, so all spacing scales via semantics with no fixed-primitive exceptions.

**This is machine-enforced.** A stylelint rule (`packages/react/.stylelintrc.json`, run as part of `npm run lint`) fails the build on any raw color (hex / named / `rgb()` / `hsl()` …) or **any** `var(--primitive-…)` reference (color or size) in `packages/react/src/components/**/*.module.css`. Grep for `var(--primitive-` in components — there should be zero matches, and the linter keeps it that way.

### Cross-brand structural parity is enforced

`build.mjs` runs a pre-flight check on every build:
- **Alias misalignment** — every alias in `<brand>.tokens.json` must target `<brand>-foundation`, not another brand's foundation. Fatal.
- **Cross-brand consistency** — every brand-tokens file must have the same set of semantic token keys. Levenshtein-close names get flagged as likely typos. Fatal for `$type` mismatches; warning for missing keys.
- **Structural diff vs HEAD** — informational, surfaces added / removed / renamed / retyped tokens and stale `var(--…)` references in component CSS.

If pre-flight fires, the message tells you exactly which file and which token path to fix. Don't suppress it — fix in Figma and re-export.

### Sebell's "Pending work" items

Sebell's brand mode in Figma was duplicated from Brand B and not every alias got re-pointed at `sebell-foundation`. The current `figma-exports/sebell.tokens.json` was hand-patched (commit message will note it) to unblock the build, but the proper fix is in Figma. See the "Pending work" section in `brand/brands/sebell.design.md`. When you re-export Sebell from a clean Figma state, expect to revisit the warning/info palette mappings.

## Common workflows

| You want to… | Do this |
|--------------|---------|
| Refresh Sebell tokens from Figma | Re-export → `npm run tokens:build` → spot-check `dist/sebell-default.css` → update `brand/brands/sebell.design.md` YAML if values changed |
| Add a new brand | Follow the runbook in `brand/core.design.md` |
| Add a new component | Add token slots to ALL brand-tokens files in the same PR (cross-brand consistency check will otherwise fail) |
| Switch the iOS default brand | Re-order the `BRANDS` array in `packages/tokens/brands.config.js` — the first entry feeds `dist/tokens.json` → `DesignTokens.swift` (and is the Storybook default) |
| Add/remove a brand or density | One edit to `packages/tokens/brands.config.js` — build, Storybook toolbar, sheets, and Chromatic modes all follow |
| Debug a Chromatic snapshot diff | Chromatic modes are generated from `brands.config.js`; switch the toolbar brand locally to reproduce |

## Spec / tooling notes

- **DESIGN.md is alpha** (Apr 2026, Google Labs). The YAML schema and CLI are under active development. Conventions in `core.design.md` flagged as deliberate-but-revisitable: multi-file merge between core and brand files, the `token-shape` "per-brand" placeholder, the cross-reference convention.
- **Figma is source of truth** for token values. Hand-edits to `figma-exports/*.json` will be overwritten on the next user-driven export. If you must hand-patch (e.g. the current Sebell stopgap), document it loudly in the commit message and in the brand's "Pending work" section.
- **The `packages/tokens/src/` and `packages/tokens/brands/` folders are legacy** and not on the active build path. The active sources are under `packages/tokens/figma-exports/`. Don't add new files to the legacy folders.
