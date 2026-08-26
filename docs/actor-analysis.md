# Who a design system is for – actor analysis

**Status: PROBLEM SPACE ONLY. Opened 2026-08-26 by Thomas.**

This document describes **who meets the design system, at what moment, and with
what in front of them at that moment.** It deliberately contains **no proposed
architecture, no refactor plan and no fixes** – the same discipline as the
[token structure review brief](./token-structure-review-brief.md), and for the
same reason: a solution written down here would anchor everything that follows to
whoever wrote it first.

It exists because a specific question could not be answered: *what does someone
who installs this system actually get?* Answering it took a build command rather
than a document, and the answer was worse than expected. That is a symptom. This
analysis is an attempt to find the disease before prescribing anything.

**Sourcing.** Everything marked *verified* was read out of the repo or produced
by running a command on 2026-08-26. Everything marked *per project records*
comes from the project's own notes and has **not** been re-verified in this
session – treat it as needing confirmation before anything is built on it.

---

## 1. Method

Three questions per actor, in this order. The order matters: the third question
is meaningless without the second.

1. **The moment.** When do they meet the system, and what are they trying to do?
2. **The field of view.** What can they actually see *at that moment* – not what
   exists somewhere, what is in front of them.
3. **The need.** What has to be true for them to succeed without asking anyone.

Then two findings per actor: what the system gives them today, and where that
falls short. "Falls short" is a statement of fact about the gap, not a claim that
it must be closed – several may turn out to be correct and deliberate.

---

## 2. The actors

### A. The system designer
*Authoring the system in Figma. Deciding what a token is and what it is called.*

- **Field of view:** everything. The whole variable tree, all brands, all modes,
  the component library, and the reasoning that produced it.
- **Need:** to be able to express a decision precisely, and to know what a change
  will break.
- **Today:** the system is built almost entirely around this actor. Naming,
  structure and grouping all serve the moment of authorship.
- **Falls short:** nothing tells this actor which decisions are legible to
  anyone else. Every name reads correctly from inside the head that wrote it.

### B. The system engineer
*Building or changing a component inside this repo.*

- **Field of view:** the code, the docs, git history, Figma via MCP, and an
  auto-loaded instruction file. The widest view of any actor except A.
- **Need:** to know the contract, the invariants, and which token is correct –
  not merely which token compiles.
- **Today:** well served. `CLAUDE.md` loads automatically and carries the
  invariants; stylelint blocks primitives and raw values; the build pre-flight
  enforces cross-brand parity. *(verified)*
- **Falls short:** per-component detail lives in one table with twenty rows, so
  a component's states and behaviour cannot be looked up, diffed or verified in
  isolation. *(verified)*

### C. The build pipeline
*Not a person. Runs on every change.*

- **Field of view:** the full token tree, every brand, both densities, the
  component CSS, the published tarballs.
- **Need:** every rule expressed as something that can fail.
- **Today:** the strongest actor in the system. Alias misalignment and
  cross-brand parity are fatal; a stale generated Swift file fails CI; `npm run
  smoke` packs real tarballs and installs them. *(verified)*
- **Falls short:** it verifies that the package **installs and imports**. No
  check asks whether anything published is **usable** – whether the docs are
  accurate, whether links resolve, whether a consumer can find out what a brand
  is. *(verified)*

### D. The product designer
*Using the published Figma library to design a screen. Not making system
decisions – applying one someone else already made.*

- **Field of view:** a variable dropdown, a component picker, and the screen they
  are working on. No documentation open. No view of the tree.
- **Need:** to pick correctly at a glance, and to know when two similar names are
  genuinely different.
- **Today:** the Figma library is published *(per project records)*. Scoping does
  some of the work of narrowing choices. *(verified in part – one unscoped colour
  token is a known trap, recorded in the backlog)*
- **Falls short:** this is the actor the current naming serves least, by the
  system's own assessment. Nesting is invisible in a dropdown; two vocabularies
  exist for the same component; and one token offered in every picker will be
  chosen wherever a scoped one was kept out. *(verified)*

### E. The product engineer, web
*Has installed `@sebellds/react` and `@sebellds/tokens`. Building a real screen.*

- **Field of view:** the installed package – built JS, a CSS file, a type
  definition file, and a 47-line README. Nothing else. The repo is **private**.
  *(verified)*
- **Need:** to know what components exist, what states they have, which spacing
  scale to use when, and what is not allowed.
- **Today:** the built artifacts work. All four brands and both densities ship.
  A live Storybook exists and is public *(per project records – URL not verified
  this session)*.
- **Falls short:** both READMEs and both `package.json` `homepage` fields point
  at the **private** repo, so every documentation link a consumer follows is a
  404, and the public Storybook is advertised nowhere. No token list, no spacing
  rule, no statement that `style` is not the intended way to space things.
  *(verified)*

### F. The product engineer, native
*iOS/SwiftUI, or React Native.*

- **Field of view:** generated constants only. Never sees the cascade that
  produced a value.
- **Need:** the same decisions the web consumer needs, expressed in their
  platform's terms.
- **Today:** iOS gets one brand at one density – whichever is first in the brand
  config – via a Swift package consumed from git. React Native gets a theme
  fragment per brand, light appearance only, and **cannot consume components at
  all**. *(verified)*
- **Falls short:** the iOS package is served from a **private** repository, so an
  external iOS consumer cannot fetch it at all. A React Native app has tokens but
  no components and no stated path to any. *(verified)*

### G. The AI agent in a product repo
*Writing product code against the installed system. Cannot ask anyone.*

- **Field of view:** the type definitions, the README, and whatever example code
  it can find. It cannot run the repo's linters, cannot read the invariants, and
  will not notice when it has guessed.
- **Need:** the rules to travel inside the package, and the escape hatches to be
  closed or documented.
- **Today:** it gets types. That is nearly all. The lint rules that enforce
  correct use run only inside this repo; every component inherits `className` and
  `style`, and one merges a consumer's inline styles into its own. *(verified)*
- **Falls short:** this actor will fill any gap with a hardcoded value, silently
  and at scale. The system's rules are enforced exactly where this actor is not.

### H. The evaluator
*Deciding whether to adopt the system at all. Has not installed anything.*

- **Field of view:** an npm listing, a README rendered on npmjs.com, and any link
  that resolves.
- **Need:** to see what the system is, what it looks like, and whether it is
  maintained – in about two minutes.
- **Today:** two READMEs, both ending in a link to a private repository.
  *(verified)*
- **Falls short:** every route from the npm page to anything visual is broken.
  The system's best asset – a live Storybook with every component, state, brand
  and density – is unreachable from anywhere it is published.

### I. The cold maintainer
*Picking the work up months later. Increasingly, an agent. Sometimes Thomas.*

- **Field of view:** the repo as checked out, plus git history.
- **Need:** to know what was decided, why, and what is currently underway,
  without re-litigating any of it.
- **Today:** unusually well served on the *why* – the backlog records reasoning,
  not just outcomes, and the instruction file carries the invariants with the
  failures that produced them. *(verified)*
- **Falls short:** the single most important current fact – that a token
  structure review is open – was invisible, because the document sits on an
  unpushed branch. Reach, not content, was the failure. *(verified)*

---

## 3. What the analysis shows

**3.1 Three actors were designed for; six were not.**
A, B and C – the designer authoring, the engineer building, and the pipeline
enforcing – are all inside the repo. Every convention, check and document serves
them. D through I are all outside it, and no artefact in the system is addressed
to any of them.

**3.2 The system has an internal architecture and no external one.**
Token cascade, alias resolution, cross-brand parity, density, appearance modes,
committed generated output, a tarball smoke test: all of it is coherent and
enforced. There is no equivalent structure governing what leaves the system –
what is published, to whom, in what form, and how they find out what it means.

**3.3 Every check stops at the boundary.**
The smoke test proves a consumer can install and import. It does not ask whether
a consumer can *use*. That is the same gap the backlog already records for
components – every gate asks whether a component matches the design, none asks
whether a page can be built – appearing a second time, one level up.

**3.4 The failures are not a list of bugs.**
A broken homepage link, an unadvertised Storybook, an iOS package behind a
private repo, docs on an unpushed branch, rules enforced only where they are not
needed: these are the same omission expressed six ways. No actor outside the
repo was ever named, so nothing was ever built for one.

**3.5 The strongest evidence is that this analysis was triggered by a question,
not a bug.** Nothing was broken in the code. Someone simply asked what a
consumer receives, and the system could not say.

---

## 4. Explicitly out of scope

- Any proposed architecture, package layout, or documentation structure.
- Whether the system needs a refactor, a completion, or neither.
- The token naming question – that has its own brief, and it is upstream of some
  of this and downstream of none of it.
- Any of the specific fixes identified while gathering this evidence. They are
  recorded in the backlog and deliberately not acted on here.

## 5. Open questions this analysis cannot answer

1. **Is the repository meant to stay private?** Actor E, F, G, H and the iOS
   delivery path all change shape depending on the answer, and it is the single
   highest-leverage unknown.
2. **Is `@sebellds/react` a library others compose freely, or a closed
   vocabulary?** Already open in the backlog. Actor G's whole situation follows
   from it.
3. **Which actors is this system actually for?** It currently has four brands,
   two densities, three platforms and one production consumer. An honest answer
   might narrow the actor list rather than serve all of it.
