# Design System backlog

The work list for the DS. Not just what was decided but **why**, so a cold thread
can be picked up without re-litigating it. Started 2026-08-07.

## Open

- [ ] **THE MISSING GATE: nothing checks whether the DS can build a page.**
      Found 2026-08-18, after `Button` turned out to be unable to render a link.
      **THE DIAGNOSIS.** Every gate this repo has asks *"does this component match
      the design and ship cleanly?"* – stylelint checks tokens, `build.mjs` pre-flight
      checks cross-brand parity, the contrast sweeps check colour, Chromatic checks
      appearance, `npm run smoke` checks that a consumer can install and import the
      tarball. Not one asks *"can I build a page out of this?"* And Figma cannot
      prompt the question: a Figma Button has variants for appearance and state, and
      no way to express *"this one navigates"*. A system built to mirror Figma
      faithfully – which is what `CLAUDE.md` demands, and it has been followed –
      inherits Figma's blind spot precisely. `Text` got `as` only because
      heading-level-versus-style is a distinction you hit inside Storybook;
      `Button`'s equivalent is invisible until there is a real page.
      **WHY IT WENT UNNOTICED FOR SO LONG.** The two consumers proved nothing about
      it. Storybook stories never navigate anywhere, and Prep+Eat is React Native and
      cannot consume the components at all (see the entry below). `prepeat-share` is
      the **first real web page ever built with this library**, and it surfaced three
      gaps in one sitting. That is a normal first-consumer yield, not a scandal – but
      it means the remaining gaps are still unfound.
      **THE FIX IS PAGES, NOT COMPONENTS.** Testing 20 components one at a time
      re-tests what Storybook already covers. What broke was *composition*. Three
      page archetypes cover the whole library, and one page exercises ~15 components
      at once:
        1. Marketing / share – `Button`, `IconButton`, `Text`, `Stack`, `Surface`.
           **In progress** as `prepeat-share`; it is what found this.
        2. A form (sign-up or settings) – `Field`, `FieldGroup`, `Input`,
           `Checkbox(+Field,+Group)`, `Radio(+Field,+Group)`, `Switch(+Field)`,
           `Button`, `Text`, `Stack`. **Never built. Highest risk – do this next.**
        3. App shell – `TabBar`, `TabBarButton`, `Surface`, `Chip`, `Icon`.
      **WHY THE FORM PAGE IS THE ONE TO FEAR.** There is no `<form>` and no
      `onSubmit` anywhere in the library or its stories – verified 2026-08-18, zero
      matches. Eleven form-shaped components, never once assembled into a working
      form. Tests exist for exactly four components, all in the button / tab-bar
      family; the entire form cluster has none. Forms are where element semantics
      matter *most* – label association, error announcement, required fields, what
      actually happens on submit. If a button could not be a link, do not assume
      eleven form components got their semantics right untested.
      **KEEP THE PAGES – they are three backlog items, not one.** Kept in the repo as
      an example app, the same artifact also closes "No consumer-facing docs for
      `@sebellds/react`" and "The stories teach the habit the lint rule forbids": a
      real page is a far better example corpus, for a person and for an LLM, than
      isolated stories.
      **SMALLER THING SPOTTED IN PASSING, for whoever does the form page.** `Button`
      sets no `type` attribute, so inside a `<form>` it defaults to `type="submit"`.
      That may well be wrong as a default, but changing it is a behaviour change for
      anything already relying on it – decide it deliberately with the form page, not
      as a drive-by.

- [ ] **Stories and tests are excluded from typechecking, and it hid a real
      regression.** Found 2026-08-18 while adding `as` to `Button`.
      `packages/react/tsconfig.json` has `"exclude": [… "**/*.stories.*",
      "**/*.test.*"]`, and Vite / esbuild strip types without checking them. So
      `npm run lint` runs ESLint over `stories`, but **nothing type-checks a single
      story or test file.**
      **WHAT IT HID, concretely.** The first cut of polymorphic `Button` typed the
      component as a bare call signature, which – unlike
      `ForwardRefExoticComponent` – carries no implicit `ref`. `<Button ref={…}>`
      stopped typechecking while continuing to work at runtime. Every test passed,
      lint passed, `tsc -p tsconfig.json` passed, the build passed, `npm run smoke`
      passed. The only thing that caught it was type-checking the test file by hand.
      A consumer would have hit it immediately.
      **THE FIX IS SMALL AND CURRENTLY FREE.** A second config, because `rootDir` is
      `src` and the story files sit outside it:
      `{"extends":"./tsconfig.json","compilerOptions":{"rootDir":".","noEmit":true,
      "declaration":false,"declarationMap":false},"include":["src","stories",
      "vitest.setup.ts"],"exclude":["node_modules","dist"]}` – then a `typecheck`
      script and a CI step. Verified 2026-08-18: with that config the whole repo,
      **all 17 story files included, typechecks with zero errors.** So this is a
      ~3-line change with no cleanup tail attached – but it does change what CI
      fails on, so it is Thomas's call, not a drive-by.
      **`vitest.setup.ts` must be in `include`** or every jest-dom matcher
      (`toBeInTheDocument`, `toHaveClass`, …) reports as a missing property and buries
      the real errors in noise.

- [ ] **`TabBarButton` still cannot render a link.** Found 2026-08-18, deliberately
      left out of the `Button` / `IconButton` `as` change by Thomas ("fix the button
      and iconButton").
      It renders a hardcoded `<button>` (`TabBarButton.tsx:18`). A tab bar on the web
      is navigation almost by definition, so this is the most certain of the three
      cases, not the least – it is unfixed only because the scope was drawn at two
      components. The pattern to copy is now in `Button.tsx`: `ButtonOwnProps` +
      a generic `as`, the `[aria-disabled="true"]` CSS counterparts, and `ref` on the
      call signature.

- [ ] **`Alert` IS NOT FINISHED.** Built from Figma "alert banner"
      (node `42:78`), started 2026-08-16.
      **STATUS CORRECTED 2026-08-18 by Thomas.** This entry previously sat under
      "Decided", checked off, claiming it had *landed*. It had not. Two things
      made that claim look true and neither was: the component builds and its 9
      tests pass, and the log said so. It is also untracked in git, so it exists
      in nobody else's checkout.
      **THE CODE WAS DELETED 2026-08-18 by Thomas** – *"There was an issue with
      the component alert. Delete the component."* `Alert.tsx`, `Alert.test.tsx`,
      `Alert.module.css`, its `index.ts` and `Alert.stories.tsx` are gone. They
      were never committed, so **git cannot restore them**; a copy was kept in
      the session scratchpad only, which does not survive long. Treat the code as
      gone and rebuild from Figma when Alert is picked up again.
      Nothing depended on it: it was deliberately never exported from
      `packages/react/src/index.ts`, so the published package is unaffected
      (zero `Alert` references in `dist/`), and no other component imported it.
      The `Alert` row in `core.design.md` and every design decision recorded in
      this entry are LEFT STANDING on purpose – they are the contract and the
      reasoning, and all of it still applies to a rebuild.
      **WHAT REMAINS IS NOT RECORDED HERE. Ask – do not infer it from the code.**
      **THE DESIGN DECISIONS BELOW WERE GENUINELY MADE AND STILL HOLD.**
      Two variants × four statuses, plus optional icon, title,
      message and close button. Verified against the design at BOTH densities:
      200×80 at Default and 200×72 at Compact, matching the Figma symbol size.
      **THREE THINGS THE DESIGN DID NOT ANSWER — Thomas decided each:**
      1. **The title↔message gap is a raw `8` in Figma, unbound.** `layout.xsmall`
         and `components.small` are BOTH 8 at Default and diverge at Compact
         (8 vs 4), so the file could not tell us which was meant — the same trap
         that produced the Switch-height mistake. Decision: **`layout.xsmall`**,
         so the gap matches the icon↔text gap above it, which *is* bound to
         `layout.xsmall`. Worth binding properly in Figma.
      2. **The close icon is bound to a brand green in 4 of the 8 variants**
         (`color.icon.lighter` / `color.icon.light`, which alias to
         `color.text.{lighter,light}` — Sebell's pine tints). On solid/success
         that is a dark green × on a mid-green fill, ~1.5:1, against the 3:1
         WCAG 1.4.11 needs for a control. Decision: **the × inherits the status
         text colour** in every variant. This is an authorised deviation from the
         bound tokens, not a reading of them. **The Figma still has the green
         bindings — fix at source and re-export.**
      3. **No hover / pressed / focus state exists for the close button.**
         Decision: **add the DS focus ring only**, nothing invented beyond it.
      **ONE FIGMA ODDITY REPRODUCED RATHER THAN CORRECTED.** solid/error takes
      its message colour from `color.text.contrast-text` while its title takes
      `color.error.contrast-text`; every other status uses `<status>.contrast-text`
      for both. The two resolve to the same value in Sebell, so nothing is
      visible today — but they could diverge in another brand. Built as bound and
      commented in place; **this is almost certainly a slip worth checking.**
      **WHY THE FOCUS RING IS NOT `focus-ring.default`.** That token resolves to
      the brand green, which measures **1.08:1 on solid/error and 1.52:1 on
      solid/success** — invisible on two of the four solid fills. The ring uses
      the width/offset tokens but `currentColor` for the colour, which clears 3:1
      in all eight combinations (lowest 3.85:1). Precedent: `IconButton`'s
      `.danger` already overrides ring colour per variant.
      **A REAL BUG THE BUILD WOULD NOT HAVE CAUGHT.** Storybook does not load
      `src/styles/globals.css`, so components there render **without the DS
      `box-sizing: border-box` reset**. `Alert` is the first component with both
      `width` and padding, so it was the first to expose this: it computed
      `content-box` and overflowed its 200px container by 28px. Fixed by
      restating `box-sizing` on the component and dropping the redundant
      `width: 100%`. **The general problem is still open — see the item above.**

- [ ] **React Native apps can consume the tokens but NOT the components.**
      Recorded 2026-08-18, prompted by Prep+Eat.
      `@sebellds/react` peers on `react-dom`, renders DOM and imports CSS, so there
      is no delivery path into an RN app at all – publishing to npm does not
      change this. What RN *can* consume is `@sebellds/tokens`, specifically
      `dist/<brand>-theme.cjs`, the NativeWind/Tailwind fragment (light
      appearance only in v1).
      **WHY THIS IS WRITTEN DOWN.** Prep+Eat's screens use hand-built inline
      buttons because of this gap. That is the correct call given the gap – but
      it is a gap to fix, **not a pattern to copy**. The global rule stands: a
      component is built in the DS, never in a consuming project. If RN
      components are wanted, that is a DS decision (a second entry point, or
      react-native-web) and it belongs here, not in an app repo.

- [ ] **Storybook renders components WITHOUT the DS reset, so it does not show
      what a consuming app shows.** Found 2026-08-16 while building `Alert`.
      `src/styles/globals.css` (which sets `box-sizing: border-box` on `*`) is
      imported by `src/index.ts`, but `.storybook/preview.js` imports only the
      token stylesheets and the stories import components from `src/components/…`
      directly. So the reset never loads in Storybook.
      **WHY IT MATTERS.** It is a second blind spot of the same family as the one
      `npm run smoke` exists to cover, but pointing the other way: smoke proves
      the *published package* works outside the monorepo, while this means
      *Storybook* silently differs from every real consumer. `Alert` computed
      `content-box` and overflowed its container by 28px – a bug that is invisible
      in a real app and visible only in the tool we use to check designs. Any
      component mixing `width`/`min-width` with padding can hit it.
      **THE FIX IS ONE LINE** – `import "../src/styles/globals.css"` in
      `.storybook/preview.js`. Left undone deliberately: it changes the rendering
      baseline for every existing story, so it wants its own PR with a Chromatic
      pass, not a drive-by in a component PR.
      **DO NOT "fix" this by restating the reset in each component.** `Alert`
      restates `box-sizing` because it genuinely depends on the box model for
      `min-width` to mean what Figma means; that is a local reason, not a pattern
      to copy.

- [ ] **Figma fixes queued for the next `alert banner` re-export.** Opened
      2026-08-16 from the `Alert` build. All three are source-of-truth edits –
      the code is already correct or deliberately deviates, so nothing in the
      repo changes until the re-export.
      1. **Bind the title↔message gap.** It is a raw `8` today. Bind it to
         `layout/xsmall` to match what was shipped, or to `components/small` and
         tell us, because the two differ at Compact.
      2. **Re-point the close icon.** 4 of 8 variants bind `color/icon/lighter`
         or `color/icon/light`, both of which alias to Sebell's pine tints, so the
         × comes out green. solid/success is ~1.5:1 and fails WCAG 1.4.11. The
         code already uses the status text colour instead.
      3. **Check solid/error's message colour.** It binds
         `color/text/contrast-text` where its own title and all other statuses
         bind `<status>/contrast-text`. Same value in Sebell, so nothing shows.

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
      building the system. An app consuming `@sebellds/react` gets **nothing**. Polar's
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
      **DECIDE FIRST:** is `@sebellds/react` a library other people's code composes
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

- [ ] **No consumer-facing docs for `@sebellds/react`.** Found 2026-08-16. There is no
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

- [x] **`Button` and `IconButton` can render any element via `as`; a call to action
      that navigates is now an `<a>`.** Decided 2026-08-18 by Thomas, after
      `prepeat-share` was blocked by it.
      **THE BUG.** Both components rendered a hardcoded `<button>` with no `as`, so
      `as="a" href="…"` fell into `...rest` and was spread onto the button as unknown
      DOM attributes: `<button as="a" href="https://…">`. It looked exactly right and
      navigated nowhere. There was no correct workaround either – an `<a>` wrapping a
      `<button>` is invalid HTML, and the CSS Module class object is not exported, so
      copying the classes onto one's own anchor is not even mechanically possible.
      **WHY `as` AND NOT `asChild`.** `Text` and `Stack` already establish `as`. A
      second idiom for the same job would be worse than the gap. The props follow the
      element, so `as="a"` accepts `href` and rejects `type`.
      **THE PART THAT NEEDED A REAL DECISION: `disabled` on an anchor.** `disabled`
      is a `<button>` attribute and nothing else – React drops it from an anchor
      silently, so a "disabled" link would have gone on looking faded *and still
      navigating*, which is a worse bug than the one being fixed. On a non-`<button>`
      element the state is now expressed the only way an anchor can express it:
      `aria-disabled="true"`, `href` removed so there is nothing to follow, and
      `onClick` suppressed to match the native path. Removing `href` also takes the
      element out of the tab order on its own – **verified in the browser**, not
      assumed: the disabled link is neither programmatically focusable nor in the
      sequential tab order, exactly like a native disabled button, so no
      `tabIndex={-1}` override was added. The element-state block is spread *after*
      `...rest` on purpose, so a caller's `href` cannot survive the disabled state.
      **TWO CSS CHANGES THE ANCHOR PATH REQUIRED.** (1) `text-decoration: none` on
      the base class – an `<a>` underlines by default, and the `text` variant draws
      its own underline as an inset `box-shadow` at the offset the design asks for, so
      a browser underline would have sat at the wrong place. (2) Every `:disabled` and
      `:not(:disabled)` selector gained an `[aria-disabled="true"]` counterpart;
      `:disabled` never matches an anchor, so without it a disabled link would not
      have faded at all.
      **VERIFIED.** 30/30 tests pass, including 5 new ones covering the anchor path
      (href present and working, `as` not leaked to the DOM, styling identical,
      disabled strips `href` and blocks `onClick`, ref forwards to the anchor).
      `tsc`, `npm run lint`, `npm run build` and `npm run smoke` all clean – smoke
      matters here because the emitted `.d.ts` had to survive the polymorphic cast,
      and it does. Checked visually in Storybook: the three link variants render
      identically to the buttons with no browser underline, and the disabled link
      computes `opacity: 0.5` / `cursor: not-allowed`, which is the proof that the new
      `[aria-disabled="true"]` selectors match.
      **NOT DONE, deliberately:** `TabBarButton` – see the Open entry. Scope was
      Thomas's: "fix the button and iconButton, log the test for another day."
      **`ButtonOwnProps` / `IconButtonOwnProps` are now exported** because
      `ButtonProps` references them; a consumer with declaration emit would otherwise
      hit a "using private name" error.

- [x] **`Text` now mirrors the Figma type ramp exactly; `caption` and `overline`
      dropped.** Decided 2026-08-18 by Thomas, same day as the variant rename above.
      **WHAT WENT.** `caption` (small + `text.subtle`) and `overline` (small +
      emphasized + uppercase + `letter-spacing: 0.04em` + `text.disabled`). Neither
      existed in the Figma `typography` page (node `52:111`), which defines twelve
      styles and no more: `header/display 1 … 6`, `paragraph/{paragraph, paragraph
      emphasized, small, small emphasized}`, `components/{label, tabel header}`.
      Both also baked a **colour** into a type style, contradicting the three-axis
      model in `core.design.md`; `overline`'s tracking was invented outright, since
      every Figma style is `letterSpacing: 0`. `Text` is now `display1 … display6`,
      `body`, `bodySmall` – nothing else. No production code used the two removed
      variants; only stories and the props table referenced them.
      **WHY EMPHASIS DID *NOT* BECOME A VARIANT, which is the subtler half.** Figma
      carries `paragraph emphasized` and `small emphasized` as separate styles, so
      "mirror Figma exactly" would seem to demand `bodyEmphasized` variants. Thomas
      ruled otherwise, and the reason is the useful part: *"It is only possible to
      change a word's styling in a paragraph by applying a different style. Not
      possible to do it the right way and set a weight."* Those two styles are a
      **workaround for a Figma limitation** – the tool cannot set a weight on a text
      range – not a statement that emphasis is its own type style. The web can
      express the real intent, so it does: a nested `<strong>`/`<b>` for a word
      (bound to `font-weight.emphasized`, never the browser's bold), and the
      `weight` prop for a whole block. Same rendered values as Figma's two styles.
      **GENERAL RULE THIS SETS.** Mirroring Figma means mirroring the *design
      decisions*, not the shapes Figma's editing model forced them into. Where a
      Figma construct exists only because the tool could not express the intent
      directly, code should express the intent. Flag such cases rather than
      transcribing them – and equally, do not invent styles the ramp does not have.
      **LEFT ALONE.** `weight="understate"` stays, though no Figma text style uses
      that slot – it is a real weight in the brand collection, and the story says so.

- [x] **`Text` variants renamed to the type ramp; style and hierarchy decoupled.**
      Decided 2026-08-18 by Thomas, built the same day. `@sebellds/react` 0.1.1 → 0.2.0.
      **WHAT CHANGED.** The variant vocabulary was `display, h1, h2, h3, h4, body,
      bodySmall, caption, overline`. It is now `display1 … display6` plus the same
      four paragraph-family variants – one variant per `font-size.display-*` token.
      The element is no longer inferred from the variant: every variant renders `<p>`
      and heading level is set explicitly with `as`. Two capabilities were added at
      the same time: nested `<strong>` / `<b>` bind to `font-weight.emphasized`, and a
      `weight` prop exposes all three weight slots.
      **WHY.** Thomas's framing, which is the decision: *"H1, H2 etc. is set to create
      hierarchy, display-1, display-2 etc. is set to create styling. They should not be
      dependent on each other."* The old names welded the two together, so choosing a
      size also chose a document outline level – and `variant="h1"` returned the
      *second* largest size, because a "display above the ladder" convention from the
      pre-Figma scaffold survived the token migration unexamined.
      **WHAT THE OLD NAMES COST, concretely.** Five old slots were re-pointed at the new
      ramp slot-for-slot in 9df1af5 (its own commit message ends the mapping at
      `display-5`). Six tokens, five slots – `display-6` was orphaned and unreachable
      through `Text`, which is why `Alert` and `FieldGroup` hand-rolled the same
      header/emphasized/display-6 recipe in their own CSS. `font-weight.understate`
      was orphaned the same way and had **zero** consumers anywhere in the library.
      **WHY NO DEPRECATION PATH.** The package was public (0.1.1, npm) but had no known
      consumer – Prep+Eat is React Native and cannot install `@sebellds/react` at all.
      Thomas: *"nothing is breaking, because nothing is built."* 0.x permits the break,
      so the old names were removed outright rather than kept as warning aliases.
      **NOT DONE, deliberately.** `Alert` and `FieldGroup` still hand-roll display-6
      instead of composing `Text` – a separate change, kept out to keep this diff
      readable. Token values were not touched.
      **CHECKED AGAINST FIGMA** (2026-08-18, file `65DhWI9kmp9ee9wzoIfTMM`, the
      `typography` page, node `52:111` – pointed out by Thomas).
      **THE PAIRING IS DESIGN-SPECIFIED, and the build matches it exactly.** Figma
      has composite text styles that bind family + weight + size + line-height:
      `header/display 1 … header/display 6`, `paragraph/{paragraph, paragraph
      emphasized, small, small emphasized}`, `components/{label, tabel header}`.
      `header/display 6` binds `font-size/display-6` to `line-height/xsmall` – so
      the display-6 line-height shipped here is Figma's decision, not an inference.
      All six display pairings match. Figma's own labels are "Display 1"…"Display 6",
      so `display1 … display6` is Thomas's naming; no rename owed.
      **A SEARCH MISTAKE WORTH NOT REPEATING.** `search_design_system` returned
      `"styles": []` three times, and that was read as "the file has no text styles".
      It only searches **published library** assets; these styles are local to the
      file. A negative from that tool is not evidence of absence – open the page.
      The same tool also lists only the `cover` page for this file, so pages cannot
      be enumerated; ask for a node link rather than concluding something is missing.

- [x] **Licence: MIT.** Decided 2026-08-18 by Thomas, before the first publish.
      `LICENSE` at the repo root and copied into both published packages
      (`packages/tokens`, `packages/react`), plus `"license": "MIT"` in both
      package.json files. Copyright line: **Thomas Sebell**.
      **WHAT WAS WEIGHED.** MIT lets anyone take a *copy* and use, modify or sell
      it, keeping the copyright notice; it grants nobody any control over this
      repo, this package or the Figma file, and it disclaims warranty so a
      consumer cannot hold Thomas responsible. The one real consideration for a
      *design system* is that MIT covers the brand palettes too, so the token
      values are legally reusable, not merely readable. Judged a small cost: the
      values are visible in any published CSS anyway, and the realistic consumers
      are Thomas's own projects. The brand *name* is unaffected – trademarks are
      not covered by a code licence.
      **WHY IT WAS SETTLED BEFORE PUBLISHING**, not after: the licence a package
      shipped under is the one people relied on, and changing it later is messy.
      The first publish attempt failed on npm's 2FA requirement, which is what
      left room to get this right.

- [x] **Published to public npm under the `@sebellds` scope.** Decided 2026-08-18,
      wired the same day. `@ds/tokens` → `@sebellds/tokens`, `@ds/react` →
      `@sebellds/react`, renamed everywhere including docs, CI, the Vercel build
      command and the generated Swift header.
      **WHY THE RENAME WAS FORCED.** `@ds` was never ours. It is a two-letter
      scope, unclaimed on npm (0 packages), and `@ds/react` depended on
      `"@ds/tokens": "*"` – a wildcard that resolves against the **public**
      registry. Publishing that as-is would have meant anyone who claimed `@ds`
      could serve tokens into every consumer's install. Every distribution route
      we considered required a scope we actually control, so the rename was not
      really a choice between routes.
      **WHY PUBLIC RATHER THAN PRIVATE.** Thomas chose public npm over GitHub
      Packages and a paid private org, with the trade-off stated: the components,
      the token pipeline and every brand palette (Sebell, Brand A, Brand B,
      Prep+Eat) become world-readable. Bought in exchange: no auth anywhere, no
      `.npmrc` in consuming projects, no registry env var in Vercel builds.
      **THE ORDERING IS LOAD-BEARING.** `@sebellds/react` now pins
      `"@sebellds/tokens": "^0.1.0"` instead of `"*"`. Tokens must be published
      first; react published against an unpublished tokens version is installable
      by nobody, and npm only permits unpublishing for 72 hours.
      **NO PUBLISH JOB IN CI**, deliberately – publishing is irreversible enough
      to want a human at the keyboard. Sequence is in `CLAUDE.md`.
      **THE SCOPE IS `@sebellds`, NOT `@sebell`.** A custom npm scope needs an
      org of the same name; `sebellds` is the org Thomas registered.
      **`Alert` IS EXCLUDED FROM THE FIRST PUBLISH** – it is unfinished, so it
      is not exported from the package entry point. See the open item. (Its code
      was deleted 2026-08-18; it never reached any published version.)

      **WHAT IS LIVE ON NPM RIGHT NOW — keep this current.** Thomas's shipping
      rule is that what is in the code and what is actually published must never
      drift silently, so record every publish here.

      | package | live version | published |
      |---|---|---|
      | `@sebellds/tokens` | `0.1.1` | 2026-08-18 |
      | `@sebellds/react` | `0.2.0` | 2026-08-18 |

      `@sebellds/react` `0.2.0` is the breaking `Text` change (see the entry
      above): `display1 … display6, body, bodySmall`, no inferred element. It is
      tagged `latest`, so a fresh `npm install` gets the new API and any consumer
      still on `variant="h1"` or `"caption"` fails to compile – verified, those
      are hard `TS2322` errors against the published types.
      **Tokens was deliberately NOT republished.** It was unchanged at `0.1.1`,
      and react pins `"^0.1.0"`, which resolves to it. The "tokens first" rule is
      about never publishing react against an *unpublished* tokens version – it
      does not require a version bump when tokens has not changed.
      **VERIFIED FROM THE REGISTRY, not from the monorepo.** A clean-room install
      outside the workspace resolved `react@0.2.0` → `tokens@0.1.1` transitively,
      server-rendered `<Text variant="display6" as="h1">` to
      `<h1 class="Text_text Text_display6">`, and confirmed both CSS entry points
      resolve. `npm run smoke` proves the same thing pre-publish; this proves it
      post-publish, which is the only check that covers the registry itself.
      **PUBLISHING NEEDS A HUMAN.** The npm account has 2FA set to
      `auth-and-writes`, so `npm publish` demands a one-time code. An agent
      cannot supply it – prepare the release, then hand Thomas the command.

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
