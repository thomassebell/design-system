---
# DESIGN.md — Prep+Eat
#
# Token values below are copied from the resolved build output
# (packages/tokens/dist/prep-eat-default.css). Figma is the source of truth;
# if you re-export, refresh these values from the new dist CSS.

brand: prep-eat
brand-name: Prep+Eat
status: test-fixture          # scaffolded from Brand B; food-app exemplar
figma-file-keys:
  foundation: <TODO-figma-key>   # prep-eat-foundation collection
  brand-mode: <TODO-figma-key>   # main DS file key

# ─── Colours ────────────────────────────────────────
# Resolved hex from dist/prep-eat-default.css. The foundation palettes are
# food-named (lime, spirulina, chili, mango, oat, mocha).
color:
  surface:
    primary:   { lighter: "#e9fbe0", light: "#9ceb75", main: "#47a518", dark: "#378112", darker: "#285e0d" }   # lime
    secondary: { lighter: "#9e8561", light: "#8e7757", main: "#7e6a4e", dark: "#6f5d44", darker: "#5f503a" }   # mocha
  text:
    primary: "#4f4230"     # mocha (darkest)
    light:   "#5f503a"
    lighter: "#7e6a4e"
    contrast: "#ffffff"
  border:
    default: "#c5c2be"     # oat
    light:   "#e7e6e4"
    dark:    "#a49f98"
    hover:   "#7e6a4e"
  icon:
    accent:   "#7e6a4e"
    contrast: "#ffffff"
  error:   { lighter: "#fdeae7", light: "#f48776", main: "#de2d12", dark: "#b8250f", darker: "#6d1609", contrast-text: "#ffffff" }   # chili
  warning: { lighter: "#fef8e7", light: "#fae299", main: "#f6cb4c", dark: "#f4c025", darker: "#e4ae0c" }   # mango
  success: { lighter: "#e9fbe0", light: "#b6f098", main: "#83e651", dark: "#56c91d", darker: "#378112" }   # lime
  info:    { lighter: "#e5f2ff", light: "#94c9ff", main: "#42a1ff", dark: "#0078f0", darker: "#004f9e" }   # spirulina

# ─── Radius ─────────────────────────────────────────
radius:
  none:   "0px"
  xsmall: "4px"
  small:  "8px"
  medium: "12px"
  large:  "16px"
  xlarge: "24px"
  full:   "8000px"

# ─── Typography ─────────────────────────────────────
typography:
  font-family:
    header:    "Montserrat"
    paragraph: "Montserrat"
  font-weight:
    understate: 200    # ExtraLight
    default:    400    # Regular
    emphasized: 700    # Bold

# ─── Components (brand-level overrides only) ────────
components: {}
---

# Prep+Eat

## Overview

Prep+Eat is a **test fixture brand** for a food / meal-prep app, scaffolded
from Brand B. It exists to exercise the multi-brand pipeline with a fresh,
food-themed palette identity: a fresh-green primary, warm earthy neutrals, and
a full set of food-named foundation ramps. Like the other fixtures, its job is
to keep the build's cross-brand parity and alias-alignment checks honest.

## Colors

The foundation palettes are named after foods: **lime** (greens), **spirulina**
(blues), **chili** (reds), **mango** (yellows), **oat** (warm greys), and
**mocha** (browns). Accent ramps have 10 even-8 steps. Lime was retuned
July 2026 from L95→23 down to **L93→21** so two steps land under the WCAG
contrast lines on white: `lime-37` (`#47a518`, 3.15:1 – icons/indicators)
and `lime-29` (`#378112`, 4.84:1 – text). Spirulina, chili, and mango remain
on the original L95→23 grid. The semantic layer maps these onto the standard
surface / text / border / status roles.

The primary surface is a vivid fresh green (`lime-37` → `#47a518`), evoking
fresh produce. Neutrals and text lean warm — text is built from **mocha**
(brown) rather than a true grey, and borders from **oat** — giving the UI an
organic, kitchen-warm feel rather than a cold tech grey.

### Palette mapping

| Semantic | Foundation palette | Notes |
|----------|-------------------|-------|
| `color.surface.primary`   | `lime`      | Fresh green; `main` = lime-37, `text/brand` = lime-29. |
| `color.surface.secondary` | `mocha`     | Warm brown; `main` = mocha-40. |
| `color.surface.neutral`   | `oat`       | Warm grey backgrounds. |
| `color.text.*`            | `mocha`     | Warm brown text, not true black. |
| `color.border.*`          | `oat`       | Warm grey borders. |
| `color.error.*`           | `chili`     | Red. `light` = chili-71. |
| `color.warning.*`         | `mango`     | Yellow. |
| `color.success.*`         | `lime`      | Green, shares the primary ramp. |
| `color.info.*`            | `spirulina` | Blue. |

## Typography

A single family — **Montserrat** — for both headers and paragraphs, in three
weights: ExtraLight (200) for understatement, Regular (400) as the default, and
Bold (700) for emphasis. Using one geometric sans across the board keeps the
food-app feel clean and modern; the wide ExtraLight gives airy hero headers
while Bold carries calls-to-action.

## Layout

Inherits from `core.design.md`.

## Elevation & Depth

Inherits from `core.design.md` — no shadow tokens.

## Shapes

Seven-step radius ramp (`0 / 4 / 8 / 12 / 16 / 24px`, plus `full` at 8000px for
shapes that must read as fully round) – soft, friendly rounding consistent with
a consumer food app. No collapsing of slots.

## Components

No brand-specific component overrides. Everything inherits from the semantic
tokens above.

## Do's and Don'ts

**Do**
- Use `lime` for the primary fresh-green identity and positive/success states.
- Keep text and borders on the warm `mocha` / `oat` ramps for the organic feel.

**Don't**
- Don't introduce a cold neutral grey — it breaks the warm, kitchen identity.
- Don't reference foundation primitives in components; go through semantics.

---

## Pending work

- **Figma file keys** (`foundation`, `brand-mode`) are still `<TODO>` — fill
  them in once the Figma files are confirmed.
- **A11y follow-ups from the July 2026 contrast audit** (lime is fixed; these
  remain): `text/link` and the solid button label sit on `surface/primary/main`
  (lime-37) and miss 4.5:1; `text/success` (lime-45), `text/warning` (mango),
  and `text/info` (spirulina-47, 4.25:1) also fail as text on white; danger
  hover label is 3.98:1. Fix in Figma per-brand – darker alias targets exist
  for lime/spirulina; mango may need a darker step. Oat borders (~1.7:1) are
  a system-wide pattern shared with Sebell, not a Prep+Eat regression.

> Note: `color.error.light` was briefly hand-patched (the brand mode was
> duplicated from Brand B and that one alias still pointed at
> `brand-b-foundation::rust-70`). The clean Figma re-export now points it at
> `prep-eat-foundation::chili-71` (`#F48776`) directly, so the stopgap is gone.

## Done checklist

- [x] Token values match resolved `dist/prep-eat-default.css`
- [x] `npm run tokens:build` passes pre-flight (no alias misalignment)
- [x] `npm run storybook` renders Prep+Eat correctly
- [ ] Chromatic baseline accepted for `prep-eat-default` and `prep-eat-compact`
