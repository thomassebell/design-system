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

- [ ] **The lint rules guard the design system's own CSS, not the product code
      an LLM writes against it — and the escape hatch there is wide open.**
      Found 2026-08-16 while comparing us to Polar's "LLM-safe" piece. This is
      the single biggest gap between us and them, and it survived the rule we
      shipped that same day.
      **WHAT IS ACTUALLY ENFORCED.** Stylelint is scoped to
      `packages/react/src/components/**/*.module.css` — CSS written by us, when
      building the system. An app consuming `@ds/react` gets **nothing**. Polar's
      ESLint rule guards the opposite surface: the app code. Different codebases,
      and we only cover one.
      **THE HOLE.** All 20 components extend `HTMLAttributes`, so `className`
      and `style` are inherited props on every one of them.
      `Stack.tsx:57` goes further and merges a consumer's `style` into its own
      inline styles. All of this compiles and passes CI today:
      `<Stack style={{ padding: 13, gap: 7 }}>`, `<Button className="hack">`.
      That is the `<div className="…">` hole the article bans, in the position
      where it does the most damage.
      **NOT A ONE-LINE FIX, AND NOT OBVIOUSLY WORTH IT.** Removing `style` from
      the props narrows a public API and would break any consumer relying on it;
      Prep+Eat is the one to check first. It also cannot be enforced from this
      repo — the check has to run in the consuming app's lint config, which means
      shipping a config for consumers, not just a rule.
      **DECIDE FIRST:** is `@ds/react` a library other people's code composes
      freely, or a closed vocabulary? Polar chose closed. That is a product
      decision, not a lint decision, and everything else here follows from it.

- [ ] **`Surface` requires the consumer to invent a colour.** Found 2026-08-16.
      Its own doc comment says so: *"The background is yours to set — paint it
      from brand colours."* The one component whose entire job is appearance has
      no `background` prop, so the consumer writes the colour themselves. An LLM
      will produce a hex. This is the exact failure the whole system exists to
      prevent, and it is currently by design.
      **FIX:** a `background` prop taking a union of brand surface tokens. Needs
      a designer's call on *which* tokens are legal backgrounds for a surface —
      probably not all of them.

- [ ] **The stories teach the habit the lint rule forbids.** Found 2026-08-16.
      35 inline `style={{…}}` across `packages/react/stories/`, including
      `border: "1px dashed #ccc"` and `padding: 8` in `Stack.stories.tsx:82`
      and `:106`.
      **WHY IT MATTERS MORE THAN IT LOOKS.** Stories are the highest-signal
      example corpus an LLM reads — it is what Storybook renders and what gets
      copied into product code. We forbid raw values in component CSS and then
      demonstrate them in the examples. `eslint.config.js` has no rule against
      it.
      **FIX:** the demo-scaffolding cases (`maxWidth`, dashed debug borders) are
      legitimately not design decisions, so this is not simply "ban it" — decide
      what a story is allowed to hardcode, then lint that.

- [ ] **No consumer-facing docs for `@ds/react`.** Found 2026-08-16. There is no
      README in `packages/react`, and the root `README.md` documents working *on*
      the system (build tokens, launch Storybook, add a brand), not building a
      screen *with* it. `CLAUDE.md` is likewise written for a contributor. An LLM
      writing an app against the library has the TypeScript definitions and
      nothing else — no worked example, no "which scale when", no statement that
      `style` is not the intended way to space things.
      **Cheapest item on this list and the highest ratio.** The article does not
      cover this either; it is ours to get right.

- [ ] **Wrong-token errors are now the failure mode, and nothing can lint
      them.** Found 2026-08-16, as the direct consequence of the rule shipped
      the same day. `padding: 12px` is dead; `var(--semantic-layout-large)`
      where the design says `medium` compiles, passes CI, and looks fine.
      **WHY THIS SYSTEM MAKES IT LIKELY.** `--semantic-components-*` and
      `--semantic-layout-*` collide numerically at 4, 8, 16, 24 and 40 at
      default density (see the CLAUDE.md note on `get_design_context`). Pick the
      wrong *scale* and it is invisible at default and only wrong at compact —
      the axis nothing in the test suite covers.
      **PARTIAL MITIGATION SHIPPED:** the stylelint error message now states the
      inside-vs-between distinction at the point of failure, which is the best a
      linter can do here.
      **THE REAL CANDIDATE** is "outer beats inner" from the spacing-rhythm item
      above — mechanically checkable, needs no taste, and it is the only rule
      drafted so far that could catch a wrong *token* rather than a wrong
      *value*.

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

- [x] **The stylelint rule now also bans raw px/rem/em for spacing, radius and
      type — but stops there.** Decided 2026-08-16. `padding*`, `margin*`,
      `gap`/`row-gap`/`column-gap`, `*radius` and `font-size` may no longer
      carry a raw number in component CSS. Cost at adoption: near zero, because
      the components were already clean — the only changes needed were the two
      loading spinners (`Button`, `IconButton`), which now bind
      `var(--radius-full)` instead of a magic `9999px`; both render an identical
      circle. Two `-12px` optical-bleed margins on `Button` keep a
      `stylelint-disable-next-line` with a written reason.
      **WHERE IT CAME FROM.** Thomas, 2026-08-16, after reading Polar's
      "LLM-safe design system" piece, which argues that docs are a suggestion and
      CI is a contract. We already ran the colour half of that check in CI, so
      the question was only whether to widen it to numbers.
      **THIS CLOSES the open item raised 2026-08-11** ("consider a stylelint rule
      against raw `px` dimensions", opened after the Switch drifted from Figma on
      hard-coded `32px / 20px / 12px`). That item asked for the legitimate
      exceptions to be worked out before the rule was written; they were, and the
      answer is the boundary below — `0` and `%` were never at risk (no unit /
      not a length), and `1px` borders are excluded by scope rather than by
      exception, because the ban only applies to properties that have tokens.
      **WHY IT STOPS WHERE IT DOES.** It deliberately excludes `border-width`,
      `box-shadow` geometry and gradient stops. There are 12 raw `1px`/`2px`
      borders in components (the 1px→2px thickening on hover in Input, Checkbox
      and Radio is a real interaction pattern) and **no border-width token
      exists in any brand sheet**. Banning raw numbers there would create
      pressure to bind whichever token happens to equal 1 or 2 today — the exact
      failure the Switch-height note in CLAUDE.md warns about. Widening the rule
      is a Figma decision first: add the token, then tighten the lint.
      **WHAT IT DOESN'T BUY US.** It converts wrong-value errors into
      wrong-token errors. `var(--layout-large)` where the design says medium
      still compiles and still passes CI. Polar's version has the same hole –
      nothing in their ESLint rule distinguishes `padding="m"` from
      `padding="l"` – so "correct by construction" is a narrower claim than the
      article implies.

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
