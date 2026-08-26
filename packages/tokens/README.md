# @sebellds/tokens

Design tokens for the Sebell Design System – the single source of truth for
colour, typography, spacing and radius, generated from Figma.

Ships one CSS file per **brand × density** combination, plus a
Tailwind/NativeWind theme fragment per brand for React Native apps that can't
read CSS variables, plus the resolved token tree as JSON.

## Documentation

**[storybook.sebell.dk](https://storybook.sebell.dk)** has a live token catalog –
every colour, type step, spacing step and radius as currently built, in every
brand and density. Its **Architecture** guide explains the token layers, how the
brand and density axes compose, and the build-time checks in depth.

This file covers what you need to consume the package.

## Install

```bash
npm install @sebellds/tokens
```

## Use

Import one stylesheet for the brand and density you want:

```ts
import "@sebellds/tokens/dist/sebell-default.css";
```

Every token is a CSS custom property:

```css
.myThing {
  background: var(--color-surface-primary-main);
  color: var(--text-inverse);
  padding: var(--semantic-layout-medium);
  border-radius: var(--radius-medium);
}
```

Available sheets are `<brand>-<density>.css` – eight in total, from four brands
× two densities.

**Consume the semantic layer, not `--primitive-*`.** Primitives appear in the
sheets because the semantic layer resolves against them, but a primitive is one
brand's raw palette value; reading it directly opts you out of brand switching.

## The brands

Four brands ship, and they are not equivalent. Two are real, two exist to keep
the system honest.

| Brand | What it is |
|---|---|
| `sebell` | **Production.** The design system's own brand, used for real apps and websites. The default everywhere: first in the brand list, the combo fed to the iOS output, and Storybook's initial view. |
| `prep-eat` | **Production.** The brand of Prep+Eat, a shipped food app built on this system. Being React Native, it consumes these tokens but not the React components. |
| `brand-a` | **Test fixture.** A generic primary-blue exemplar, single typeface. Exists to exercise the multi-brand pipeline. |
| `brand-b` | **Test fixture.** Diverges from Brand A on every axis – green primary, two typefaces, soft radii – so cross-brand consistency checks have something real to compare. |

The fixtures ship on purpose: they are what proves a third-party brand can be
added without the pipeline quietly assuming Sebell's values. Don't mine them for
design inspiration – they are calibration tools, not real brands.

To enumerate the matrix programmatically:

```js
import { BRANDS, DENSITIES, DEFAULT_BRAND } from "@sebellds/tokens/brands.config.js";
```

## Densities

`default` and `compact` are separate stylesheets rather than a runtime switch.
Most apps pick one at build time.

They are not a uniform scale-down, and the two spacing scopes are the reason:

- **`--semantic-components-*`** – spacing **inside a single component**, its own
  padding and internal gaps. Fully scales: `components.medium` is 12px at
  default, 8px at compact.
- **`--semantic-layout-*`** – spacing **between composed elements**, when
  something's job is to arrange other standalone widgets. Only the large end
  compresses: `layout.xxsmall` / `xsmall` / `small` / `medium` are 4 / 8 / 16 /
  24px in *both* densities.

Picking between them is a system rule, not taste. The test: *is this spacing
within one widget, or between widgets being arranged?*

The density-invariant small steps exist for a reason – the focus ring is fixed
at 4px reach and is itself density-invariant, so any gap next to a focusable
control has to clear it in both densities.

## Appearance modes

Each sheet carries a light and a dark appearance, scoped by `data-surface`:

```html
<section data-surface="dark" style="background: var(--color-surface-primary-darkest)">
  <!-- foreground tokens have flipped in here -->
</section>
```

Light values are defined under `:root, [data-surface="light"]` and dark values
under `[data-surface="dark"]`, so the two nest in either direction – a light
island inside a dark section works.

**Only the appearance layer flips.** That is 99 foreground tokens, the same set
in both modes: `--text-*`, `--icon-*`, `--border-*`, and the per-component
recipes `--button-*`, `--chip-*`, `--forms-*`, `--tab-bar-*`. The brand semantic
palette – every `--color-*` token – does **not** flip; it is the same ramp in
both modes.

So: use `--text-default` and `--border-default` for foregrounds you want to
adapt, and `--color-*` when you want a brand colour to stay put. Nothing sets a
background for you, which is why the example above sets one explicitly.

If you use `@sebellds/react`, its `<Surface surface="dark">` sets the attribute
for you.

## The three output formats

The same resolved token tree, emitted three ways.

| Format | File | For |
|---|---|---|
| CSS custom properties | `dist/<brand>-<density>.css` | Web. Both densities, both appearance modes. |
| Tailwind theme fragment | `dist/<brand>-theme.cjs` | React Native (Expo + NativeWind), and any Tailwind setup. **Light appearance only in v1**, generated from `<brand> × default`. |
| Resolved JSON | `dist/tokens.json` | Everything else. The tree the iOS Swift package is generated from. |

For React Native, spread the fragment into your Tailwind theme:

```js
// tailwind.config.js
const sebell = require("@sebellds/tokens/dist/sebell-theme.cjs");

module.exports = {
  presets: [require("nativewind/preset")],
  theme: { extend: { ...sebell } },
};
```

`dist/tokens.json` is the first brand × first density combo (`sebell × default`)
with every alias resolved. iOS consumes it through a generated Swift package
that lives in the design system repository rather than on npm; if you are
targeting another platform, this JSON is the file to generate from.

## How this system is kept honest

Build failures, not conventions:

- **Cross-brand structural parity.** Every brand must define the same semantic
  token keys. A missing key, a retyped key, or an alias pointing at another
  brand's foundation fails the token build – which is what makes the fixture
  brands useful.
- **Semantic-only consumption in components.** In `@sebellds/react`, a stylelint
  rule fails the build on any raw colour, any `var(--primitive-…)` reference, and
  any raw `px` / `rem` / `em` on padding, margin, gap, radius or font-size.
- **Consumer installs are verified.** CI packs both packages, installs them into
  a scratch project and imports them as a real app would.

Files under `dist/` are generated. Don't edit them; token values come from
Figma.

## Licence

MIT.
