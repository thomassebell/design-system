# Why this structure – intent-driven tokens, machine-readable specs

**Status: RATIONALE. Not system law, not a proposal, not a decision.**

Assembled 2026-08-26. This document collects the *arguments* for two connected
directions – naming every token after the decision it records, and publishing
the system in a form a machine can navigate – and grounds each one in something
this system has actually found. It exists because that evidence is currently
scattered across [`backlog.md`](./backlog.md), the
[token structure review brief](./token-structure-review-brief.md), `CLAUDE.md`,
memory, and session transcripts, and nowhere as one piece.

**What this is not.** It contains no proposed structure and no renaming scheme –
the [review brief](./token-structure-review-brief.md) deliberately stays in the
problem space, and this file must not smuggle a solution in through the back
door. Nothing here overrides `CLAUDE.md` or `brand/core.design.md`. Where an
item touches an unresolved question, the question stays open.

**On sourcing.** Every item names its evidence. Items marked *(draft)* rest on
[`spacing-rhythm.md`](./spacing-rhythm.md), whose rules are explicitly **not
adopted**. Items 24, 25 and 26 were sharpened by an outside account of the same
problem (Eva Nudea Hörner, *How to Make Your Design System Agent-Ready*,
Bootcamp, Aug 2026) – the diagnosis converged with ours independently, which is
why they are here; the article's proposed structure is not adopted.

---

## A. Why a name has to carry the intent

**1. A value cannot distinguish two decisions.**
`layout.*` and `components.*` collide at 4, 8, 16, 24 and 40 at default density.
The Switch height bug proved the consequence: a wrong binding is invisible at
default and only appears at compact – the one axis no test covers. When two
decisions share a number, the name is the only thing left that can tell them
apart.
*Evidence: `CLAUDE.md`, "Call `get_design_context` before writing CSS".*

**2. Once raw values are banned, wrong-token errors become the whole failure
mode – and no linter can catch them.**
`padding: 12px` is dead. `var(--semantic-layout-large)` where the design says
`medium` compiles, passes CI, and looks fine. The name is the last line of
defence, so it has to do real work.
*Evidence: backlog, "Wrong-token errors are now the failure mode".*

**3. A token is the record of a decision.**
If a reader cannot recover that decision from the name alone, the token has
either a naming problem or no reason to exist. That is a diagnostic that can be
run over all ~365 variables, not a slogan.
*Evidence: review brief, criterion 3.*

**4. Two vocabularies for one thing force a lookup every time.**
`background` vs `fill`, `text` vs `label`, `error` vs `danger` – `Alert`'s API
says error, `Button`'s says danger. Each of these makes correct use depend on
knowing the history.
*Evidence: review brief, observations 4.2 and 4.3.*

**5. `ALL_SCOPES` is not neutral.**
The Prep+Eat drag handles: text tokens were correctly scoped out of vector
fills, which left one unscoped *surface* token as the only plausible option in
the picker. 113 nodes wrong, and not from carelessness. A system's affordances
choose on the user's behalf whether or not they are meant to.
*Evidence: backlog, "Tighten `color/surface/secondary/main` off `ALL_SCOPES`".*

**6. Nesting does not survive the border.**
Group structure becomes a flat hyphenated string in CSS, Swift and NativeWind.
Five of the seven actors only ever see that flat list, so any intent encoded in
the tree has to survive flattening.
*Evidence: review brief, observation 4.6.*

**7. Naming is the cheapest layer to get right and the most expensive to change
later.**
A rename of `--radius-medium` silently drops every consumer to browser defaults.
The build's structural diff exists precisely because renames are the dangerous
migration.
*Evidence: `build.mjs` pre-flight; backlog, stylelint rationale.*

## B. Why the structure must be built around actors

**8. Design for the moment of use, not the moment of authorship.**
Every existing name was written from inside Actor A's head – whole tree in view,
thinking about structure. Actor B picks from a dropdown mid-layout with no docs
open. Those are different jobs, and the name has to serve the second one.
*Evidence: review brief, section 2.*

**9. The consumer is now genuinely external.**
Since npm publishing (2026-08-18) Actor D has a tarball and a 47-line README.
"Readable by everyone using the DS" has to mean readable at *that* distance, not
at repo distance.
*Evidence: review brief, actor D; backlog, "No consumer-facing docs".*

**10. Availability differs by output; meaning must not.**
CSS carries 4 brands × 2 densities × 2 appearances. Swift carries one brand at
one density. NativeWind carries all brands, one density, light only. A token
that means something different depending on which artifact you read is not one
token.
*Evidence: review brief, observation 4.7.*

**11. An agent is the limit case of the least-context actor.**
It never sees Figma, never sees the tree, cannot ask a colleague. Anything that
makes a token legible to an agent makes it legible to the designer in the
dropdown – so this is not AI overhead, it is the same work under a harsher test.
*Evidence: review brief, section 2; the Figma-MCP implementation failures logged
in `CLAUDE.md`.*

## C. Why machine-*readable* is not enough without machine-*checked*

**12. Documentation that cannot be verified drifts, and a confident stale spec
is worse than no spec.**
This system's character is enforcement: stylelint bans primitives, pre-flight
enforces cross-brand parity, CI fails on a stale `DesignTokens.swift`,
`npm run smoke` packs real tarballs. A spec layer without a check would be the
one soft spot in an otherwise hard system.
*Evidence: `CLAUDE.md`, Invariants.*

**13. Every rule needs a home in the pipeline or it will rot.**
The build is the only actor that can enforce anything. A decision that cannot be
expressed as a check is a decision that will quietly stop being true.
*Evidence: review brief, actor G.*

**14. Structural parity is what keeps four brands one system.**
Adding a slot to one brand and not the others fails the build. Without that,
multi-brand becomes four systems sharing a folder.
*Evidence: `build.mjs` cross-brand consistency check.*

**15. Guard the surface where the mistake actually happens.**
Lint covers the DS's own CSS; consuming apps get nothing. All 20 components
inherit `className` and `style`, and `Stack` merges a consumer's `style` into its
own. That hole sits exactly where product code – and generated code – is written.
*Note: whether `@sebellds/react` is a freely composable library or a closed
vocabulary is an open product decision, not settled here.*
*Evidence: backlog, "The lint rules guard the design system's own CSS".*

**16. Examples are a rule whether or not they are meant to be.**
35 inline `style={{…}}` across the stories, including `border: "1px dashed #ccc"`.
Stories are the highest-signal corpus anyone – or anything – copies from.
Forbidding raw values in the linter while demonstrating them in the demo teaches
the wrong habit louder than the rule forbids it.
*Evidence: backlog, "The stories teach the habit the lint rule forbids".*

**17. Know where the machine layer stops, and say so.**
The stylelint rule deliberately covers spacing, radius and type but not
border-width, shadow or gradient stops, because there are no tokens there –
banning raw numbers would force binding a token that merely equals the value
today. That is the Switch mistake in a different costume.
*Evidence: `CLAUDE.md`, "Rule 3 stops exactly where the token layer stops".*

## D. What Figma structurally cannot say – and why a spec layer exists

**18. Figma has no way to express "this one navigates".**
`Button` had variants for every appearance and state and still shipped unable to
be a link: `as="a" href` was spread onto a `<button>`, looked perfect, went
nowhere. A system built to mirror Figma faithfully inherits Figma's blind spots
exactly.
*Evidence: backlog, decided 2026-08-18; `TabBarButton` still has the same gap.*

**19. Behaviour, actions and accessibility have no visual representation.**
"Validates before continuing", "requires confirmation", "the current step is
communicated programmatically" – none of these is a frame, so none can be read
out of one.

**20. Derived dimensions must stay derived.**
The Switch track height is padding + handle + padding. A token that happens to
equal the result today records a coincidence, not a decision.
*Evidence: `CLAUDE.md`, worked example, node `2620:10`.*

**21. Not every Figma artifact is a decision.**
`paragraph emphasized` exists because Figma cannot weight a text range;
`caption` and `overline` were code-only inventions, removed once seen. Mirroring
the tool's workarounds encodes the tool's limitations as design intent.
*Evidence: `core.design.md`, `Text` contract; memory, "mirror intent, not Figma
artifacts".*

**22. A variant is a style, never an element.**
`Text` renders `<p>` and takes heading level via `as`, because document hierarchy
and visual size are independent decisions. Systems that fuse them force a wrong
choice on every consumer.
*Evidence: `core.design.md`, `Text` contract.*

## E. Why composition is where robustness is won or lost

**23. Component correctness does not compose.**
Every gate in this repo asks "does this component match the design and ship
cleanly?" None asks "can I build a page out of this?" The first real web page
ever built with the library surfaced three gaps in one sitting.
*Evidence: backlog, "THE MISSING GATE".*

**24. The layer above components is where the system's identity lives.**
Output that gets every component right and the hierarchy between them wrong is
the definition of "technically correct, but not ours". Patterns and templates are
where that gets written down.
*Evidence: backlog, "THE MISSING GATE"; converges with Hörner (2026).*

**25. Split so context can be retrieved rather than loaded.**
A registry plus one file per thing, cross-linked, lets a reader – human or agent
– pull one template without pulling the system. It also keeps each file small
enough that someone will actually maintain it.
*Evidence: Hörner (2026); consistent with the per-component gap in
`core.design.md`, where 20 component contracts sit in one table.*

**26. The system should not require the consumer to invent anything.**
`Surface`'s own doc says the background is yours to paint, so the one component
whose entire job is appearance has no `background` prop. Anyone filling that gap
writes a hex – precisely what the system exists to prevent.
*Evidence: backlog, "`Surface` requires the consumer to invent a colour".*

## F. What "future-proof" actually means here

**27. Deciding a meaning once, centrally, is what lets values change safely.**
Foundations are set; the 5→7 step ramp widening was done by remapping semantics
onto existing primitives, adding no tints. Intent-named slots are what made a
change that size non-destructive.
*Evidence: `core.design.md`, token-shape note; memory, "foundations are set".*

**28. Structure has to settle before anything is written on top of it.**
Component specs written against `error`/`danger` and `background`/`fill` would
bake in the exact vocabulary under review – the same reason both `Alert` defects
are parked. Order of operations is a design decision, not a scheduling one.
*Evidence: backlog, `Alert` and token-structure-review entries.*

**29. Some things must stay prose, and knowing which is part of the craft.**
The spacing scales and their ≈1.6 ratio are fact; the sequencing rules are still
judgement and have **not** been adopted. A system honest about where its rules
end is more trustworthy than one that pretends they do not. *(draft)*
*Evidence: [`spacing-rhythm.md`](./spacing-rhythm.md), status banner.*

**30. The reason any of this holds is not tooling.**
Spacing is Gestalt proximity – hierarchy is read before a single word is. Tokens
are the notation; intent-driven names are what make the notation legible.
Formats will change; that will not.
*Evidence: [`spacing-rhythm.md`](./spacing-rhythm.md), "The underlying
principle".*

## G. What the markdown layer itself has to do

*The evidence for this section is a live test: a cold Claude Code session on
2026-08-26 that read this repo with no prior context. What reached it, and what
did not, is recorded below as fact.*

**31. Two registers in one file – structure carries what exists, prose carries
what it means.**
The `token-shape` YAML in `core.design.md` conveyed exactly which slots exist.
Only the prose beneath it conveyed that a brand collapsing two radius slots onto
one primitive is a **brand decision, not a system regression**. Strip the prose
for parseability and the intent goes with it.
*Evidence: cold session, 2026-08-26.*

**32. Intent travels as narrative, not as schema.**
The single most behaviour-changing passage in this repo is the Switch worked
example in `CLAUDE.md` – the wrong reading, the right reading, and the rule
derived from the gap. A rule stated alone gets rationalised away at the moment
it is inconvenient; a rule with its failure attached does not.
*Evidence: `CLAUDE.md`, node `2620:10`; cold session, 2026-08-26.*

**33. One file is guaranteed to be read; everything else has to be found.**
`CLAUDE.md` is auto-loaded. Its "Where context lives" section is the closest
thing the repo has to a registry, and it is why the rest was found at all.
Whatever the doc structure becomes, exactly one entry point should need no
searching.
*Evidence: cold session, 2026-08-26.*

**34. A document's reach stops at the checked-out branch.**
The token structure review – the most important fact about the system's current
state – was invisible to the cold session because it sat on an unpushed local
branch. Machine-**readable** is worth nothing if it is not machine-**reachable**.
*Evidence: `docs/token-structure-review-brief`, unpushed as of 2026-08-26.*

**35. Freshness has to be provable, or structure becomes a liability.**
Brand frontmatter values are hand-copied from `dist/<brand>-default.css` with
nothing checking them. The layer that *looks* most machine-readable is the one
with the weakest guarantee – and a confident stale value is read as fact.
*Evidence: `_template.brand.design.md`, copy instruction; no CI check exists.*

**36. A 200-word table cell is not a contract.**
Twenty component contracts live in one table in `core.design.md`. That can be
read. It cannot be diffed, verified against source, linked to, or retrieved
without loading everything around it.
*Evidence: `core.design.md`, Components table.*

**37. Cross-links are the retrieval mechanism, not decoration.**
A spec that names its dependencies lets a reader follow the chain it needs
instead of loading the system. This is the only thing that keeps a growing doc
set from collapsing back into one unreadable file.

**38. Every claim should name what would prove it wrong.**
A spec asserting a component's states, variants or tokens should point at the
file that verifies it. Without an anchor, a spec is an opinion with a timestamp.

**39. Saying what is *not* decided is itself machine-readable.**
The draft banner on `spacing-rhythm.md` and the "problem space only" status on
the review brief both worked on the cold session – both were treated as
unsettled, exactly as intended. Marked uncertainty prevents an agent from
hardening a proposal into a rule.
*Evidence: cold session, 2026-08-26.*

**40. Docs must state the system's boundary, not only its contents.**
Nothing in any md file stated what a consumer actually receives from npm; it had
to be established by running `npm pack --dry-run`. A system that cannot say
where it ends cannot tell anyone what they are allowed to rely on.
*Evidence: cold session, 2026-08-26.*

---

## Where the evidence lives

| Source | What it holds |
|---|---|
| [`token-structure-review-brief.md`](./token-structure-review-brief.md) | The actor model, the seven observations, the three criteria |
| [`backlog.md`](./backlog.md) | The missing gate, the lint-scope gap, `Surface`, stories, wrong-token errors, `ALL_SCOPES` |
| `CLAUDE.md` (repo root) | The Switch worked example, the stylelint boundary, the invariants |
| [`brand/core.design.md`](../brand/core.design.md) | Component contracts, `Text`, the spacing system rule |
| [`spacing-rhythm.md`](./spacing-rhythm.md) | The two scales, the ratio analysis, the Gestalt basis *(rules are draft)* |
| Cold Claude Code session, 2026-08-26 | Section G: what a no-context reader did and did not recover from the docs |
