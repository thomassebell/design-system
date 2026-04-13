# Token Reference

This page is auto-generated from `@ds/tokens`. Run `npm run tokens:build` to regenerate.

## Colors

### Primitives

Raw palette values. Don't use these directly in components — use semantic tokens instead.

| Token | Value |
|-------|-------|
| `color.primitive.neutral.0` | `#FFFFFF` |
| `color.primitive.neutral.900` | `#111827` |
| `color.primitive.blue.600` | `#2563EB` |
| … | See `packages/tokens/src/color-primitives.json` for the full list. |

### Semantic

Intent-based aliases that reference primitives. These are what components consume.

| Token | Resolves to | Use for |
|-------|-------------|---------|
| `color.text.primary` | `neutral.900` | Default body text |
| `color.text.secondary` | `neutral.600` | Helper / muted text |
| `color.action.primary` | `blue.600` | Buttons, links |
| `color.feedback.error` | `red.600` | Validation errors |

## Spacing

4 px base scale: `spacing.1` = 4 px, `spacing.2` = 8 px, … `spacing.20` = 80 px.

## Typography

| Token | Value | Note |
|-------|-------|------|
| `font.family.sans` | Inter Variable | Body copy |
| `font.family.display` | Cabinet Grotesk | Headlines |
| `font.size.base` | 1 rem (16 px) | Default |
| `font.size.5xl` | 3 rem (48 px) | Display headings |

## Radius

`radius.none` → 0, `radius.sm` → 4 px, `radius.md` → 8 px, `radius.lg` → 12 px, `radius.xl` → 16 px, `radius.full` → 9999 px.

## Shadows

Four levels: `shadow.sm`, `shadow.md`, `shadow.lg`, `shadow.xl`.

## Motion

### Duration
`instant` 50 ms · `fast` 150 ms · `normal` 250 ms · `slow` 400 ms

### Easing
`default` · `in` · `out` · `inOut` · `spring` (bouncy overshoot)
