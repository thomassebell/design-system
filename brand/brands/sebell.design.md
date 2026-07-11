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
    # 7-step ramps (2026-07-11) — lightest…darkest on existing pine/walnut/ash tints
    primary:   { lightest: "#75a379", lighter: "#66996a", light: "#5c8a60", main: "#476b4a", dark: "#334d35", darker: "#1f2e20", darkest: "#141f15" }   # pine 55→10
    secondary: { lightest: "#c9bfb6", lighter: "#beb2a7", light: "#b3a698", main: "#93806c", dark: "#756657", darker: "#67594c", darkest: "#584d41" }   # walnut 75→30
    neutral:   { white: "#fbfbf9", lightest: "#f6f4ef", lighter: "#ece8df", light: "#e3ddcf", main: "#d9d2bf", dark: "#bdb08f", darker: "#aa996e", darkest: "#a18e5e" }   # ash 95→50; lightest is a real tint, never white
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
    active:  "#3d5c40"   # pine (surface.primary.main) — focus/active border; shared with focus ring
  error:   { lightest: "#fbefe9", lighter: "#f7ded4", light: "#e89d7d", main: "#ad491f", dark: "#823717", darker: "#57250f", darkest: "#2b1208", contrast-text: "#fbfbf9" }   # cedar 95→10
  warning: { lightest: "#f6f4ef", lighter: "#ece8df", light: "#d9d2bf", main: "#c6bb9f", dark: "#b4a47e", darker: "#aa996e", darkest: "#a18e5e", contrast-text: "#0a0f0b" }   # ash 95→50, with dark text
  success: { lightest: "#ece8df", lighter: "#e3ddcf", light: "#d0c6af", main: "#5c8a60", dark: "#476b4a", darker: "#1f2e20", darkest: "#141f15", contrast-text: "#fbfbf9" }   # two-ramp family: ash light half + pine dark half
  info:    { lightest: "#eef5f6", lighter: "#deebed", light: "#9cc4c9", main: "#599da6", dark: "#477d85", darker: "#243f42", darkest: "#121f21", contrast-text: "#0a0f0b" }   # juniper 95→10 (muted cool teal) — the system's one cool signal

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

Sebell is warm, grounded, and quietly confident. The palette is built around wood species — **pine** for the primary green that anchors most surfaces, **walnut** for warm secondary tones, **cedar** as the warm urgency colour (error only), **ash** for neutrals (including non-urgent warnings), and **juniper** — the one deliberately *cool* note, a teal drawn from juniper's blue berries, reserved for informational signalling. The serif/sans pairing (Noto Serif headers over Noto Sans body) reinforces an earnest, editorial voice without being formal.

Status colours are mostly muted and warm: `error` uses cedar's red-orange, `warning` is ash (neutral cream — a caution, not an alarm), and `success` is pine (the brand's own green). The deliberate exception is `info`, now **juniper** (cool teal) — info is the one place a cool, slightly more vivid tone earns its keep, because "informational" reads most clearly when it's tonally distinct from the warm urgency/success colours. So the status palette mostly whispers, with info as the single cool, clear voice.

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
| `color.info.*` | `juniper` | Cool teal — the single cool note in a warm palette. Now its own juniper scale (no longer aliased to `surface.secondary`), so info reads as tonally distinct "this is information," not as a second secondary. |
| `color.border.*` | `ash` mid-tones | Subtle, warm borders that disappear into neutral surfaces. |

Status colours all pair with **dark text** on their backgrounds (contrast-text = `color.text.primary`), because every status background is a mid-light tone in the wood-species palette. This is the opposite of the "white text on saturated colour" convention you'd see in a louder brand.

Contrast: `text.primary` (#0a0f0b) on `surface.neutral.lighter` (#f6f4ef) is ~19:1 — well past AA. `surface.primary.main` (#3d5c40) on white is ~7.3:1 — passes AA Large and AA Body. `text.primary` on `warning.main` (#c6bb9f) is ~9.5:1 — comfortably AA. `text.primary` on `info.main` (#599da6, muted juniper) is ~6.3:1 (AA Body); white text on the same teal fails (~3.0:1), which is why info pairs with dark text like the other statuses. The dark end of the juniper scale (`info.dark` ~4.2:1 with dark text — AA Large; `info.darker` ~1.7:1 — used as a border/accent shade, never a text surface) follows the same rule as cedar/pine: `contrast-text` pairs with `main`, not with the deep shades.

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
- **Input** (and all form controls): square radius reinforces Sebell's strict edge identity. The focused state now routes both the focus ring and the focused border through the shared `color.border.active` token (= `surface.primary.main`, pine), so the ring and the border always match and read as "pine-on-cream."
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
