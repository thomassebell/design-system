---
brand: brand-b
brand-name: Brand B
status: test-fixture
figma-file-keys:
  foundation: <see-main-ds-file>
  brand-mode: 65DhWI9kmp9ee9wzoIfTMM

# Representative resolved values — full set in
# packages/tokens/figma-exports/brand-b.tokens.json (semantic) and
# packages/tokens/dist/brand-b-default.css (resolved).

color:
  surface:
    primary: { lighter: "#e5f7d4", light: "#b2e87d", main: "#78cc24", dark: "#61a51d", darker: "#4d8217" }
  text:
    primary: "#141310"

radius:
  none:    "0px"
  xsmall:  "4px"
  small:   "8px"
  medium:  "12px"
  large:   "16px"
  xlarge:  "24px"

typography:
  font-family:
    header:    "Gabarito"
    paragraph: "Roboto"
---

# Brand B

> **Test brand.** Exists to exercise the multi-brand pipeline. Don't add real product opinions to this file.

## Overview

Brand B is the "deliberately different" exemplar — green primary, two different typefaces (Gabarito display + Roboto body), and a soft full-radius scale (4 → 24px). Its job is to **diverge** from Brand A on every meaningful axis so the cross-brand consistency check has something to compare.

The recent saturation shift (commit `d7c1da1`: "Brand B rust scale: shift saturation 50 to 70") is a typical fixture-update — adjusting Brand B's palette so visual regressions in Chromatic show up clearly.

## Colors

Green primary (`#78cc24`) — picked specifically because it's the opposite of Brand A's blue on the colour wheel. Cross-brand alias resolution has to handle the fact that "primary main" means radically different hex values in different brands.

## Typography

**Two-family setup** by design: Gabarito for headers, Roboto for body. This is the path Sebell ended up following (different families for header vs paragraph), so Brand B serves double duty as the test case for two-family validation.

## Layout

Inherits from `core.design.md`.

## Elevation & Depth

Inherits from `core.design.md` — flat.

## Shapes

Soft, generous radii: 4 → 24px scale. Brand B's curves are deliberately the inverse of Brand A's sharp corners — together they bracket the design space so any new brand falls somewhere on the spectrum.

## Components

No brand-specific component overrides.

## Do's and Don'ts

**Do**
- Use Brand B to test how components behave with generous corner radii.

**Don't**
- Add real product opinions, brand voice, or marketing copy here.
