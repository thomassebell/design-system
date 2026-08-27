# Design System backlog

The work list for the DS. Not just what was decided but **why**, so a cold thread
can be picked up without re-litigating it. Started 2026-08-07.

## Open

- [ ] **`counter` and `badge` exist in the Figma DS but not in the coded DS.**
      Found 2026-08-26 by running the gap check over the Prep+Eat App file
      (`nA8SLN8rhdBov97B1IYxnP`, node `121:11255`). Both are published components
      in the Sebell Design System library - `counter` as a component, `badge` as
      a component set - and neither is among the twenty components exported from
      `packages/react/src/index.ts`. Confirmed by Thomas the same day: *"True
      only in figma DS - waiting to be build in coded DS."*
      **WHY IT IS WORTH RECORDING RATHER THAN JUST BUILDING.** Nothing in the
      repo says which Figma components have a code counterpart and which do not.
      The divergence was invisible until a product file was audited, and it was
      found by accident while testing something else. Any future inventory of
      "what the design system contains" has to answer *contains where*, because
      the two media do not agree.
      **NOTE:** `badge` is already referenced in `brand/core.design.md` - the
      radius section cites "(Radio, Badge)" as shapes that must read as fully
      round. So the core spec already describes a component the library does not
      ship.

- [ ] **Figma and code disagree on the tab bar's name, and names should be
      consistent.** Found 2026-08-26, same audit. The published Figma library
      exposes `tabMenuBar` and `tabMenuBarButton`; the React library exports
      `TabBar` and `TabBarButton`. Thomas, same day: *"naming problem that should
      not exists - naming should be consistent."*
      **WHY THIS IS NOT COSMETIC.** It is the token-structure-review problem one
      level up. A designer picking `tabMenuBarButton` in Figma and a developer or
      agent importing `TabBarButton` in code have no way to know they are the
      same thing, and no automated check compares the two inventories. The
      cross-brand parity check enforces consistency *within* the token layer and
      nothing enforces it *between* Figma and code.
      **DO NOT RENAME EITHER SIDE IN ISOLATION.** A Figma rename ripples through
      instances in consuming files; a code rename is a breaking change for a
      published package. Decide the canonical name first, then sequence the two
      renames deliberately. Related: the token structure review is holding naming
      open, and this belongs to the same decision.

- [ ] **TOKEN STRUCTURE REVIEW – in the problem space, deliberately.** Opened
      2026-08-18 by Thomas. Brief:
      [token-structure-review-brief.md](./token-structure-review-brief.md).
      **THE ASK.** Can the structure be simplified; does it account for **who is
      using it and when**; and is the naming **intent-driven** – every token the
      record of a decision, legible to most people who meet it.
      **WHY NOTHING IS BEING FIXED YET.** Thomas: *"I think it is wise to stay in
      the problem space for a while, before choosing a solution."* The brief
      therefore contains no proposed structure and no renaming scheme, on
      purpose – a solution written down early anchors the review to whoever
      wrote it first.
      **THE ACTOR MODEL IS THE SPINE**, and it is wider than it first looks. Not
      only the designer *authoring* tokens, but the designer *consuming* them
      while doing layout or building recipes – picking from a Figma dropdown,
      mid-layout, no docs open, no view of the tree. Plus the DS component
      author, the external web developer (now genuinely external, via npm), iOS,
      React Native, and the build pipeline. Five of the seven actors only ever
      see a flat list of names, so intent carried by nesting is invisible to
      them.
      **BOTH `Alert` DEFECTS ARE DOWNSTREAM OF THIS** and are parked until it
      resolves. Fixing them first would bake the current structure in.
      **NEXT STEP** is a diagnostic, not a proposal: walk the tree and mark, per
      token, what decision it records and whether the name recovers it.

- [ ] **`Alert` IS NOT FINISHED.** Built from Figma "alert banner"
      (node `42:78`), started 2026-08-16.
      **STATUS CORRECTED 2026-08-18 by Thomas.** This entry previously sat under
      "Decided", checked off, claiming it had *landed*. It had not. Two things
      made that claim look true and neither was: the component builds and its 9
      tests pass, and the log said so. It is also untracked in git, so it exists
      in nobody else's checkout.
      **WHAT IS TRUE RIGHT NOW.** The component, its tests and its story are in
      the working tree. It is deliberately **not exported** from
      `packages/react/src/index.ts`, which keeps it out of the published package
      – verified: zero `Alert` references in `dist/index.js`, `dist/index.d.ts`
      and `dist/index.css`. Re-add the two export lines when it is done.
      **WHAT REMAINS – two defects Thomas identified while building it in
      Figma (2026-08-18). These are STATED FACTS, not open questions. Neither is
      polish; both block Alert.**

      **1. THE CLOSE CONTROL SHOULD BE AN `IconButton` WITH HOVER / PRESSED,
      not a bare icon.** It is currently a transparent `<button>` carrying only
      the DS focus ring, because the Figma had no states for it (see decision 3
      below, which this supersedes).
      *What already exists:* the appearance collection defines `button.text`
      with `label` and `underline`, each carrying **enabled / hover / pressed**
      in both light and dark. So the state tokens for a quiet button are there.
      *What does not:* `IconButtonVariant` is `solid | outline | danger` – there
      is **no `text` variant**, even though `Button` has one and the token layer
      defines it. Adding it is the obvious route.
      *Why it is not just "add the variant":* `button.text` is **brand-coloured**
      and carries an **underline**. An underline is wrong for a `×`, and a brand
      colour on a status banner is the exact trap that produced the green close
      icon already logged above – it fails contrast on the solid variants. A
      quiet IconButton on an Alert has to work on **8 different backgrounds**
      (2 variants × 4 statuses), which `button.text` was not designed for.
      *Still to be worked out (not a challenge to the above):* whether the
      quiet variant takes its colour from the banner via `currentColor`, as the
      bare icon does today, or gets its own token set.

      **2. THERE ARE NO NOTIFICATION COLOURS THAT SUPPORT LIGHT / DARK.**
      Verified: the appearance collection covers exactly `text`, `border`,
      `icon`, `button`, `chip`, `forms`, `tab-bar` (matching `APPEARANCE_ROOTS`
      in `build.mjs`). For status it provides **text colours only** –
      `text.danger`, `text.success`, `text.warning`, `text.info`. There is no
      per-status **background**, **border** or **icon** in either mode.
      *Consequence, already documented at the top of `Alert.module.css`:* Alert
      binds the brand-semantic `--color-*` layer instead, which is what the Figma
      nodes bind, so **an Alert keeps its own colours inside a dark `<Surface>`
      rather than flipping.** That was a deliberate, recorded exception, not an
      oversight – but it is why the component cannot be finished as a
      dark-mode-aware banner today.
      *The fix is a Figma-first change*, per the "add a new component" row in
      `CLAUDE.md`: add a status/notification group to the **appearance**
      collection with light + dark modes, then add its root to
      `APPEARANCE_ROOTS`. One definition covers all brands.
      *Still to be worked out (not a challenge to the above):* the shape of
      that group – which slots per status, and how far it generalises beyond
      Alert.

      **3. NAMING COLLISION FOUND WHILE VERIFYING THE ABOVE.** The appearance
      layer calls it `danger` (`text.danger`, `button.danger`); `AlertStatus`
      calls it `error`. Flagged here because it has to be settled before the new
      group is built in Figma, not after.

      **BOTH OF THESE ARE NOW UPSTREAM OF A WIDER REVIEW** – see the
      token-structure review item. Thomas's call, 2026-08-18: do not fix either
      in isolation, because a notification group added to the current structure
      bakes in whatever the review might change.
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
      is not exported from the package entry point. See the open item.

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
