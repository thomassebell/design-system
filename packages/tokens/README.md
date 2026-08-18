# @sebellds/tokens

Design tokens for the Sebell Design System – the single source of truth for
colour, typography, spacing and radius, generated from Figma.

Ships one CSS file per **brand × density** combination, plus a Tailwind/NativeWind
theme fragment per brand for React Native apps that can't read CSS variables.

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
  padding: var(--semantic-layout-medium);
  border-radius: var(--semantic-radius-medium);
}
```

Available sheets: `<brand>-<density>.css` where brand is `sebell`, `brand-a`,
`brand-b` or `prep-eat`, and density is `default` or `compact`.

For React Native (Expo + NativeWind), use the theme fragment instead:

```js
const sebell = require("@sebellds/tokens/dist/sebell-theme.cjs");
```

Light appearance only in v1.

## Notes

Token values come from Figma. Files under `dist/` are generated – don't edit them.

Part of the [Sebell Design System](https://github.com/thomassebell/design-system).
