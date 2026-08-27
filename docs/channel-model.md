# The channel model – who the design system is for, and how it reaches them

**Status: MODEL. Authored by Thomas, 2026-08-26. Section 7 validated against a
real handover the same day - see "Tested 2026-08-26".**

This describes how the design system is organised around the people who meet it:
which sides exist, what crosses between them, and in what form. It contains
**no proposed architecture and no build plan** – the same discipline as the
[token structure review brief](./token-structure-review-brief.md). What it does
contain is a set of decisions that were genuinely made, and they are marked as
such.

Diagrams: [`channels.svg`](./channels.svg) (the two sides and the gap check),
[`role-views.svg`](./role-views.svg) (what the system provides each role).

**Attribution matters here.** Every load-bearing turn in this model came from
Thomas, usually as a correction. They are named inline, because a cold thread
should be able to tell which parts are decided and which are my inference:

- The builder / consumer split, drawn rather than described.
- *"Read only is a bad way of putting it – built or consumed is better."*
- *"The whole team building a complex product are all consumers. They just use
  the DS instead of build it themselves. If they need something else, they need
  to request it, not build it."*
- *"The DS is a guide, not law… This rule is only for humans. If AI gets the
  same set of rules, then we are in the plausible range, with no way to guide
  the outcome."*
- *"It might not be the DS problem that somebody needs something. It's an
  opportunity to offer that feedback loop, but not a must."*
- *"The AI will just build the stuff the designer hands over"* – and, earlier,
  that it *"fills out empty spaces without saying so."*

**Sourcing.** Claims about what exists today were read out of the repo or
produced by running a command on 2026-08-26. Claims about how the model should
behave are decisions, not observations, and are worded as such.

---

## 1. Two sides

There is a **system side** and a **product side**.

The system side decides what the design system contains and builds it. The
product side builds a product with it, and never builds the system. That holds
whether the product side is one person or thirty: designers, developers and AI
agents on the product side are **all consumers**.

This is the same rule already written in `~/.claude/CLAUDE.md` – a component may
only be built in the DS project, never in a consuming project – stated as
structure rather than as a prohibition.

**The consequence that follows immediately.** The product side cannot look
inside. There is no reading the source, no checking the decisions log, no asking
the author across the desk. So anything they need is either published, or for
them it does not exist. That is not a quality goal; it is the definition of the
boundary.

## 2. Two crossings, with opposite natures

Only two things cross between the sides.

**Down – what the system publishes.** Not optional. Because there is no
fallback, everything the product side needs to work correctly must travel.

**Up – requests.** An opportunity, not a duty (Thomas, 2026-08-26). Not every
unmet need is the system's problem to solve. A system that offers no request
channel is still a working product; a system that publishes nothing is not.

When the system does answer a request, the answer is yes, no, or not now – and
**a no has to carry what to do instead**, because a refusal with no alternative
sends the consumer straight to an override (see section 5).

## 3. Handover is horizontal

A handover is a designer giving a specific thing to whoever implements it – a
Figma node plus, in this system, the instruction to read the spec rather than
the render.

**It happens on both sides and crosses neither.** A DS designer handing a
component to a DS AI is the system's own business. A product designer handing a
screen to a product AI is the product team's. Same act, different side.

This narrows what the system owes considerably. **The system's job is not to
perform handovers or to own them. It is to make them possible** – shared
vocabulary, and specs precise enough that "read the spec, not the render" is
something a person or an agent can actually do.

Thomas's observation that developers rarely type code any more changes who the
handover is addressed to, not whether it exists: it now runs designer → AI.

## 4. Three channels

The same underlying intent needs three different deliveries, because the readers
are not alike.

| Channel | Reaches | Carries | Today |
|---|---|---|---|
| **Guides** | the designer | judgment – when to reach for one thing over another, and why | Partial. Figma guideline frames, five Storybook MDX pages *(verified)*. Reaches only people already inside those tools. |
| **Handover** | whoever implements | this specific thing, right now – states, bindings, behaviour | Works, and is recorded nowhere. Performed again from scratch each time. |
| **MD instructions** | the AI | standing rules, invariants, component facts | Exists inside this repo only. `CLAUDE.md` loads automatically here and nowhere else *(verified)*. |

**Why the AI needs its own channel at all.** A guide does different work on the
two readers. A human brings stakes, notices when they are unsure, and asks. An
AI produces something plausible, confidently, at scale, and cannot tell the
difference between following a rule and appearing to. Guidance alone leaves the
outcome unsteered – Thomas's "plausible range".

**The rule that keeps three channels honest.** Judgment is authored per channel;
**facts appear in all three and must be single-sourced or they drift.** The
moment a component's states are written independently in a guide, a handover and
an instruction file, three readers follow three different versions and nobody
finds out until the thing is built. This failure is already live in a smaller
form: brand values in `brands/*.design.md` are hand-copied from build output
with nothing checking them *(verified)*.

## 5. Built or consumed, and what an override costs

"Read only" was the wrong frame and was rejected. In Figma a consumer *can*
change an instance's colour – what they cannot change is how it was built.

**An override is a local fork of one property.** Once overridden, that property
stops listening to the system. Everything else keeps updating; that one thing has
quietly left. In code it is identical: an inline style keeps rendering the
consumer's value after the system changes its own, permanently, with no signal.

So the meaningful property of any material is not whether it can be changed. It
is **what happens afterwards** – and things continuing to update is the entire
value proposition of a design system.

**The asymmetry between the two media is the finding.**

- **Figma makes overrides visible and reversible.** The instance shows it was
  changed; reset to main puts it back.
- **Code makes them invisible and permanent.** No marker, no reset, and no way
  for either side to know how far a consuming app has drifted.

The conclusion is *not* to ban the escape hatches, which would make code less
capable than the design tool. It is that **an override should be possible,
visible and reversible.** This system already invented that for itself: the two
`stylelint-disable-next-line` comments in the component CSS, each carrying a
written reason, with `CLAUDE.md` requiring that a new one be asked about first
*(verified)*. It works. It has never been shipped.

## 6. Supported choice, and the silent fork

A supported choice is not freedom – it is the opposite. It is a place where the
system has decided that this is a legitimate axis of variation, enumerated the
options, and guarantees they all stay correct. `variant="solid" | "outline" |
"text"` limits a consumer to three. A `Surface` with no background prop does not
constrain anyone; it hands them every hex value there is.

**Adding a bounded option removes freedom.** That is why it is worth doing, and
it is consistent with limiting choice being the point of a design system.

Any consumer need lands in one of three places:

1. **Offered** – a bounded option exists. Brand. Density. Button variant.
2. **Refused** – the system deliberately does not allow it, and that holds.
3. **Silently forked** – no option and no enforcement, so the consumer invents
   something and quietly leaves the system.

Today, almost everything that is not (1) lands in (3), including things that
should firmly be (2), because the system's rules are enforced only where its own
code is written. On the board in `role-views.svg` there are exactly **two**
supported choices across the whole system: brand and density.

**A missing request channel guarantees (3).** If there is no way to ask, an
override is not a shortcut – it is the only available action. The request
channel and the override problem are one problem.

## 7. The AI does not hit the boundary. It fills it.

This is the sharpest distinction in the model and it is Thomas's.

A human consumer who needs something the system lacks **knows they have reached
an edge**. They ask, or they improvise deliberately. The wall is the
notification.

An AI paints over the wall. It builds what the designer handed over, fills the
empty space, and says nothing. The decision still gets made – nobody is told
that it was made, or by whom.

### Detection, not introspection

An AI cannot notice a gap by introspection; it has no sense of having looked for
something and not found it. **But the gap does not need to be noticed. It can be
detected, because the handover carries the evidence.**

Two checks, neither of them a judgment call:

**At handover, before a line of code.**
- Is this node an instance of a library component, or a local frame?
- Is this value bound to a variable, or typed in?

A local frame means someone built something out of raw layers. An unbound value
means an improvisation, or a missing token. Both are lookups, and lookups are
what an AI does reliably. The data is already being fetched – the existing
`get_design_context` invariant exists precisely because bindings must be read
rather than pixels. **This is that rule's sibling: report what has no component
and no binding, and do not fill it.**

**In code, on the other side of the line.**
A raw hex, a raw px, a component rebuilt locally. The same signal. The mechanism
already exists as this repo's stylelint config; it has simply never travelled.

### The limit, which is the right outcome

Neither check can decide whether something *should* be a system component. A
local frame may be a genuine gap or legitimate app-specific UI – and
`~/.claude/CLAUDE.md` already says app-specific UI is fine, the line being
whether the thing is or should be a design-system component.

So the checks produce **a list to triage, not a verdict.** That is the correct
ambition. The goal was never for the AI to know what is missing. It is that
**the decision is surfaced instead of made by default** – which is the existing
"flagging is not permission" rule, applied at the moment it can still matter.

### Tested 2026-08-26, and partly falsified

Run once on a real handover: the `recipe - add recipe` section of the Prep+Eat
App file, 593 nodes. **Three of five findings were correct, one was half wrong,
and one was noise.**

| Finding | Verdict |
|---|---|
| `select` and `tabs` are components built in the consuming project | **Half wrong.** `tabs` is local; `select` is in the Figma DS and the check missed it. |
| `counter` and `badge` exist in the Figma DS but not in the coded DS | Correct |
| Figma publishes `tabMenuBar` / `tabMenuBarButton`; the code calls them `TabBar` / `TabBarButton` | Correct |
| `ingredient` exists as two differently-spelled components plus 22 raw frames | Correct, and useful - it lets a designer decide whether it should be a component |
| Eleven screens are a copy-pasted template | **Noise.** They are ordinary content containers. |

**What worked.** The check collapses 593 nodes into roughly 22 things needing a
human decision, because it reports **distinct names, not nodes**. That
deduplication is what separates useful from unusable, and it was not in this
model as originally written.

**What failed, and why it matters more.** The `select` miss came from using
Figma's asset search as the "is this a DS component?" lookup. That search sees
only *published* assets - a limitation already recorded in this project's own
notes as *a miss is not absence*. The check therefore reported a component as
missing when it exists.

**This falsifies the paragraph that used to sit here**, which claimed the check
mostly dissolves the need for a manifest of what the system covers. **It does
not.** The check is only as good as the inventory it diffs against, and asset
search is not one. Without an authoritative list of what the design system
contains, it produces false positives and false negatives, and neither is visible
unless a human already knows the answer - which is the exact failure the idea
exists to prevent.

**So the manifest is load-bearing, not optional.** The gap check is the thing
that consumes it.

**And the heuristic detector should be dropped.** Flagging repeated frame names
as possible un-made components cannot distinguish a copy-pasted template from
ordinary content containers without knowing the domain. It produced the one
purely wrong finding. Demote to informational, or remove.

**The pattern across all five is clean:** every finding derived from comparing
two authoritative lists was right. The one from an unreliable lookup was half
wrong. The one from a heuristic was wrong. The method works exactly to the extent
that it has trustworthy inventories to diff.

---

## 8. What this settles

- The product side is **designers, developers and AI together**, all consuming.
- They **request**, they do not build. Requests are an opportunity the system may
  offer, not an obligation it owes.
- **Handover is horizontal.** The system makes handovers possible; it does not
  own them.
- The system must serve **both a solo builder and a full product team** – so a
  handover has to leave a trace, and that trace must cost the solo case nothing.
- **Facts are single-sourced; judgment is authored per channel.**
- **Overrides stay possible**, but should be visible and reversible.
- **The AI channel is not guides.** It is instructions, checks, and examples.
- All four brands remain published to consumers.
- The `Backlog` is builder-only by design. A roadmap is a separate, consumer-
  facing thing that does not exist.

## 9. What it changes about earlier work

[`actor-analysis.md`](./actor-analysis.md) enumerated nine actors and found that
three were served and six were not. That finding stands. **Its structure is
superseded by this one:** nine actors collapse into two sides plus three
channels, which is a shape that can be designed against rather than a list that
can only be audited. Read the actor analysis for the evidence; read this for the
model.

## 10. What it does not settle

1. **Whether the repository stays private.** Unchanged from the actor analysis,
   and still the highest-leverage unknown – it decides the external iOS delivery
   path and what an evaluator can see.
2. **How a handover leaves its trace.** The proposal on the table is that the AI
   writes the component spec as a byproduct of building it, so the solo case pays
   nothing. Untested.
3. ~~Whether the gap check produces a useful list or a noisy one.~~ **Tested
   2026-08-26 - see section 7.** Useful, but conditionally: it needs an
   authoritative inventory to diff against. The question that replaces it is
   **where that inventory comes from**, given that Figma asset search is not
   reliable enough to serve as one.
4. **Which needs deserve to become supported choices** rather than refusals.
   `Surface`'s background is the live example.
5. **Everything the token structure review is holding open.** Naming is upstream
   of the specs this model implies, and is deliberately still in the problem
   space.

## 11. The caution worth keeping

This system has only ever run at n=1. Every claim that the model works for a team
– including the ones in this document – is untested. The nine actors in the
actor analysis are, in practice, one person wearing different hats, which is not
the same as several people with different context and no shared memory. The
closest available test is an agent working outside this repository with no access
to it.
