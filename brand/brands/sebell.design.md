---
brand: sebell
brand-name: Sebell
status: production
figma-file-keys:
  foundation: gfEQfbdlqwR1QQivfNdZ6Y      # sebell-foundation collection
  brand-mode: 65DhWI9kmp9ee9wzoIfTMM      # main DS file, Sebell mode

# Values mirror the resolved output in packages/tokens/dist/sebell-default.css
# after alias resolution. Source of truth is Figma → re-export to refresh.

color:
  surface:
    primary:   { lighter: "#66996a", light: "#527a55", main: "#3d5c40", dark: "#293d2b", darker: "#141f15" }   # pine
    secondary: { lighter: "#beb2a7", light: "#b3a698", main: "#93806c", dark: "#756657", darker: "#584d41" }   # walnut
    neutral:   { white:   "#fbfbf9", lighter: "#f6f4ef", light: "#ece8df", main: "#d9d2bf", dark: "#bdb08f", darker: "#a18e5e" }   # ash/cream
  text:
    primary:        "#0a0f0b"
    light:          "#3d5c40"
    lighter:        "#527a55"
    contrast-text:  "#fbfbf9"
  icon:
    contrast: "#fbfbf9"
  border:
    light:   "#e3ddcf"
    default: "#c6bb9f"
    dark:    "#b4a47e"
    hover:   "#a18e5e"
  error:   { lighter: "#fbefe9", light: "#e89d7d", main: "#d95c26", dark: "#ad491f", darker: "#823717", contrast-text: "#fbfbf9" }   # cedar
  warning: { lighter: "#ece8df", light: "#d9d2bf", main: "#c6bb9f", dark: "#b4a47e", darker: "#a18e5e", contrast-text: "#0a0f0b" }   # ash, with dark text
  success: { lighter: "#e3ddcf", light: "#d0c6af", main: "#66996a", dark: "#3d5c40", darker: "#141f15", contrast-text: "#0a0f0b" }   # pine + warm
  info:    { lighter: "#beb2a7", light: "#b3a698", main: "#93806c", dark: "#756657", darker: "#584d41", contrast-text: "#0a0f0b" }   # walnut, via surface.secondary

radius:
  none:   "0px"
  xsmall: "0px"
  small:  "0px"
  medium: "0px"
  large:  "0px"
  xlarge: "9999px"

typography:
  font-family:
    header:    "Noto Serif"
    paragraph: "Noto Sans"
  font-weight:
    understate: 300
    default:    300
    emphasized: 700

components: {}
---

# Sebell

> **Sebell's own brand.** Used for real product work — apps and websites. The two test fixtures (Brand A, Brand B) exist alongside Sebell to exercise the multi-brand pipeline.

## Overview

Sebell is warm, grounded, and quietly confident. The palette is built around wood species — **pine** for the primary green that anchors most surfaces, **walnut** for warm secondary and informational tones, **cedar** as the single urgency colour (error only), and **ash** for neutrals, including non-urgent warnings. The serif/sans pairing (Noto Serif headers over Noto Sans body) reinforces an earnest, editorial voice without being formal.

Status colours are deliberately muted: only `error` uses cedar's red-orange. `warning` is ash (neutral cream — a caution, not an alarm), `info` is walnut (warm, helpful), and `success` is pine (the brand's own green). The result is a status palette that whispers rather than shouts.

Shape language is binary by intent: corners are either **square (0px)** or **full (9999px)** — no soft intermediate radii. This is a deliberate identity choice; the visual rhythm depends on the contrast between sharp panels and fully-rounded badges/pills.

## Colors

### Palette mapping

| Semantic | Foundation palette | Notes |
|----------|-------------------|-------|
| `color.surface.primary` | `pine` | Main brand green. `pine-30` (#3d5c40) is the on-canvas anchor. |
| `color.surface.secondary` | `walnut` | Warm wood-brown supporting tones. Pairs with pine for layered surfaces. |
| `color.surface.neutral` | `ash` (and white) | Cream-leaning neutrals. Use for page backgrounds and quiet panels. |
| `color.text.primary` | `pine-5` (~black) | Off-black with a green tint for body text. AA on `surface.neutral.lighter`. |
| `color.icon.contrast` | `achromatic.white` | Off-white for icons on dark surfaces. |
| `color.error.*` | `cedar` | Warm red-orange. The only "loud" status colour — cedar is reserved for true error. |
| `color.warning.*` | `ash` | Neutral cream tones. Warning is a caution, not an alarm — pairs with dark text. |
| `color.success.*` | `pine` + warm tones | `pine-50` for the main accent (echoes brand primary). |
| `color.info.*` | `walnut` (via `surface.secondary`) | Warm brown — info is helpful, friendly, not a status klaxon. Aliased intra-brand to `surface.secondary` so info and secondary always read identically. |
| `color.border.*` | `ash` mid-tones | Subtle, warm borders that disappear into neutral surfaces. |

Status colours all pair with **dark text** on their backgrounds (contrast-text = `color.text.primary`), because every status background is a mid-light tone in the wood-species palette. This is the opposite of the "white text on saturated colour" convention you'd see in a louder brand.

Contrast: `text.primary` (#0a0f0b) on `surface.neutral.lighter` (#f6f4ef) is ~19:1 — well past AA. `surface.primary.main` (#3d5c40) on white is ~7.3:1 — passes AA Large and AA Body. `text.primary` on `warning.main` (#c6bb9f) is ~9.5:1 — comfortably AA.

## Typography

**Noto Serif** for headers — a contemporary serif with warmth in its terminals. Pairs with `font-weight.emphasized` (700) for display sizes and balances the strong pine surfaces.

**Noto Sans** for body and UI — a neutral humanist sans that doesn't fight Noto Serif. Default body weight is **300 (light)** by design — Sebell pages should feel quiet and unhurried. Use `emphasized` (700) sparingly for true emphasis.

Pitfalls:
- Don't pair Noto Serif headers with a sans that has different optical sizing (e.g. Inter). Stick to Noto Sans.
- Don't bump `default` to 400 Regular without checking contrast — the lighter weight is intentional, and Sebell's text colour (#0a0f0b) is dark enough to remain legible at 300.

## Layout

Inherits from `core.design.md` — 8-point grid, shared density-driven spacing ramp. No Sebell-specific layout deviations.

## Elevation & Depth

Inherits from `core.design.md` — flat, no shadow tokens. Sebell's depth cues come from surface colour transitions (`surface.primary.main` against `surface.neutral.lighter`), not shadow.

## Shapes

The **square-or-full** identity. Every semantic radius slot below `xlarge` resolves to `0px`; `xlarge` is `9999px`. Practically:
- Buttons, inputs, cards, panels → square.
- Badges, pills, avatars, switches → full.
- Nothing in between.

This is a deliberate constraint, not a limitation. If a future design genuinely requires a soft radius, that signals an extension to `sebell-foundation` (adding e.g. `radius.soft` primitive), not a one-off override.

## Components

Most components inherit cleanly via semantic tokens. Sebell-specific notes:

- **Button (solid)**: surface is `pine-30`, text is `text.contrast-text` (off-white). At 300 weight the label feels light against the deep green — that's correct for Sebell's voice.
- **Button (text)**: uses the brand underline aesthetic. The underline colour follows `color.text.primary`, not `surface.primary.main`, to avoid green-on-green when the text sits on a primary surface.
- **Input**: square radius reinforces Sebell's strict edge identity. Focus ring uses `surface.primary.main` so it reads as "pine-on-cream."
- **Badges / Pills**: this is where `radius.xlarge` (9999px) earns its keep — they are the only fully-round elements in the system.

## Do's and Don'ts

**Do**
- Use `surface.primary.main` (pine-30) as the brand anchor on any hero or primary surface.
- Pair warm neutrals (`surface.neutral.*`) with cool primary tones — this is the core visual rhythm.
- Keep body text at `font-weight.default` (300) and lean on `emphasized` (700) for true emphasis only.

**Don't**
- Mix square and full radius in the same component (e.g. a button with one full and one square corner). Pick one identity per element.
- Use cedar outside of `error.*`. Cedar is the single "loud" colour — warning and info are deliberately quieter.
- Use `text.primary` as a surface colour. There's no Sebell context where black-on-anything reads as "Sebell."

---

## Pending work

- **Radius intermediate primitives.** `sebell-foundation` has `square (0)` and `full (9999)`. If Sebell ever needs a soft intermediate radius, add a `soft` primitive to the foundation rather than overriding the semantic. Until then, every `radius.*` slot below `xlarge` resolves to `0px`.
- **`color/icon/contrast` alias.** As of the last Figma inspection this one variable still pointed at `brand-b-foundation::primitive/color/achromatic/snow`. The latest re-export resolves it correctly to `#fbfbf9` (Sebell's own off-white), so this looks fixed. If a future export regresses, this is the canary.
