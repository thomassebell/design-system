# @sebellds/tokens

Design tokens for the Sebell Design System – the single source of truth for
colour, typography, spacing and radius, generated from Figma.

Ships one CSS file per **brand × density** combination, plus a
Tailwind/NativeWind theme fragment per brand for React Native apps that can't
read CSS variables, plus the resolved token tree as JSON.

**See it running: [storybook.sebell.dk](https://storybook.sebell.dk)** – every
component in every brand and density, with a live switcher. The fastest way to
see what a token actually does.

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

## The brands

Four brands ship, and they are not equivalent. Two are real, two exist to keep
the system honest.

| Brand | What it is |
|---|---|
| `sebell` | **Production.** The design system's own brand, used for real apps and websites. It is the default everywhere – first in the brand list, the combo fed to the iOS output, and Storybook's initial view. |
| `prep-eat` | **Production.** The brand of Prep+Eat, a shipped food app built on this system. Being React Native, it consumes these tokens but not the React components. |
| `brand-a` | **Test fixture.** A generic primary-blue exemplar. It exists to exercise the multi-brand pipeline. |
| `brand-b` | **Test fixture.** Diverges from Brand A on every axis – green primary, two typefaces, soft radii – so cross-brand consistency checks have something real to compare. |

The fixtures ship on purpose. They are what proves a third-party brand can be
added without the pipeline quietly assuming Sebell's values.

`brands.config.js` is exported if you want to enumerate the matrix
programmatically:

```js
import { BRANDS, DENSITIES, DEFAULT_BRAND } from "@sebellds/tokens/brands.config.js";
```

## Densities

Two densities, `default` and `compact`, are separate stylesheets rather than a
runtime switch. Pick one at import time, or load both under different selectors
if you need to switch.

They are not a uniform scale-down:

- **`--semantic-components-*`** – spacing **inside a single component**, its own
  padding and internal gaps. Fully scales with density: `components.medium` is
  12px at default and 8px at compact.
- **`--semantic-layout-*`** – spacing **between composed elements**, when
  something's job is to arrange other standalone widgets. Only the large end
  compresses. `layout.xxsmall` / `xsmall` / `small` / `medium` are 4 / 8 / 16 /
  24px in *both* densities; `large` and up shrink in compact.

Picking between the two scopes is a system rule, not taste. The test: *is this
spacing within one widget, or between widgets being arranged?* A button's own
padding is internal, so `components.*`. A row of buttons is composition, so
`layout.*`.

The density-invariant small steps of `layout.*` exist for a reason: the focus
ring is fixed at 4px reach and is itself density-invariant, so any gap next to a
focusable control has to clear it in both densities.

## Appearance modes

Each sheet carries a light and a dark appearance, scoped by a `data-surface`
attribute:

```html
<body>
  <!-- light by default -->
  <section data-surface="dark" style="background: var(--color-surface-primary-darkest)">
    <!-- foreground tokens have flipped in here -->
  </section>
</body>
```

The sheet defines the light values under `:root, [data-surface="light"]` and the
dark values under `[data-surface="dark"]`, so the two nest in either direction –
a light island inside a dark section works.

**Only the appearance layer flips.** That is 99 foreground tokens, defined as
the same set in both modes: `--text-*`, `--icon-*`, `--border-*`, and the
per-component recipes `--button-*`, `--chip-*`, `--forms-*`, `--tab-bar-*`. The
brand semantic palette – every `--color-*` token – does **not** flip. It is the
same ramp in both modes.

The practical consequence: use `--text-default` and `--border-default` for
foregrounds you want to adapt, and `--color-*` when you want a specific brand
colour to stay put. Nothing sets a background for you; painting the surface is
your call, which is why the example above sets one explicitly.

If you use `@sebellds/react`, its `<Surface surface="dark">` component sets this
attribute for you.

## The three output formats

The same resolved token tree, emitted three ways.

| Format | File | For |
|---|---|---|
| CSS custom properties | `dist/<brand>-<density>.css` | Web. Both densities, both appearance modes. |
| Tailwind theme fragment | `dist/<brand>-theme.cjs` | React Native (Expo + NativeWind), and any Tailwind setup. **Light appearance only in v1**, generated from `<brand> × default`. |
| Resolved JSON | `dist/tokens.json` | Everything else. This is the tree the iOS Swift package is generated from. |

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

## Token layers

Tokens resolve in a cascade, and which layer you consume matters:

```
foundation primitives  →  brand semantics  →  density + appearance
```

`--primitive-*` variables are present in the sheets because the semantic layer
resolves against them. **Do not consume them directly.** A primitive is one
brand's raw palette value; reading it opts you out of brand switching. Use the
semantic layer – `--color-*`, `--text-*`, `--semantic-*`, `--radius-*`,
`--typography-*` – which is what makes a component work across all four brands
and both densities without changing.

Files under `dist/` are generated. Don't edit them; token values come from
Figma.

## How this system is kept honest

These are build failures, not conventions:

- **Cross-brand structural parity.** Every brand must define the same set of
  semantic token keys. A missing key, a retyped key, or an alias pointing at
  another brand's foundation fails the token build. A brand cannot quietly drift
  out of the contract, which is what makes the fixture brands useful.
- **Semantic-only consumption in components.** In `@sebellds/react`, a stylelint
  rule fails the build on any raw colour, any `var(--primitive-…)` reference, and
  any raw `px` / `rem` / `em` on padding, margin, gap, radius or font-size.
- **The published tarballs are tested outside the monorepo.** CI packs both
  packages, installs them into a scratch project and imports them as a real app
  would.

## Licence

MIT.
