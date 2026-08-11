# Spacing rhythm

> ⚠️ **DRAFT — NOT ADOPTED. Do not treat the rules below as system law.**
> Thomas, 2026-08-07: *"I'm not ready to committing to the rules just yet. You
> got me further than ever but it is not there yet."*
> The **scales and the ratio analysis are facts** and can be relied on. The
> **three rules and the closing formulation are a proposal** — one attempt at
> describing something he does by eye, not a description he has recognised as
> correct. See the open questions in [backlog.md](./backlog.md).

Why the layout scale has the shape it does, and an attempt at how to sequence it.

Written 2026-08-07 from Thomas's description of what he was already doing by eye
— *"I always try to establish a rhythm to the design where I use different
spacings in a sequence that to me is hard to put into rules."* This is an attempt
to put the mechanical part into rules and be honest about the part that stays
judgement.

## The two scales

There are two, and they are shaped differently on purpose.

| | 
|---|
| **`semantic/layout/*`** — space **between** things |

| token | value | ratio to previous |
|---|---|---|
| xxsmall | 4px | — |
| xsmall | 8px | ×2.00 |
| small | 16px | ×2.00 |
| medium | 24px | ×1.50 |
| large | 40px | ×1.67 |
| xlarge | 64px | ×1.60 |
| xxlarge | 104px | ×1.63 |

| | 
|---|
| **`semantic/components/*`** — space **inside** one thing |

| token | value | ratio to previous |
|---|---|---|
| xxsmall | 2px | — |
| xsmall | 4px | ×2.00 |
| small | 8px | ×2.00 |
| medium | 12px | ×1.50 |
| large | 16px | ×1.33 |
| xlarge | 24px | ×1.50 |
| xxlarge | 32px | ×1.33 |

## Why layout is Fibonacci

From 8 upward, each layout step is the sum of the two before it — 8, 16, 24, 40,
64, 104. Fibonacci converges on the golden ratio, so past the first step the
scale is effectively geometric at **≈1.6**, and the table above shows it holding
between 1.50 and 1.67 all the way to 104.

**That constant ratio is the whole point, and it is a fact about perception, not
taste.** Perceived magnitude is ratio-based, not additive (Weber's law): a step
registers as different when it is a consistent *proportion* larger, not a
consistent number of pixels larger. A linear scale — 8, 12, 16, 20, 24 — has
ratios 1.50, 1.33, 1.25, 1.20, falling as it climbs, so the top of the scale
turns to mush and 20 vs 24 reads as "about the same". This scale stays evenly
legible from 8 to 104, which is what lets a reader tell one level of grouping
from another without consciously measuring anything.

**`xxsmall` (4px) is deliberately outside the sequence** — 4, 8, 16 is not
Fibonacci. Treat it as a half-step below the ladder proper, for hairline
separations where a real gap would be too much.

## Why components are NOT Fibonacci

The component scale decelerates at the top – ×1.5 / ×1.33 / ×1.25
(12, 16, 24, 32, 40) – rather than holding ≈1.6. That is correct and should stay: inside a single object,
distances are read at close range and against each other, so fine control matters
more than dramatic separation. A 16 vs 24 padding difference inside a button is
legible precisely because you are looking at one button.

**The scales must not mix.** A component-scale value appearing in a layout
position is the single most common cause of a design feeling muddy — it puts a
gap on the page that is *nearly* one of the layout steps but not one of them, so
the eye cannot place which level of grouping it means.

## The rules

Three that hold mechanically, in the order they are worth checking.

### 1. Outer beats inner

**The gap separating two things must exceed the largest gap inside either of
them.** A card with 16 of internal padding needs more than 16 between cards.

This is the workhorse. It generates the whole hierarchy automatically, needs no
taste, and can be checked by a machine. It is also the one that catches real
bugs: on 2026-08-07 the Prep+Eat shopping list had a category heading with 16
above it and 8 below, so the heading was *closer to the previous group's card
than to the rows it labelled*. Nothing about that is subtle once stated, and it
had shipped for weeks.

### 2. One rung per level

**Going up one level of grouping moves one step up the ladder.** Skipping a rung
(16 → 40) is a much louder statement: reserve it for a genuine section break, not
a nested group. Consistent single steps are what make the levels countable.

### 3. Layout spacing for layout, component spacing for components

See above. If a number feels almost right but not quite, check which scale it
came from before adjusting it.

## Where the rules stop

**Rule 1 relaxes when another cue already carries the grouping.** On the same
shopping list, a category heading ended up with 16 above *and* 16 below — equal,
which by rule 1 alone is ambiguous about which card the heading belongs to. It
reads correctly anyway, because the rows sit on a white card and the heading does
not: the card boundary states the grouping, so the spacing does not have to.

That is the genuinely irreducible part, and it is worth naming clearly because it
is where the rules run out:

> **You are not sequencing spacings in isolation. You are spending the minimum
> spacing needed, given what the background, borders and type are already
> saying.**

So the sequence is not a fixed pattern to memorise. Two screens can use different
rungs for the same structural level and both be right, if one of them is doing
more of the work with surfaces and the other with space. What must stay constant
is the *ordering* — deeper relationship, smaller gap — never the exact values.

## The underlying principle

All of this is Gestalt **proximity**: things closer together are read as
belonging together, before a single word is read. Spacing is therefore not
decoration between elements — it is the notation in which hierarchy is written.
The ladder exists so that notation has distinguishable symbols.
