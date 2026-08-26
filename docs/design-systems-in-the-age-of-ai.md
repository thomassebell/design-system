# Design systems in the age of AI

*How to build one that survives contact with generated code.*

**Status: essay, not system law.** This is a generic statement of principles –
nothing in it is specific to any one design system, and none of it overrides a
repo's own rules. It is distilled from practice: every principle here was
learned by getting it wrong first, and each one carries the failure that taught
it, because a rule without its failure attached is the first thing to be
rationalised away.

---

## What actually changed

Generating an interface got cheap. Generating the *right* interface did not.

The failure mode is not broken output. It is output that is **almost right**: a
card with the wrong hover state, a colour used for the wrong semantic purpose, a
primary and a secondary action whose hierarchy is inverted, spacing that follows
a grid but not yours. None of it is bad. It just isn't yours.

That gap has a precise cause. A generator has access to how things *look* and
almost no access to how the system *decides*. Every design system contains
decisions – which scale for which job, which action goes where, what a variant
is allowed to mean – and almost all of them are stored in the heads of the people
who made them, or in prose nobody reads at the moment of use.

So the job changes. A design system stops being a reference that humans consult
and becomes **context that tools consume**. That is not a documentation project.
It changes what a good token name is, what a component contract has to say, what
you are obliged to enforce, and what you must write down that you never had to
before.

Six principles follow. They are ordered: each depends on the ones above it.

---

## 1. Names carry the intent, because values cannot

**1.1 A value cannot distinguish two decisions.**
The moment two scales share a number – 16px of spacing *inside* a component and
16px *between* components – the value stops identifying the decision. Pick the
wrong one and nothing looks wrong, until a density mode, a breakpoint or a theme
pulls the two apart. Then a bug appears in a place nobody changed.
*Check: list every pair of tokens that share a value in your default
configuration. Each pair is a place where only the name can save you.*

**1.2 Every token is the record of a decision.**
If a reader cannot recover the decision from the name alone, the token has either
a naming problem or no reason to exist. That is a diagnostic you can actually run
across a whole tree, and it produces evidence instead of opinion.
*Check: walk the tree. For each token write the decision it records. The ones you
cannot write are your work list.*

**1.3 Once raw values are banned, wrong-token errors are the only failure left –
and no linter catches them.**
Banning hardcoded numbers is the easy half and it is genuinely worth doing. But
the residue is worse: the right *kind* of token from the wrong *family* compiles,
passes every check, and looks correct. Naming is the only defence remaining, so
it has to carry real weight.

**1.4 One concept, one word.**
`background` in one layer and `fill` in another, `text` here and `label` there,
`error` in the component API and `danger` in the token layer. Each of these makes
correct use depend on knowing the history. Vocabularies drift apart layer by
layer because each layer was named by someone solving that layer's problem.
*Check: grep the whole system for synonyms. Every pair is a tax on every future
reader.*

**1.5 Availability is not neutrality.**
A token offered everywhere will be chosen in a context you deliberately kept
other tokens out of. Scoping one family correctly and leaving another unscoped
does not produce a neutral picker – it produces a funnel toward whatever is left.
The affordance chooses, not the person.
*Check: any token visible in every picker is a trap of this shape, for any
property.*

**1.6 Nesting does not survive the border.**
Whatever structure the source tree has becomes a flat string by the time it
reaches CSS, a platform constant file, or a theme fragment. Almost everyone who
uses your tokens sees the flat list, never the tree. Intent encoded only in
hierarchy is intent that does not ship.

**1.7 Renaming is the dangerous migration, not revaluing.**
Change a value and things shift. Change a name and consumers fall back to
defaults, silently, in code you do not control. This is the cheapest layer to get
right and the most expensive to change, which is why naming deserves a review
before it deserves a refactor.

## 2. Design for the moment of use, not the moment of authorship

**2.1 Enumerate who meets a token, and what they can see when they do.**
The author has the whole tree in view and is making a decision. Everyone
afterwards is *applying* a decision someone else made, usually with less context:
a designer picking from a dropdown mid-layout with no docs open; a component
author constrained to semantic names in a flat autocomplete; an app developer who
has an installed package and a README; a platform developer reading generated
constants; the build pipeline. Names written from inside the author's head serve
the author's moment, and no other.
*Check: for each actor, could they pick correctly with only what is in front of
them at that moment?*

**2.2 Most actors never see the structure.**
If five of your seven audiences meet the system as a flat list of names, the tree
is a convenience for the two who author it. Design the flat names first.

**2.3 The published consumer sees only what you published.**
The moment a system ships as a package, its audience is genuinely external: they
have the artifact and its README, and nothing else – not your repo, not your
design file, not your conventions. Everything you rely on them knowing has to
travel inside the package.

**2.4 Meaning must not depend on which output you read.**
Different targets legitimately carry different *coverage* – all themes here, one
theme there, light only somewhere else. That is a constraint. But a token that
means something different depending on which artifact you read is not one token.

**2.5 An agent is the limit case of your least-context actor.**
It never sees the design file, never sees the tree, cannot ask a colleague, and
will not notice when it has guessed. Anything that makes a name legible to it
makes it legible to the designer in the dropdown. This is not AI overhead – it is
the same craft under a harsher test.

## 3. Machine-readable is worthless without machine-checked

**3.1 A confident stale document is worse than no document.**
Documentation that nothing verifies drifts, and drifted documentation is read as
fact by exactly the readers least able to detect it. If you publish a spec layer,
publish a check with it, even a crude one.

**3.2 Every rule needs a home in the pipeline or it stops being true.**
The build is the only participant that can enforce anything. A decision that
cannot be expressed as a check is a decision with a half-life.
*Check: for each rule you have written down, name the thing that fails when it is
broken. Rules with no answer are aspirations.*

**3.3 Structural parity is what keeps many themes one system.**
If a slot can exist in one brand or theme and not the others, you do not have a
multi-brand system, you have several systems in one folder. Failing the build on
a missing key is what holds them together.

**3.4 Guard the surface where the mistake actually happens.**
Most systems lint their own source and nothing else, while the code that
misapplies them is written elsewhere – in product repos, increasingly by
generators. If components accept arbitrary class names and inline styles, the
escape hatch sits exactly where the damage is done.
*This forces a real product decision: is your library something other people's
code composes freely, or a closed vocabulary? Everything else follows from the
answer, and it is not a lint question.*

**3.5 Examples are rules, whether or not you meant them to be.**
Demos and stories are the highest-signal corpus anyone copies from, and the first
thing a generator reads. Forbidding raw values in the linter while demonstrating
them in the examples teaches the wrong habit louder than the rule forbids it.

**3.6 Know where the machine layer stops, and say so.**
Enforcement should cover exactly what the token layer covers, and stop. Extending
a rule into territory with no tokens behind it pushes authors into binding a
token that merely *equals* the value today – recording a coincidence as a
decision. If those values deserve tokens, add the tokens first, then tighten.

## 4. Write down what the design tool cannot say

**4.1 Design files express appearance and state. They cannot express intent.**
A button can have a variant for every look and every state and still have no way
to say *this one navigates*. A system built to mirror its design file faithfully
inherits that blind spot precisely – and faithfulness is otherwise the correct
instinct, which is what makes this hard to notice.

**4.2 Behaviour, actions and accessibility have no visual representation.**
"Validates before continuing." "Requires confirmation." "The current step is
communicated programmatically." "This action belongs in the bottom bar, that one
in the top." None of these is a frame, so none can be read out of one. They need
a written home or they live nowhere.

**4.3 A derived value must stay derived.**
If a height is padding + content + padding, reproduce the derivation. Binding a
token that happens to equal today's result records a coincidence, and the
coincidence breaks the first time any input changes.

**4.4 Not every artifact in the design file is a decision.**
Some styles exist because the tool cannot express something a different way, and
some exist because someone was exploring. Mirroring those into the system encodes
the tool's limitations as design intent.
*Check: for each style, ask what decision it records. Tool workarounds have no
answer.*

**4.5 A variant is a style, never an element.**
Visual size and document semantics are independent decisions. Systems that fuse
them – where picking a look also picks a heading level – force a wrong choice on
every consumer, and generators make that wrong choice at scale.

## 5. Composition is where systems actually fail

**5.1 Component correctness does not compose.**
Nearly every gate a design system has asks "does this component match the design
and ship cleanly?" Almost none asks "can I build a page out of this?" The
questions are not the same, and the second one is where real products break.
*Check: build a real page. The first one built with a library typically surfaces
several gaps in a single sitting.*

**5.2 The layer above components is where identity lives.**
Output that gets every component right and the hierarchy between them wrong is
exactly what "technically correct, but not ours" means. Patterns – how components
work together – and templates – the starting structure of a recurring screen –
are where that judgement gets written down. Most systems stop at components and
then wonder why generated screens feel generic.

**5.3 The system should never require the consumer to invent anything.**
Any gap you leave – a colour with no token, a spacing decision with no rule – gets
filled. A human fills it with a guess. A generator fills it with a hex code. A gap
in the system is not neutral ground; it is where the system stops being followed.

## 6. The documentation layer has its own design

This is the part most often skipped, and it decides whether any of the above
reaches anyone.

**6.1 Two registers, and you need both.**
Structure – frontmatter, tables, schemas – carries **what exists** and makes
retrieval and checking possible. Prose carries **what it means** and why it was
decided that way. Strip the prose for parseability and you delete the intent;
keep only prose and nothing can be verified. Neither register alone is a design
system.

**6.2 Intent travels as narrative.**
The most behaviour-changing thing you can write is not a rule. It is a rule with
its failure attached: what was believed, what was done, what broke, what the rule
is now. Rules alone get reasoned around at the exact moment they are
inconvenient. Rules with a scar do not.

**6.3 Exactly one entry point should require no searching.**
Whatever a reader loads automatically – a root instruction file, a README – is the
only document guaranteed to be read. Everything else depends on being found from
there. Treat it as an index that earns its place, not a dumping ground.

**6.4 Unreachable is the same as unwritten.**
A document on an unpushed branch, in a private repo, or outside the published
package does not exist for the reader who needs it. Reach is a property of the
documentation, not an accident of workflow.
*Check: for each audience, list what they can actually open. Anything not on that
list cannot be relied on.*

**6.5 Freshness has to be provable.**
Hand-copied values in a spec are the most authoritative-looking and least
trustworthy content you can write. If a document restates something generated
elsewhere, something must fail when the two disagree.

**6.6 One file per thing, cross-linked.**
A contract buried in a table cell can be read but not diffed, not verified, not
linked to, and not retrieved on its own. One file per component, pattern and
template – each naming its dependencies – lets a reader pull the chain they need
instead of loading the system. It also keeps files small enough that someone will
maintain them.

**6.7 Registries make the set navigable.**
An index per layer, pointing at the individual specs, is what turns a folder into
something that can be walked without being read whole.

**6.8 Name what would prove each claim wrong.**
A spec that asserts a component's states, variants or tokens should point at what
verifies it. Without an anchor, a spec is an opinion with a timestamp.

**6.9 Mark what is *not* decided.**
An explicit "draft, not adopted" or "problem space only" banner is machine-
readable in the way that matters: it stops a reader – human or otherwise – from
hardening a proposal into a rule. Systems that only ever state conclusions get
their open questions quietly closed by whoever reads them next.

**6.10 State the system's boundary, not only its contents.**
Say what ships, to whom, and what is internal. A system that cannot say where it
ends cannot tell anyone what they are allowed to rely on.

---

## Sequencing, because order is a design decision

1. **Settle the vocabulary before writing anything on top of it.** Specs written
   against names that are under review bake in the thing being reviewed. Twenty
   documents are far harder to un-bake than one.
2. **Run a diagnostic before proposing a structure.** Walk the tree, record what
   decision each token holds, and let the evidence choose. A solution written
   down early anchors everyone to whoever wrote it first.
3. **Change by remapping, not by extending.** Foundations should be stable.
   Widening or re-cutting a semantic layer onto primitives that already exist is
   non-destructive; adding new primitives to solve a semantic problem is not.
4. **Composition can start immediately.** Patterns and templates describe
   structure and behaviour, not token names, so they are not blocked by a naming
   review – and they are usually the biggest gap.
5. **Add the check in the same change as the rule.** A rule shipped without
   enforcement is a rule with a start date and no end date.

## Where the rules stop

Not everything should become machine-readable, and pretending otherwise costs
trust.

Some things are genuinely judgement. Spacing rhythm is the clearest example: the
scales and their ratios are fact and can be relied on, but *which* rung to spend
at a given moment depends on what the background, borders and type are already
doing. Two screens can use different values for the same structural level and
both be right. What stays constant is the ordering, never the numbers.

A system honest about where its rules end is more trustworthy than one that
pretends they do not. Write the mechanical part down, enforce it, and mark the
rest as judgement rather than dressing it up as law.

## The part that will outlast the formats

Underneath all of this is something older than any of the tooling. Spacing works
because things placed closer together are read as belonging together, before a
single word is read. Hierarchy is perceived, not declared. Tokens are simply the
notation in which those decisions get written, and a scale exists so the notation
has distinguishable symbols.

Formats will change. Whatever replaces today's file conventions will still need
names that record decisions, checks that keep them honest, and a written account
of what the design tool could never say. That is the durable part, and it is
worth building for on its own terms – the fact that it also makes a system legible
to a machine is the consequence, not the reason.
