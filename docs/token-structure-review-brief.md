# Token structure review – problem-space brief

**Status: PROBLEM SPACE ONLY. Opened 2026-08-18 by Thomas.**

This document exists to describe the problem well enough that a solution can be
chosen deliberately. It deliberately contains **no proposed structure, no
renaming scheme, and no "we could merge X into Y"**. Solutions written down here
would anchor the review to whoever wrote them first, which is the failure mode
this brief is meant to prevent.

Thomas, 2026-08-18: *"I think it is wise to stay in the problem space for a
while, before choosing a solution."*

Everything under "The structure today" was read out of the repo on 2026-08-18
and is fact, not impression. Everything under "Observations" is also fact – but
whether each one is a **problem** is exactly what the review decides. Several of
them may turn out to be deliberate and correct.

---

## 1. Why this review, and what it has to satisfy

Three criteria, from Thomas:

1. **Can it be simplified?**
2. **The structure has to account for who is using it and when.**
3. **Naming must be intent-driven** – every token is the record of a decision,
   and what it means should be clear to most people who meet it.

Criterion 3 is a testable claim, not a slogan. It implies a diagnostic that can
actually be run over the current tree: *for each token, what decision does it
record, and can a reader recover that decision from its name alone?* Any token
that fails has either a naming problem or no reason to exist. Running that pass
is likely the first real work of the review.

Criterion 2 is the one the current structure was never designed against, and it
is why section 2 comes before section 3.

---

## 2. The actors, and when each one meets a token

A token is met at different moments by different people, who can see different
things at that moment. The same name has to work in all of these.

**A. The designer authoring the system** (Figma, deciding).
Naming a token and choosing its value. Has the whole tree in view, is thinking
about structure, and is the only actor who sees a token *as a decision being
made*. Every existing name was written from inside this moment.

**B. The designer consuming tokens** (Figma, doing layout or building a recipe).
**The actor the current naming serves least.** Picking from a variable dropdown
mid-layout, with no documentation open, no view of the tree, and attention on
the screen being designed rather than on the token system. Needs to pick
correctly at a glance and to know when two similar-looking names are genuinely
different. This actor is not making a system decision – they are *applying* one
someone else already made, and they should not have to reconstruct it.

**C. The DS component author** (code).
Writing a component's CSS. Constrained by stylelint to semantic tokens only:
no raw colours, no `var(--primitive-…)`, no raw px/rem/em for spacing, radius
or type. Meets tokens as CSS variable names, and has to pick the right one from
a flat namespace with no grouping visible.

**D. The external web app developer** (npm).
Installs `@sebellds/react` + `@sebellds/tokens`, imports one brand stylesheet,
and reads CSS variables. Since 2026-08-18 this actor is genuinely external:
they have the published package and the README, and nothing else. They never
see Figma.

**E. The iOS / SwiftUI developer.**
Reads generated Swift constants from `DesignTokens.swift`. Gets **one brand at
one density** – whichever is first in `brands.config.js`. Never sees the
cascade that produced the value.

**F. The React Native developer.**
Reads a NativeWind theme fragment, `dist/<brand>-theme.cjs`. **Light appearance
only in v1.** Cannot consume DS components at all, only tokens.

**G. The build pipeline** (not a person, but it has requirements).
Resolves aliases, enforces cross-brand structural parity, and fails the build on
misaligned aliases or missing keys. It is the only actor that can enforce
anything, so whatever the review decides has to be expressible as a check here
or it will drift.

**Worth stating plainly:** actors B through F meet tokens as a *flat list of
names*. Only A and G ever see the tree. Any intent carried by nesting is
invisible to five of the seven.

---

## 3. The structure today (verified 2026-08-18)

### The cascade

```
foundation primitives  →  brand semantics  →  density (layout + type ramp)
                                           →  appearance (light / dark)
```

Built for every `(brand × density)` pair. Four brands (`sebell`, `brand-a`,
`brand-b`, `prep-eat`) × two densities = 8 CSS files, plus `tokens.json` →
Swift, plus 4 NativeWind fragments.

### Token counts by source file

| Layer | File | Tokens | Top-level groups |
|---|---|---|---|
| Foundation | `<brand>-foundation.tokens.json` | 60–69 | `primitive` |
| Brand semantic | `<brand>.tokens.json` | 130 | `color`, `components`, `radius`, `typography` |
| Density | `default` / `compact.tokens.json` | 65 | `primitive`, `radius`, `semantic`, `typography` |
| Appearance | `light` / `dark.tokens.json` | 99 each | `border`, `button`, `chip`, `forms`, `icon`, `tab-bar`, `text` |

A single built stylesheet carries roughly **365 CSS variables**.

### Where each concept is defined

- **Colour**: `color.*` in brand semantics (surface, text, icon, border, and
  `error` / `warning` / `success` / `info`, 8 tokens each). Plus `text.*`,
  `icon.*`, `border.*` in the appearance collection.
- **Spacing**: `semantic.layout.*` (7) and `semantic.components.*` (8), both in
  the density layer.
- **Radius**: defined in **three** places – `primitive.radius` (foundation, 2),
  `radius.*` (brand semantic, 7), `radius.*` (density, 7).
- **Type**: `typography.font-family` / `font-weight` in brand semantics **and**
  in foundation; `typography.font-size` (11) / `line-height` (7) in density.
- **Per-component slots**: `components.*` in brand semantics (button, chip,
  focus-ring, forms, tab-bar – 46 emitted variables) **and** `button`, `chip`,
  `forms`, `tab-bar` at top level in the appearance collection.

### What the appearance layer covers

Exactly seven roots: `text`, `border`, `icon`, `button`, `chip`, `forms`,
`tab-bar` – matching `APPEARANCE_ROOTS` in `build.mjs`. Emitted as
`[data-surface="light"]` and `[data-surface="dark"]` blocks appended to each
brand sheet.

For **status**, the appearance layer provides **text colours only**:
`text.danger`, `text.success`, `text.warning`, `text.info`. There is no
per-status background, border or icon in either mode.

---

## 4. Observations for the review to examine

Each is verified. Whether it is a *problem* is the review's call – some may be
deliberate.

**4.1 "components" means two different things, one token apart in the
namespace.**
`--semantic-components-small` is a **spacing size** (component-internal spacing,
part of a scale that runs xxsmall → xxxlarge). `--components-button-text-enabled`
is a **per-component colour slot**. Both are called "components". Actor C picks
between them from a flat autocomplete list.

**4.2 The same component has two token sets, in two collections, with two
naming schemes.**
For Button, a single stylesheet emits both:
- `--components-button-background-enabled`, `--components-button-border-*`,
  `--components-button-text-*` (from brand semantics)
- `--button-solid-fill-enabled`, `--button-outline-*`, `--button-danger-*`,
  `--button-text-*` (from the appearance collection)

Note `background` vs `fill` and `text` vs `label` for what appear to be the same
roles. The same doubling exists for Chip. `CLAUDE.md` explains *why* per-brand
`components/…` slots exist alongside appearance tokens (brands whose ramps are
sensitive to the light/dark flip zone), so this is not accidental – but it is
two vocabularies for one component.

**4.3 Status is called `error` in one layer and `danger` in another.**
Brand semantics: `color.error.*` (8 tokens per brand). Appearance:
`text.danger`, and `button.danger`. The `Alert` component's API says `error`;
the `Button` component's API says `danger`.

**4.4 Radius is defined at three layers.**
Foundation, brand semantic, and density all define radius. Which one an author
is expected to reach for is not evident from the names.

**4.5 Spacing scales collide numerically at default density.**
`layout.*` and `components.*` share the values 4, 8, 16, 24 and 40 at default
density and diverge at compact. Already documented in `CLAUDE.md` as the cause
of a real, shipped mistake (the Switch height): at default density a wrong
binding is invisible, and only appears when density switches. This is the
clearest existing evidence that a name has to carry intent, because the *value*
cannot distinguish the two.

**4.6 Nesting is invisible to most actors.**
Group structure in the JSON becomes a flat, hyphenated name in CSS, Swift and
NativeWind. Whatever intent the tree encodes has to survive flattening.

**4.7 The three output formats do not carry the same information.**
CSS gets all brands, both densities, both appearances. Swift gets one brand, one
density. NativeWind gets all brands, one density, light only. A token's meaning
should not depend on which output an actor is reading, but its *availability*
currently does.

---

## 5. Explicitly out of scope for this brief

- Any proposed structure or naming scheme.
- Any decision about the two `Alert` defects (close control as an `IconButton`
  with hover/pressed; notification colours that support light/dark). Both are
  **downstream** of this review – adding a notification group to the current
  structure would bake in whatever the review might change. Parked deliberately;
  see the `Alert` item in [backlog.md](./backlog.md).
- Whether to change anything at all. "The structure is right, the naming needs
  work" is a legitimate outcome, and so is the reverse.

---

## 6. Suggested first move for the review session

Not a solution – a diagnostic. Walk the current tree against criterion 3 and
mark, for every token, what decision it records and whether the name recovers
it. That produces evidence rather than opinion, and it is the input every later
choice will want. Actor B is the right lens to run it through, since that actor
has the least context at the moment of use.
