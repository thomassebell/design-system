# Surface, density & dark mode — architecture plan

**Status:** Plan. Validated by a Figma spike on 2026-06-19, **not yet implemented**.
Spike ran in a throwaway duplicate ("Sebell DS – light-dark", file key `K305YQJNYsBibhpZQh1Jiq`); the spike is now closed. This document is the decision record + the work to do. It describes a *target*, not current state — do not treat it as shipped until the tasks below are done and this header is updated.

> Writing-style note: en-dashes (–), never em-dashes, per repo convention.

## Why

We needed on-dark ("dark mode") support for components. The first instinct – a parallel `onDark/*` token namespace per component, plus a `surface` variant property – proved brittle: it doubled tokens, drifted into duplicates/mis-scoped variables, and didn't survive multi-brand (the light/dark relationship differs per brand, so "dark = invert light" is false). The spike found a cleaner model: **theme by mode, not by per-variant tokens.**

## Decisions

1. **Surface as a mode (`appearance`).** A Figma variable collection `appearance` with modes `light` / `dark`. It holds the **foreground / contrast** layer only – text, border and icon colours, plus the component contrast colours (button fill/label/border/underline). It is set per frame and **cascades / overrides per subtree**, so a dark section can live on a light page and both coexist on one page.

2. **Backgrounds are a free brand-colour choice – not owned by the mode.** The designer paints a frame's background from `brand` colours and **tags the frame's `appearance` mode** to declare that colour's tone (light/dark). The content then adapts. (The designer owns making the tag match the colour they chose.)

3. **Composition via cross-collection aliasing.** `appearance` tokens alias into `brand` per mode, so `brand × surface` compose without a mode cross-product. Proven across sebell + brand-a + brand-b in the spike.

4. **Token tiering – publish only the semantic tier.** primitive (brand foundation) → **semantic (released to designers)** → component (internal, hidden). Component tokens are namespaced (`button/*`) and flagged `hiddenFromPublishing`.

5. **Released designer-facing colour set** (in `appearance`, intent-named, each with light + dark values):
   - Text: `default`, `subtle`, `disabled`, `link`, `brand`, `accent`
   - `border/default`, `icon/default`
   - **Hidden / internal** (system needs them, designers don't pick them): `text/danger`, `text/success`, `text/warning`, `text/info`, `text/inverse`, and all `button/*`. (`text/on-accent` was removed; easy to re-add.)

6. **Text model = three independent axes.** type style (size + weight, the typography layer, colourless) + text colour intent + `appearance` mode. Emphasis (a headline) comes from the **type style**, not a colour token – so there is no `text/strong`; a headline uses `text/default` + a `Heading` style.

7. **Density is also a per-subtree mode.** Ship `compact` as a `[data-density="compact"]` override (like surface), not only as a global per-brand×density stylesheet, so a section can be compact without the whole app.

8. **Drop the `dense` component size.** Components are single-size (the former `regular`); denser UI comes from the `density` compact mode, which is now the only density lever. (Trade-off: smallest button becomes regular-in-compact = 12px vertical padding; the old dense 8/4px goes away. Retune the compact scale if tighter is wanted.)

9. **Radii bind to the brand `radius/*` token** (already true in code via `radius/medium`); keep it so brand-b's soft corners and sebell's square corners both follow the brand.

## Target architecture

- **Collections:** `brand` (4 brands), `appearance` (light/dark), `layout`/density (default/compact). `appearance` and density apply per-subtree.
- **Components** consume semantic + (hidden) component tokens; never primitives. Single size.
- **CSS:** `build.mjs` emits a `[data-surface="dark"]` override block and a `[data-density="compact"]` override block per brand. React provides `surface` and `density` context/attributes, with per-subtree override possible.

## Implementation tasks (ordered)

### A. Tokens / Figma (production file `65DhWI9kmp9ee9wzoIfTMM`)
1. Create the `appearance` collection (light/dark); author the semantic foreground roles + `button/*` component tokens (light → existing brand-aware tokens, dark → brand-aware dark sources), per the released/hidden split in Decision 5.
2. Retire the `onDark/*` cruft in `components/button` (duplicates + mis-scoped variables).
3. Remove the `Size=regular/dense` property from the Button component set (and any other multi-size component); collapse to a single size using the `regular` values.
4. Decide and apply: keep `surface` as a Figma variant property *backed by* the mode (nice for the library view), or go pure-mode. If kept, the `surface=dark` variant just pins the appearance dark mode – no per-variant rebinding.

### B. Build pipeline (`packages/tokens/build.mjs`)
5. Emit a `[data-surface="dark"]` override block per brand CSS file from the `appearance` dark mode.
6. Move density to a `[data-density="compact"]` override block (or emit both) so density is per-subtree, not only per-stylesheet.
7. Update the cross-brand consistency / alias-misalignment pre-flight for the new token set.

### C. React (`packages/react`)
8. Add a `surface` context/attribute (`data-surface`) with optional per-component override; remove the `size` prop and the `.regular` / `.dense` CSS split (single size on the former `regular` tokens).
9. Rebind component CSS to the `appearance` tokens; remove all `onDark/*` references.

### D. Docs
10. Update `brand/core.design.md` with the `appearance` + density mode model and the released token set; document the three-axis text model.
11. **Type-style code parity** (separate workstream, see `~/.claude` work-list memory): Figma has 13 composed text styles but code only has raw typography primitives that components hand-assemble. Add a composed code layer (`.ds-display-3` / `<Text variant>`) mirroring the Figma styles 1:1, kept out of `appearance` (type does not change with light/dark).

## Trade-offs / open questions

- Smallest button is now regular-in-compact (12px vertical padding); retune the compact token scale if you need tighter.
- Decide whether to keep the Figma `surface` variant property (backed by mode) or go pure-mode (Decision/Task A4).
- Optional: a `background/*` semantic set (e.g. `background/page`, `background/raised`) for legibility – currently backgrounds are raw brand-colour picks.
- Status colours and `text/inverse` are kept hidden; revisit if a component genuinely needs a designer-facing one.
