# @sebellds/react

React component library for the Sebell Design System.

Components consume semantic design tokens, so brand switching and density
switching work without touching component code.

## Documentation

**[storybook.sebell.dk](https://storybook.sebell.dk)** is the reference. Every
component, variant and state, with a live brand and density switcher, plus
written guides:

- **Using Components** – install, stylesheets, runtime brand switching,
  app-specific overrides, accessibility, TypeScript.
- **Architecture** – the token layers, how brand × density works, the
  build-time checks.
- **Adding a Component** and **Updating from Figma** – for contributors.

This file is the front door: enough to install, render something, and know the
rules that are easy to get wrong. Everything else is in Storybook.

## Install

```bash
npm install @sebellds/react
```

`@sebellds/tokens` comes along as a dependency. `react` and `react-dom` are peer
dependencies (>=18).

**This is a web package.** It renders DOM and imports CSS, so it cannot be used
in React Native. React Native apps can still consume `@sebellds/tokens`.

## Use

Import two stylesheets once, in your app's entry point – the brand's token
variables first, then the component styles:

```ts
import "@sebellds/tokens/dist/sebell-default.css"; // pick your brand × density
import "@sebellds/react/styles.css";
```

Order matters. The component styles reference variables the token sheet defines;
without the token sheet, components render unstyled.

```tsx
import { Button, Stack } from "@sebellds/react";

<Stack gap="medium" direction="row">
  <Button variant="outline">Cancel</Button>
  <Button variant="solid">Continue</Button>
</Stack>;
```

## What's in the box

18 components. Props are fully typed – hover them in your editor, or see
Storybook for every variant and state.

| Group | Components |
|---|---|
| Actions | `Button`, `IconButton`, `Chip` |
| Forms | `Input`, `Checkbox`, `CheckboxField`, `CheckboxGroup`, `Radio`, `RadioField`, `RadioGroup`, `Switch`, `SwitchField` |
| Navigation | `TabBar`, `TabBarButton` |
| Content | `Text`, `Icon` |
| Layout | `Stack`, `Surface` |

The `*Field` wrappers add a label, hint and error to a bare control and wire up
the accessibility; the `*Group` wrappers put a `fieldset` and `legend` around
several fields. Reach for the bare `Checkbox` / `Radio` / `Switch` only when you
are building your own layout around it.

`Button` and `IconButton` are polymorphic: `as="a"` renders an anchor and takes
`href`, because a call to action that navigates is a link, not a button. `Text`
and `Stack` take `as` too.

Two utilities ship alongside: `useSurface()` reads the nearest surface mode, and
`cx()` joins class names.

`Field` and `FieldGroup` exist in the source but are **internal primitives** –
not exported. Use the `*Field` and `*Group` components above. `Alert` is in the
source and deliberately **not exported yet**; don't rely on it appearing.

## The rules that are easy to get wrong

Storybook documents what every component does. These four are about how to use
them well, and they are the ones people trip on.

### 1. Two spacing scopes, and the choice is a rule

| Scope | Use for |
|---|---|
| `--semantic-components-*` | Spacing **inside a single atomic component** – its own padding and internal gaps. |
| `--semantic-layout-*` | Spacing **between composed elements** – when something's job is to arrange other standalone widgets. |

The test: *is this spacing within one widget, or between widgets being
arranged?* A button's own padding is internal, so `components.*`. A row of
buttons is composition, so `layout.*`.

They behave differently under density. `components.*` fully scales – 12px at
default, 8px at compact. `layout.*` compresses only at the large end: `xxsmall`
/ `xsmall` / `small` / `medium` are 4 / 8 / 16 / 24px in *both* densities.
`Stack`'s `gap` maps to `--semantic-layout-*`, which is why `Stack` is the right
tool for arranging things and the wrong tool for padding one thing.

### 2. `style` and `className` are not the theming API

Every component spreads remaining props onto its root element, so both are
inherited from the DOM props. They are escape hatches. Hardcoding a colour or a
pixel value in `style` opts that element out of brand and density switching,
which is the entire point of the system. Use the component's own props, `Stack`
for gaps, and `var(--…)` tokens in your own CSS.

### 3. `Surface` flips foregrounds, not backgrounds

`Surface` sets `data-surface`, and the token CSS flips the foreground tokens –
text, icon, border, button, chip, form and tab-bar colours – for everything
inside. It nests either way, so a light island inside a dark section works.

**It has no `background` prop today.** Paint the background yourself:

```tsx
<Surface surface="dark" style={{ background: "var(--color-surface-primary-darkest)" }}>
  <Text>Foreground colours have flipped.</Text>
</Surface>
```

### 4. Components are single-size

No component takes a `size` prop – `Icon` is the one exception. Tighter UI comes
from the density stylesheet, not from a per-instance size.

## A worked example

Composition: `Surface` for appearance, `Stack` for arrangement, the field
components for the form.

```tsx
import {
  Button,
  CheckboxField,
  CheckboxGroup,
  Input,
  Stack,
  Surface,
  SwitchField,
  Text,
} from "@sebellds/react";

export function NotificationSettings() {
  return (
    <Surface
      surface="light"
      style={{
        background: "var(--color-surface-neutral-white)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-medium)",
        padding: "var(--semantic-layout-medium)",
      }}
    >
      <Stack gap="medium">
        <Text variant="display6" as="h2">Notifications</Text>

        <Input
          label="Email address"
          type="email"
          hint="We only use this for the alerts you pick below."
        />

        <CheckboxGroup legend="Email me about">
          <CheckboxField label="Security alerts" defaultChecked />
          <CheckboxField label="Weekly summary" hint="Sent every Monday." />
        </CheckboxGroup>

        <SwitchField label="Push notifications" hint="Requires the mobile app." />

        <Stack direction="row" gap="xsmall" justify="end">
          <Button variant="outline">Cancel</Button>
          <Button variant="solid">Save changes</Button>
        </Stack>
      </Stack>
    </Surface>
  );
}
```

No hex colours, and no raw pixel values for spacing, radius or type. The card's
own padding is a `layout` token because the card arranges widgets; gaps come
from `Stack`. The one literal is the `1px` border width, and that is deliberate:
the system has no border-width token, so there is nothing to reference.

## How this system is kept honest

Build failures, not conventions:

- **Components consume semantic tokens only.** A stylelint rule fails the build
  on any raw colour, any `var(--primitive-…)` reference, and any raw `px` /
  `rem` / `em` on padding, margin, gap, radius or font-size.
- **Cross-brand structural parity.** Every brand must define the same semantic
  token keys; a missing or retyped key fails the token build.
- **Consumer installs are verified.** CI packs both tarballs, installs them into
  a scratch project and imports them as a real app would.

The system is in production use: Prep+Eat is a shipped app built on it. Being
React Native, it consumes the tokens only, not these components.

## Licence

MIT.
