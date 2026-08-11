# Design System backlog

The work list for the DS. Not just what was decided but **why**, so a cold thread
can be picked up without re-litigating it. Started 2026-08-07.

## Open

- [ ] **FINISH ARTICULATING THE SPACING RHYTHM — the rules are drafted but NOT
      ADOPTED.** Draft: [spacing-rhythm.md](./spacing-rhythm.md), marked as such
      at the top so nobody mistakes it for system law.
      **WHERE IT CAME FROM.** Thomas, 2026-08-07: *"I always try to establish a
      rhythm to the design where I use different spacings in a sequence that to
      me is hard to put into rules. The spacing tokens are actually made with a
      fibonacci-like rhythm; 8, 16, 24, 40, 64, 104. This rhythm helps the user
      'read' the design easier, because each gap is optically different enough
      to notice."*
      **WHAT IS SETTLED AND CAN BE RELIED ON — the analysis, not the rules:**
      - The layout scale is Fibonacci from 8 up, so past the first step it is
        geometric at **≈1.6** (measured: 1.50, 1.67, 1.60, 1.63). That constant
        RATIO is why every step stays equally noticeable — perceived magnitude is
        ratio-based, not additive (Weber's law). A linear scale's ratios fall as
        it climbs, which is why the top of a linear scale turns to mush.
      - **The component scale is deliberately NOT Fibonacci** — it oscillates
        ×1.5 / ×1.33 at the top (12, 16, 24, 32). Correct for close-range reading
        inside one object, where fine control beats dramatic separation. This is
        what turns "don't mix the two scales" from tidiness into perception.
      - The underlying principle is Gestalt **proximity**: spacing is the
        notation hierarchy is written in, not decoration between elements.
      **WHAT IS NOT SETTLED.** Thomas: *"it is not there yet."* Three specific
      claims in the draft are Claude's inference from his work rather than his
      own words, and each needs him to confirm, correct or reject it:
      1. **That 4px sits outside the ladder deliberately.** 4, 8, 16 is not
         Fibonacci. The draft calls it a half-step for hairline separations. It
         may have a different reason, or none.
      2. **"One rung per level"** — that going up a grouping level moves exactly
         one step, and skipping a rung is reserved for a genuine section break.
         This is the rule Claude is least confident is read correctly off the
         work.
      3. **The closing formulation of the irreducible part:** *"you are spending
         the minimum spacing needed, given what the background, borders and type
         are already saying."* If this is wrong, the whole "where the rules stop"
         section is wrong with it.
      **THE ONE WORTH KEEPING EITHER WAY: "outer beats inner"** — the gap
      separating two things must exceed the largest gap inside either of them.
      It is mechanically checkable, needs no taste, and it is exactly what would
      have caught the Prep+Eat shopping list shipping a category heading with 16
      above it and 8 below, so the heading sat closer to the previous group than
      to the rows it labelled (found and fixed 2026-08-07).
      **NEXT:** Thomas reviews 1–3 against real screens. If "outer beats inner"
      survives, it is a candidate for a lint rule rather than prose.

- [ ] **Consider a stylelint rule against raw `px` dimensions in component
      CSS.** Found 2026-08-11: the Switch had drifted from Figma because its
      track and handle were hard-coded `32px / 20px / 12px`. The existing rule
      bans raw colours and `var(--primitive-…)`, so *colour* can't drift – but
      *sizing* silently can, and did. Now that Figma tokenises component
      dimensions, a rule could close the last axis. Needs thought about
      legitimate exceptions (1px borders, `100%`, `0`) before it's written.

- [ ] **Tighten `color/surface/secondary/main` off `ALL_SCOPES`.** Found
      2026-08-07 from a real mistake in the Prep+Eat app file: every drag handle
      was coloured with a SURFACE token instead of an icon one.
      **The cause was not carelessness.** Thomas had correctly scoped the text
      tokens to `[TEXT_FILL]`, so they cannot be picked for a vector fill —
      *"I scoped the text-tokens only to be visible to text. But you work in the
      code so you don't get 'scoped out' of applying a color-token."* With the
      right family scoped out of reach, the only plausible-looking option left in
      the picker was `surface/secondary/main`, because it is `ALL_SCOPES` and
      therefore appears in **every** picker in the file.
      So the scoping worked and one unscoped token undermined it. The correct
      token existed all along: `icon/subtle`, same #6F5D44, scoped
      `[SHAPE_FILL, TEXT_FILL]`. 113 nodes have since been rebound to it.
      **FIX:** give `color/surface/secondary/main` real scopes. Worth sweeping
      for other `ALL_SCOPES` colour variables at the same time — each one is a
      trap of the same shape, for any property.
      LESSON WORTH KEEPING: **`ALL_SCOPES` is not neutral.** It does not mean
      "unrestricted", it means "offer this everywhere", and an unscoped token
      will be picked in a context a scoped one was deliberately kept out of.

## Decided

- [x] **Radius: components bind `layout` radii only; `brand` radii are the raw
      ramp.** Decided 2026-08-11. The `layout` collection gained `none`,
      `xsmall`, `xlarge` and a new `full` (8000px) so every component has a
      layout slot to bind; all 22 components were re-pointed. Treat `brand`
      radii like primitives – real, but never bound directly.
      **WHY IT MATTERED.** Both collections contain variables literally named
      `radius/medium`, and the export flattens both into one top-level `radius`
      block with no collection qualifier. Density wins the cascade, so a
      component binding the brand slot silently got the density-stepped value.
      Invisible at default density, where the two coincide; visible at compact,
      where Brand B's switch rendered an almost-but-not-quite pill.
      Full mapping table and the reason `full` exists are in
      [core.design.md](../brand/core.design.md) under Shapes.
      STILL OPEN: whether `xlarge` should stop stepping down at compact. It
      currently steps (24 → 16 in Brand B). Nothing on it today depends on
      roundness, so nothing is broken – but anything reaching for `xlarge`
      expecting a pill would break at compact.

- [x] **Every component fill and stroke in Figma is variable-bound.** Swept
      2026-08-11: zero raw values remain across all components. Fixed in the
      same pass: `checkboxGroup`'s Header and Subheader were raw `#000000`
      (radioGroup's equivalents were already on `text/default`), and
      `iconButton`'s three loading spinners had raw strokes, now on
      `button/<variant>/label/enabled` matching how `button`'s own spinners
      are bound.
      **WHY IT MATTERED.** A raw value cannot flip for dark mode. None of these
      were code bugs – React draws the spinner with `currentColor` – but they
      would have become code bugs the moment someone implemented from the file.

- [x] **`select` and `counter` migrated to the appearance collection.** Decided
      2026-08-11. Both still bound brand-level `components/forms/*` and
      `color/text/*` tokens while `input` and `textArea` had moved to the
      appearance twins. Every pair is identical in light and differs only in
      dark, so the swap was invisible in light mode and made dark mode work.
      `select` additionally now mirrors `input` state for state: hover lightens
      the field to `background/active`, and Label/Hint switch `subtle` →
      `default` on hover, focus and error (previously uniform, with a red error
      label). Thomas added `disabled` and `readOnly` variants to match.
      KNOWN DIFFERENCE, deliberate: `select` shows Hint text in `disabled` and
      `readOnly`; `input` has no Hint text node in those states.
      Neither component has a React counterpart yet – this was done so the
      first implementation starts from a correct file.
