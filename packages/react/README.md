# @sebellds/react

React component library for the Sebell Design System.

Components consume semantic design tokens, so brand switching and density
switching work without touching component code.

## Install

```bash
npm install @sebellds/react
```

`@sebellds/tokens` comes along as a dependency. `react` and `react-dom` are peer
dependencies (>=18).

**This is a web package.** It renders DOM and imports CSS, so it cannot be used
in React Native.

## Use

Import two stylesheets once, in your app's entry point – the brand's token
variables first, then the component styles:

```ts
import "@sebellds/tokens/dist/sebell-default.css"; // pick your brand × density
import "@sebellds/react/styles.css";
```

Then:

```tsx
import { Button, Stack } from "@sebellds/react";

<Stack gap="medium" direction="row">
  <Button variant="outline">Cancel</Button>
  <Button variant="solid">Continue</Button>
</Stack>;
```

Without the token stylesheet, components render unstyled – the variables they
reference won't exist.

## Reference

Storybook documents every component, variant and state, and can switch brand and
density live: see the [design system repo](https://github.com/thomassebell/design-system).
