---
# DESIGN.md — brand template
#
# HOW TO USE
#   1. Copy this file:
#        cp brand/_template.brand.design.md brand/brands/<brand>.design.md
#   2. Find every <TODO> below and replace it.
#   3. For YAML values, copy directly from your Figma export JSON in
#      packages/tokens/figma-exports/<brand>.tokens.json so the docs and the
#      build can't drift.
#   4. Delete this header block before committing.
#
# See brand/core.design.md for the brand-agnostic system rules this file
# specialises. Sections below mirror core.design.md so a reader can read
# both in parallel.

brand: <TODO-brand-id>           # e.g. "sebell" — must match BRANDS[i] in build.mjs
brand-name: <TODO-brand-name>    # e.g. "Sebell" — display label for Storybook toolbar
status: <TODO-status>            # "production" | "test-fixture"
figma-file-keys:
  foundation: <TODO-figma-key>   # e.g. gfEQfbdlqwR1QQivfNdZ6Y
  brand-mode: <TODO-figma-key>   # main DS file key

# ─── Colours ────────────────────────────────────────
# Copy values from figma-exports/<brand>.tokens.json after the alias
# resolver has baked them. Use the dist/<brand>-default.css output as a
# cross-check — the resolved hex values are right there.
color:
  surface:
    primary:   { lighter: "<TODO>", light: "<TODO>", main: "<TODO>", dark: "<TODO>", darker: "<TODO>" }
    secondary: { lighter: "<TODO>", light: "<TODO>", main: "<TODO>", dark: "<TODO>", darker: "<TODO>" }
  text:
    primary: "<TODO>"
    secondary: "<TODO>"
    disabled: "<TODO>"
  icon:
    primary: "<TODO>"
    secondary: "<TODO>"
    contrast: "<TODO>"
  border:
    default: "<TODO>"
    strong:  "<TODO>"
    subtle:  "<TODO>"
  error:   { lighter: "<TODO>", light: "<TODO>", main: "<TODO>", dark: "<TODO>", darker: "<TODO>", contrast-text: "<TODO>" }
  warning: { lighter: "<TODO>", light: "<TODO>", main: "<TODO>", dark: "<TODO>", darker: "<TODO>", contrast-text: "<TODO>" }
  success: { lighter: "<TODO>", light: "<TODO>", main: "<TODO>", dark: "<TODO>", darker: "<TODO>", contrast-text: "<TODO>" }
  info:    { lighter: "<TODO>", light: "<TODO>", main: "<TODO>", dark: "<TODO>", darker: "<TODO>", contrast-text: "<TODO>" }

# ─── Radius ─────────────────────────────────────────
radius:
  none:   "0px"
  xsmall: "<TODO>"
  small:  "<TODO>"
  medium: "<TODO>"
  large:  "<TODO>"
  xlarge: "<TODO>"

# ─── Typography ─────────────────────────────────────
typography:
  font-family:
    header:    "<TODO>"   # e.g. "Noto Serif"
    paragraph: "<TODO>"   # e.g. "Noto Sans"
  font-weight:
    understate: <TODO>    # e.g. 300
    default:    <TODO>    # e.g. 400
    emphasized: <TODO>    # e.g. 700

# ─── Components (brand-level overrides only) ────────
# Most components inherit from semantic tokens above — only list values
# here if this brand needs a component-specific override.
components: {}
---

# <TODO-brand-name>

<!-- Mirrors core.design.md sections. Brand-specific content only. -->

## Overview

<!-- One paragraph: who this brand is, the emotional intent, what makes
     it recognisable. If this is a test fixture, lead with that fact. -->

<TODO>

## Colors

<!-- Describe the palette: what each colour family represents, which
     primitives feed which semantic roles. Reference the YAML above as
     the source of truth for values; here, explain the WHY. -->

<TODO>

### Palette mapping

<!-- Table form is helpful: which foundation palette feeds which semantic group. -->

| Semantic | Foundation palette | Notes |
|----------|-------------------|-------|
| `color.surface.primary` | `<TODO>` | <TODO> |
| `color.surface.secondary` | `<TODO>` | <TODO> |
| `color.warning.*` | `<TODO>` | <TODO> |
| `color.info.*` | `<TODO>` | <TODO> |

## Typography

<!-- Why these families. What pairings work. Pitfalls. -->

<TODO>

## Layout

<!-- Usually inherits from core. Only describe deviations. -->

Inherits from `core.design.md`. <TODO-or-delete>

## Elevation & Depth

<!-- Usually flat (inherits from core). If this brand introduces shadows,
     document them here AND add the slot to core.design.md. -->

Inherits from `core.design.md` — no shadow tokens. <TODO-or-delete>

## Shapes

<!-- Radius identity for this brand. If you collapse slots onto a smaller
     primitive set (like Sebell's "square or full"), explain it here. -->

<TODO>

## Components

<!-- ONLY brand-specific component notes. Don't restate the cross-brand
     contract — that lives in core.design.md. Use this section for things
     like "Button uses cedar for primary surface" or "Input uses square
     radius unconditionally in this brand." -->

<TODO>

## Do's and Don'ts

**Do**
- <TODO>

**Don't**
- <TODO>

---

## Done checklist

Before adding this brand to `BRANDS` in `build.mjs`:

- [ ] Every `<TODO>` resolved
- [ ] YAML values match `figma-exports/<brand>.tokens.json` aliases
- [ ] No `<TODO-or-delete>` left in the file
- [ ] `npm run tokens:build` passes pre-flight (no alias misalignment, no missing tokens, no type mismatches)
- [ ] `npm run storybook` renders this brand correctly
- [ ] Chromatic baseline accepted for `<brand>-default` and `<brand>-compact` modes
