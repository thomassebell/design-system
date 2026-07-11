---
# DESIGN.md — core (brand-agnostic system spec)
# Format reference: https://github.com/google-labs-code/design.md (alpha, Apr 2026)
#
# This file declares the SHAPE of the design system: which token namespaces
# every brand must provide, how the build pipeline merges them, and what
# component contracts the React library exposes. Values live in brand files
# under ./brands/, not here.
#
# Convention: each brand file is self-contained for token VALUES. The alpha
# DESIGN.md spec does not define multi-file token merging, so we do NOT use
# cross-file {ref} resolution. When the spec stabilises, revisit this.

system:
  name: "Sebell Design System"
  packages:
    - "@ds/tokens"        # Style Dictionary build, Figma exports → CSS + Swift
    - "@ds/react"         # React component library + Storybook
    - "@ds/ios-tokens"    # Swift Package consumed by iOS apps
    - "@ds/docs"          # Documentation site (placeholder)

  brands:
    primary: "sebell"
    test-fixtures: ["brand-a", "brand-b"]
  densities: ["default", "compact"]

# Token shape every brand must provide. Values are "per-brand".
# Colour ramps are SEVEN steps (lightest…darkest) as of 2026-07-11 — widened
# from five so interactive components get more than one AA-compliant 3-state
# window per ramp. Slots map onto EXISTING foundation primitives only; a brand
# may collapse a slot onto its neighbour where its foundation ramp lacks span
# (same convention as radius). Foundation palettes are set — widening semantics
# never adds foundation tints (see the ramp-remap decision, 2026-07-11).
token-shape:
  color:
    surface:
      primary:   { lightest: "per-brand", lighter: "per-brand", light: "per-brand", main: "per-brand", dark: "per-brand", darker: "per-brand", darkest: "per-brand" }
      secondary: { lightest: "per-brand", lighter: "per-brand", light: "per-brand", main: "per-brand", dark: "per-brand", darker: "per-brand", darkest: "per-brand" }
      neutral:   { white: "per-brand", lightest: "per-brand", lighter: "per-brand", light: "per-brand", main: "per-brand", dark: "per-brand", darker: "per-brand", darkest: "per-brand" }   # lightest is the lightest REAL neutral tint, never an alias of white
    text:       { primary: "per-brand", secondary: "per-brand", disabled: "per-brand" }
    icon:       { primary: "per-brand", secondary: "per-brand", contrast: "per-brand" }
    border:     { default: "per-brand", strong: "per-brand", subtle: "per-brand" }
    error:      { lightest: "per-brand", lighter: "per-brand", light: "per-brand", main: "per-brand", dark: "per-brand", darker: "per-brand", darkest: "per-brand", "contrast-text": "per-brand" }
    warning:    { lightest: "per-brand", lighter: "per-brand", light: "per-brand", main: "per-brand", dark: "per-brand", darker: "per-brand", darkest: "per-brand", "contrast-text": "per-brand" }
    success:    { lightest: "per-brand", lighter: "per-brand", light: "per-brand", main: "per-brand", dark: "per-brand", darker: "per-brand", darkest: "per-brand", "contrast-text": "per-brand" }
    info:       { lightest: "per-brand", lighter: "per-brand", light: "per-brand", main: "per-brand", dark: "per-brand", darker: "per-brand", darkest: "per-brand", "contrast-text": "per-brand" }
  radius:
    keys: [none, xsmall, small, medium, large, xlarge]
    note: "Each brand specifies values. A brand may collapse multiple slots onto the same primitive (e.g. Sebell's 'square or full' identity)."
  typography:
    font-family: { header: "per-brand", paragraph: "per-brand" }
    font-weight: { understate: "per-brand", default: "per-brand", emphasized: "per-brand" }
  components:
    focus-ring: "per-brand"   # default + error variants
    button:     "per-brand"   # background/border tokens per variant × state
    forms:      "per-brand"   # input/checkbox/radio tokens
---

# Sebell Design System — Core

> **What this file is.** The brand-agnostic spec for the Sebell DS. Every brand file under `./brands/` specialises this contract with concrete values and brand-specific guidance. Read this first; then read the brand file you care about.

## Overview

> 📐 **Diagram:** [`docs/architecture.svg`](../docs/architecture.svg) shows the whole picture at a glance — the build pipeline (Figma + `brands.config.js` → `build.mjs` with its pre-flight checks → CSS / Swift artifacts → consumers) and the CI pipeline (every check and test that gates a change).

Three packages do the work:

- **`packages/tokens`** is the source of truth pipeline. Figma exports land in `figma-exports/*.tokens.json` (DTCG schema). `build.mjs` reads them, merges per `(brand × density)`, resolves aliases, and emits `dist/<brand>-<density>.css` plus a single `dist/tokens.json` for the iOS generator. The brand × density matrix is declared once in `packages/tokens/brands.config.js` (shared with Storybook); the first entry of its `BRANDS` array drives the iOS + Storybook default.
- **`packages/react`** is the component library. Components consume CSS custom properties only — no component is brand-aware. Storybook inlines all stylesheets and flips one active via `media` attribute.
- **`packages/ios-tokens`** is a Swift Package. `transforms/generate-swift.mjs` reads `dist/tokens.json` and writes `Sources/DSTokens/DesignTokens.swift`, which is **committed to git** – SwiftPM consumes packages straight from the repo, so the generated file must be checked in. CI regenerates it and fails if the committed copy is stale. Multi-brand iOS is parked.

### Token cascade

For every `(brand × density)` combination, three trees merge in this order:

```
foundation (primitives)  →  brand (semantic + components)  →  density (layout + type ramp)
```

Aliases declared in any layer (Figma's `$extensions.com.figma.aliasData`) are resolved against the merged tree, so a brand semantic value like `color.surface.primary.main` correctly resolves to the brand's own foundation primitive even though the resolution happens at build time.

A fourth collection, **`appearance`** (modes `light` / `dark`), sits on top: its tokens alias into the merged brand tree and are emitted as `[data-surface]` override blocks rather than folded into `:root`. See **Appearance & surface mode** below.

### What lives where

| Layer | Source | Owns |
|-------|--------|------|
| Primitives | `figma-exports/<brand>-foundation.tokens.json` | Colour palettes, radius primitives, font families, font weights |
| Semantic + components | `figma-exports/<brand>.tokens.json` | `color.<role>.*`, `radius.<size>`, `typography.*`, `components.{focus-ring,button,forms}` |
| Density | `figma-exports/<density>.tokens.json` | Shared spacing scale, type size ramp, line-height ramp |
| Appearance | `figma-exports/{light,dark}.tokens.json` | Foreground/contrast layer (`text.*`, `icon.*`, `border.*`, `button.*`, `forms.*`), light + dark; aliases into brand |

## Colors

Naming: `color.<role>.<weight>` where `<role>` ∈ `{surface, text, icon, border, error, warning, success, info}` and `<weight>` ∈ `{lightest, lighter, light, main, dark, darker, darkest, contrast-text}` for surface and status colour ramps, or role-specific keys (e.g. `text.primary`, `border.subtle`) otherwise. The seven weight steps exist so an interactive component can pick a 3-state run (`enabled → hover → pressed`, `active → active-hover → active-pressed`) whose fills all keep one label colour above WCAG AA — with five steps each ramp had exactly one such window; seven gives a choice of direction. `main` is the family's anchor and never moves when a ramp is re-cut.

Rules:

- Components must consume **semantic** tokens (`var(--color-surface-primary-main)`), never **primitive** tokens (no `var(--primitive-color-pine-30)` in component CSS).
- Every brand must define every key in the shape above — the cross-brand consistency check fails the build if a brand is missing a slot another brand provides.
- Contrast: surface vs text pairs must meet WCAG AA (4.5:1 for body text, 3:1 for ≥18pt or bold).
- Focus visibility: every interactive component must render a 2px focus ring using `components.focus-ring.default` (or `.error` when invalid).

## Appearance & surface mode (light / dark)

Dark mode is themed **by mode, not by per-variant tokens.** A Figma collection `appearance` (modes `light` / `dark`) holds the **foreground / contrast** layer only – the colours that must adapt when content sits on a light vs dark background.

**What's in it.** Two tiers of `appearance` token:

- **Released** (designer-facing, intent-named): `text.{default, subtle, disabled, link, brand, accent}`, `border.default`, `icon.default`.
- **Hidden** (`hiddenFromPublishing`, system-internal): status text (`text.{danger, success, warning, info, inverse}`) and the component sets `button.*` and `forms.*`. Designers don't pick these; components consume them.

**Composition by aliasing, not cross-product.** Every `appearance` token *aliases into `brand`* per mode, so `brand × surface` composes without a 4×2 explosion – the alias resolves in whichever brand mode is active, giving the right per-brand value automatically. Light values alias to the brand's existing semantic tokens (so **light rendering is unchanged**); dark values alias to brand colours chosen for a dark surface.

**Backgrounds are NOT owned by the mode.** A frame's/page's background is a free brand-colour choice the designer paints; they tag the frame's `appearance` mode to declare its tone. There is no `background.*` token set today (deferred). Consequently, on dark **form controls are border-defined**: transparent fill + light-neutral border + light text, with checked states in a light brand tint (Sebell's neutral ramp is light-only, so there is no dark surface to fill an input with).

**Three-axis text model.** Text = type style (size + weight, colourless) + text-colour intent (`text.*`) + `appearance` mode. Emphasis (a heading) comes from the **type style**, never a colour token – so there is no `text.strong`; a heading is `text.default` + a heading style.

**In code.** `build.mjs` emits, per `(brand × density)` file, a `:root, [data-surface="light"]` block (the appearance light values) and a `[data-surface="dark"]` override. Both are descendant-matchable, so a subtree can flip surface **in either direction** (a light island inside a dark section, and vice-versa). The React `Surface` component sets `data-surface` (+ a `useSurface` context) and scopes the flip to its subtree. Components consume appearance foreground tokens (`var(--text-default)`, `var(--button-solid-fill-enabled)`, `var(--forms-border-enabled)`) – **error banners are the deliberate exception**: they stay on `color.error.lighter` / `color.text.primary` as light callouts, since there is no appearance background token for them.

## Typography

Two family slots only: `font-family.header` and `font-family.paragraph`. Three weight slots: `understate`, `default`, `emphasized`. Sizes come from the density file, not the brand file — the size ramp is shared across brands by design.

### Size-to-family pairing (system rule)

Every size token is paired with one family slot. This is invariant across brands:

| Size tokens | Pairs with |
|------------|-----------|
| `font-size.display-1` … `display-6` | `font-family.header` |
| `font-size.paragraph`, `font-size.small`, `font-size.components-*` | `font-family.paragraph` |

Display sizes (which exist for headlines and hero content) always render in the header family — that's the whole point of having two families. Body, small, and component sizes always render in the paragraph family. Stories and documentation that show the type ramp must respect this pairing; consuming apps should too.

### Other rules

- Brand files set the family and weight values; they do not override sizes.
- No third family slot — if a brand wants a third family (e.g. mono), add a new slot to `core.design.md` first so the contract changes for everyone.

## Layout

Spacing is on an 8-point grid (with a 4px micro-step). The semantic spacing ramp (`xxsmall`, `xsmall`, `small`, `medium`, `large`, `xlarge`, `xxlarge`) lives in the density file and is shared across brands. It's split into two scopes — and which one you reach for is a **system rule**, not a free choice.

### Component vs. layout spacing (system rule)

| Scope | Use for | Examples |
|-------|---------|----------|
| `semantic.components.*` | Spacing **inside a single atomic component** — its own padding and internal gaps | Button padding, Input padding, the error-banner callout's padding + icon gap |
| `semantic.layout.*` | Spacing **between composed elements** — when a component's job is to arrange other standalone widgets | `Field` (control ↔ label), `FieldGroup` (field ↔ field, section ↔ section) |

The test: *is this spacing within one widget, or between widgets being arranged?* A `Field` places a standalone control (Checkbox/Radio/Switch) next to its label → that's composition → `layout.*`. A `FieldGroup` arranges fields → composition → `layout.*`. A Button's own padding is internal → `components.*`.

### Density behaviour differs by scope (important)

- **`components.*` fully scales** with density — every step shrinks in compact (e.g. `components.medium` = 12px default → 8px compact).
- **`layout.*` scales only at the large end.** The small steps are **density-invariant**: `layout.xxsmall` / `xsmall` / `small` / `medium` = 4 / 8 / 16 / 24px in *both* densities; only `large` and up compress in compact.

This matters in two ways:

1. Composition spacing stays steady — tightening compact density is about the big structural gaps, not the small ones.
2. It interacts with the **focus ring**, which is fixed at 4px reach (`offset 2 + width 2`) and is itself density-invariant. **Any gap adjacent to a focusable control must clear that ring in *both* densities.** `layout.xsmall` (8px, fixed) clears it; `components.small` (4px in compact) does not — which is exactly why control-adjacent gaps use `layout.xsmall`, not `components.small`.

Note there is no density-*invariant* `components.*` step and no `semantic.fixed.*` scope — and that's deliberate. If you need a gap that doesn't scale, the answer is a `layout.*` small step (which already doesn't), not a primitive and not a new fixed category. Component CSS may never reach for a raw primitive (`var(--primitive-…)`) for spacing or colour — enforced by stylelint; see the invariants in `CLAUDE.md`.

## Elevation & Depth

The system is intentionally flat — there are no shadow tokens today. A brand that needs elevation must add `effects.shadow.*` tokens to its brand file AND document the addition in this core spec (so the contract grows symmetrically across all brands).

## Shapes

Radius slot convention: `radius.{none, xsmall, small, medium, large, xlarge}`. Values are brand-specific. A brand may collapse multiple slots onto the same primitive (e.g. Sebell currently collapses everything onto `square (0)` or `full (9999)` until its foundation grows intermediate primitives) — that is a brand-level decision, not a system regression.

## Components

The React library exposes the following components, each consuming a specific slice of the token tree. The component contract is brand-agnostic; only token values change per brand.

| Component | Token slots consumed | Notes |
|-----------|---------------------|-------|
| `Button` | `components.button.*`, `typography.font-family.paragraph`, `radius.medium`, `components.focus-ring.*` | Variants: `solid`, `outline`, `text`. States: `default`, `hover`, `active`, `focus`, `disabled` |
| `Chip` | `chip.*` (appearance), `components.chip.*` (per-brand dark resting fills/labels), `radius.xlarge`, `semantic.components.*`, `typography.font-size.components.label`, `components.focus-ring.*` | Interactive filter/selection toggle (`aria-pressed`). Variants: `solid`, `outline`. States: `enabled`, `hover`, `pressed`, `active`, `active-hover`, `active-pressed`; disabled via the universal opacity rule. The brand-sensitive ramps route through per-brand slots, mirroring Button's wiring: dark-mode resting via `components.chip.{background,text}.*`, light-mode selected via `components.chip.{active-background,active-text}.*` — each brand picks flip-zone-coherent runs (see brand-a.design.md and Prep+Eat for why). Static status labels are the (planned) separate `Pill` component |
| `Input` | `components.forms.*`, `color.text.*`, `color.border.*`, `radius.small`, `components.focus-ring.*` | Supports `startIcon`, `endIcon`, hint above, error banner below |
| `Checkbox` (+ `CheckboxField`, `CheckboxGroup`) | `components.forms.*`, `color.border.*`, `components.focus-ring.*` | Indeterminate state supported |
| `Radio` (+ `RadioField`, `RadioGroup`) | `components.forms.*`, `color.border.*`, `components.focus-ring.*` | |
| `Field`, `FieldGroup` | `typography.*`, `color.text.*` | Form-field layout primitives |
| `Text` | `typography.*`, `color.text.*` | Variants follow the type ramp from density |
| `Icon` | `color.icon.*` | Sized via spacing tokens |
| `Stack` | `semantic.layout.*` | Spacing primitive |

Live visuals: run `npm run storybook` and browse by brand.

## Do's and Don'ts

**Do**
- Reference semantic tokens from component CSS; let the cascade resolve to primitives.
- Add a new component's token slots to *all* brand files in the same PR as the component.
- Run `npm run tokens:build` locally before pushing — the cross-brand consistency check catches authoring drift early.
- Treat each brand file as self-contained for token values.

**Don't**
- Reference primitive tokens (`var(--primitive-color-pine-30)`) from component CSS. Always go through semantics.
- Use `defaultValue` on Storybook `globalTypes`. Use top-level `initialGlobals` instead — `defaultValue` silently breaks Chromatic per-snapshot modes in Storybook 10+.
- Put brand-specific opinions in this core file. Brand voice, palette names, and identity belong in `./brands/<brand>.design.md`.
- Bake values into JSON by hand. Token sources are Figma exports — edit in Figma, then re-export.

---

## Adding a brand — runbook

Expected effort: ~30 minutes end-to-end once the brand exists in Figma. If any step required more than a single-file edit, the system has regressed — open an issue.

**Prerequisites in Figma:**
1. A foundation file with a variable collection named `<brand>-foundation` (palettes, radius primitives, font families, font weights).
2. A brand mode in the main DS file's brand variable collection with the same semantic shape as Brand A — duplicate Brand A's mode and re-point every alias to `<brand>-foundation`. **This is the most common source of bugs** — the cross-brand consistency check will catch missed aliases.

**Steps:**

1. **Export foundation** via the Figma MCP → `packages/tokens/figma-exports/<brand>-foundation.tokens.json`.
2. **Export brand semantics** (the `<brand>` mode of the main DS file's brand collection) → `packages/tokens/figma-exports/<brand>.tokens.json`.
3. **Copy the DESIGN.md template**: `cp brand/_template.brand.design.md brand/brands/<brand>.design.md`. Resolve every `<TODO>` — pull values directly from the JSON exports so the docs and the build can't drift.
4. **New fonts only:** if the brand uses a font not already in `packages/tokens/build.mjs`'s `FONT_FALLBACKS` map, add an entry. Append the family to the Google Fonts `<link>` href in `packages/react/.storybook/preview.js`.
5. **Register the brand — ONE edit.** Add a single entry to the `BRANDS` array in `packages/tokens/brands.config.js`:
   ```js
   { id: "<brand>", title: "<Brand Name>" }
   ```
   That one line is the single source of truth. It automatically drives the token build (which CSS files get emitted), the Storybook brand toolbar, the per-mode `?inline` stylesheets, the Chromatic snapshot modes, and the defaults — no edits to `build.mjs` or `preview.js` are needed or wanted. Position matters: the **first** entry is the iOS + Storybook default, so new brands normally go at the end. (Adding a new *density* is the same: one entry in the `DENSITIES` array.)
6. **Build:** `npm run tokens:build`. The pre-flight prints `✓ Figma export health: all brands consistent, no alias misalignment` when correct. Common failures:
   - **"cross-brand alias misalignment"** → some aliases in `<brand>.tokens.json` still point at another brand's foundation. Fix in Figma and re-export.
   - **"likely typo"** → a token name in your brand file is one or two characters off from the same token in another brand. Rename in Figma.
   - **"defined in only one brand"** → structural mismatch. Add the missing keys in Figma (or in the other brand if your new brand is the canonical one).
7. **Storybook smoke:** `npm run storybook`. The new brand appears in the toolbar; switching re-renders every story.
8. **Chromatic baseline:** push the branch; Chromatic flags the new mode combos as needing baseline acceptance. Accept on first run.
9. **Done.** Update `CLAUDE.md`'s brand table at the repo root if the brand is anything other than a test fixture.

## Spec notes

- DESIGN.md is alpha (Apr 2026, Google Labs). The YAML token schema and CLI are likely to change. Conventions in this file marked as deliberate-but-revisitable:
  - **Multi-file merge** — the alpha spec doesn't define how `core.design.md` and `brands/X.design.md` combine. We treat brand files as self-contained for token values, with `core.design.md` declaring shape only. Revisit when the spec stabilises.
  - **`token-shape` block** — using `"per-brand"` placeholders to declare a slot exists without committing to a value is our convention, not the spec's.
