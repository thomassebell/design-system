---
brand: brand-a
brand-name: Brand A
status: test-fixture
figma-file-keys:
  foundation: <see-main-ds-file>
  brand-mode: 65DhWI9kmp9ee9wzoIfTMM

# Representative resolved values — full set in
# packages/tokens/figma-exports/brand-a.tokens.json (semantic) and
# packages/tokens/dist/brand-a-default.css (resolved).

color:
  surface:
    primary: { lighter: "#cceeff", light: "#66ccff", main: "#00aaff", dark: "#0088cc", darker: "#006699" }
  text:
    primary: "#0d0d0c"

radius:
  none:    "0px"
  xsmall:  "2px"
  small:   "2px"
  medium:  "4px"
  large:   "4px"
  xlarge:  "9999px"

typography:
  font-family:
    header:    "Inter"
    paragraph: "Inter"
---

# Brand A

> **Test brand.** Exists to exercise the multi-brand pipeline — cross-brand consistency checks, alias misalignment detection, structural diff. Don't add real product opinions to this file. Don't mine it for design inspiration.

## Overview

Brand A is the "primary blue" exemplar — a single typeface (Inter), sky-blue primary palette, small radii. Its job is to be **boringly typical** so anything weird in Brand B or Sebell stands out by contrast in cross-brand diffs.

## Colors

Inter blue (`#00aaff`) as primary, a vivid green for secondary, conventional status colours. Nothing surprising — the value of Brand A is in being the baseline against which the consistency checks in `build.mjs` operate.

`color.text.contrast-text` aliases `color.text.primary` (dark ink), not white — Brand A's primary and secondary are bright mid-tones, so "text on brand surfaces" must be dark here (re-pointed 2026-07-11; it was white, which failed 1.6–3.9:1 on the brand's own fills).

### Flip-zone case study — why `components/chip/*` slots exist (resolved 2026-07-11)

Brand A's green ramp flips between `green-40` (ink passes, 7.6:1) and `green-30` (ink fails, 4.2:1). Its 9-step, step-10 spacing at high saturation means no three *distinct* dark-half steps share a single AA label colour via the generic semantic ramp: ink works only down to green-40; white works only from green-30 down — and `contrast-text` must be ink for this brand's bright light-mode fills. No single global recipe could satisfy both.

**Resolution:** the per-brand `components/chip/{background,text}/*` slots (the same escape hatch Button uses). Brand A's chip slots alias `green-10 → green-20 → green-30` with a white label (14.8 / 8.0 / 4.6), while the other brands keep their secondary dark-half runs. This brand is the documented reason the slots exist: when a palette's flip zone cuts through the only available run, per-brand component slots — not semantic gymnastics or foundation edits — are the sanctioned fix.

## Typography

Inter for both `header` and `paragraph`. One family across both slots is the simplest case the cross-brand checks need to validate.

## Layout

Inherits from `core.design.md`.

## Elevation & Depth

Inherits from `core.design.md` — flat.

## Shapes

Conservative radii: 2px / 4px on small and medium, 9999px on xlarge. This is what a generic Material-adjacent system looks like.

## Components

No brand-specific component overrides. Components consume semantic tokens; this brand provides values straight from the foundation.

## Do's and Don'ts

**Do**
- Treat this file as a fixture. If the cross-brand consistency check fires against Brand A, the bug is almost always in the brand that's diverging, not here.

**Don't**
- Add real product opinions, brand voice, or marketing copy here. This file exists to be predictable.
