# @sebellds/react

React component library for the Sebell Design System.

Components consume semantic design tokens, so brand switching and density
switching work without touching component code.

**Reference: [storybook.sebell.dk](https://storybook.sebell.dk)** – every
component, variant and state, with a live brand and density switcher. It is the
canonical documentation; this file is the summary.

## Install

```bash
npm install @sebellds/react
```

`@sebellds/tokens` comes along as a dependency. `react` and `react-dom` are peer
dependencies (>=18).

**This is a web package.** It renders DOM and imports CSS, so it cannot be used
in React Native. React Native apps can still consume `@sebellds/tokens` – see
that package's NativeWind theme fragments.

## Use

Import two stylesheets once, in your app's entry point – the brand's token
variables first, then the component styles:

```ts
import "@sebellds/tokens/dist/sebell-default.css"; // pick your brand × density
import "@sebellds/react/styles.css";
```

Order matters. The component styles reference variables the token sheet defines;
without the token sheet, components render unstyled.

Then:

```tsx
import { Button, Stack } from "@sebellds/react";

<Stack gap="medium" direction="row">
  <Button variant="outline">Cancel</Button>
  <Button variant="solid">Continue</Button>
</Stack>;
```

## Components

18 components are exported. Everything below is in the published bundle.

| Component | Notes |
|---|---|
| `Button` | `variant`: `solid` \| `outline` \| `danger` \| `text`. Also `startIcon`, `endIcon`, `fullWidth`, `loading`, `disabled`. Polymorphic via `as` – see below. |
| `IconButton` | Icon-only button. `icon` and `label` are required – `label` becomes the `aria-label`. `variant`: `solid` \| `outline` \| `danger`. Polymorphic via `as`. |
| `Input` | Text field with `label`, `hint`, `error`, `startIcon`, `endIcon`, `prefix`, `suffix`. |
| `Checkbox` | Bare control. Adds `indeterminate` to the native input props. |
| `CheckboxField` | `Checkbox` plus `label`, `hint`, `error`, wired up for accessibility. |
| `CheckboxGroup` | `fieldset` + `legend` around several fields. Takes `legend`, `description`, `error`. |
| `Radio` | Bare control. |
| `RadioField` | `Radio` plus `label`, `hint`, `error`. |
| `RadioGroup` | Renders a whole group from an `options` array. Takes `legend`, `name`, `options`, `value`, `onChange`. |
| `Switch` | `<input type="checkbox" role="switch">`. |
| `SwitchField` | `Switch` plus `label`, `hint`, `error`. |
| `TabBar` | Bottom navigation chrome – a `<nav>` landmark. Takes `aria-label`. |
| `TabBarButton` | One tab. `icon` and `label` required, `active` marks the current page. |
| `Text` | `variant`: `display1`–`display6` \| `body` \| `bodySmall`. Also `weight`, `as`, `muted`, `truncate`, `align`. A variant is a type style only – it carries no element semantics, so set headings with `as`. |
| `Icon` | SVG wrapper. Pass `<path>` children. `size`: `sm` \| `md` \| `lg`. `label` makes it non-decorative. |
| `Chip` | Interactive filter/selection toggle (`aria-pressed`). `variant`: `solid` \| `outline`, plus `active`. |
| `Stack` | Layout primitive. `direction`, `gap`, `align`, `justify`, `wrap`, `as`. |
| `Surface` | Scopes a light or dark appearance to its subtree. See below. |

Two utilities ship alongside: `useSurface()` reads the nearest surface mode, and
`cx()` is the internal class-name joiner. Types are exported for every component
(`ButtonProps`, `ButtonVariant`, and so on).

`Field` and `FieldGroup` exist in the source but are **internal layout
primitives** – they are not exported from the package root. Use `CheckboxField`,
`RadioField`, `SwitchField`, `CheckboxGroup` and `RadioGroup` instead.

`Alert` also exists in the source and is deliberately **not exported yet** – the
component is unfinished. Do not rely on it appearing.

### `Button` and `IconButton` render any element

Both take an `as` prop. The style is the component's job, the element is yours –
a call to action that navigates should be an `<a>`, not a `<button>`. The
accepted props follow the element, so `as="a"` takes `href` and rejects `type`:

```tsx
<Button as="a" href="/pricing" variant="solid">
  See pricing
</Button>
```

`Text` and `Stack` take `as` for the same reason.

## Spacing: the rule that catches people out

The token layer splits spacing into two scopes, and picking between them is a
system rule rather than taste:

| Scope | Use for |
|---|---|
| `semantic.components.*` | Spacing **inside a single atomic component** – its own padding and internal gaps. |
| `semantic.layout.*` | Spacing **between composed elements** – when a component's job is to arrange other standalone widgets. |

The test: *is this spacing within one widget, or between widgets being
arranged?* A button's own padding is internal, so `components.*`. A row of
buttons is composition, so `layout.*`.

The two ramps are not the same length and do not behave the same way.
`components.*` runs `xxsmall` → `xxxlarge` and fully scales with density.
`layout.*` runs `xxsmall` → `xxlarge`, and its small steps are
density-invariant: `xxsmall` / `xsmall` / `small` / `medium` are 4 / 8 / 16 /
24px in both densities, and only `large` and up compress in compact.

In CSS the variables are `--semantic-components-*` and `--semantic-layout-*`.
`Stack`'s `gap` prop maps to `--semantic-layout-*`, which is why `Stack` is the
right tool for arranging things and the wrong tool for padding one thing.

## `style` and `className` are not the theming API

Every component spreads the remaining props onto its root element, so `style`
and `className` are inherited from the underlying DOM props. They are escape
hatches, not the intended way to space or theme anything.

Use tokens instead. Reach for `Stack` for gaps, the component's own props for
its variants and states, and `var(--semantic-…)` / `var(--color-…)` in your own
CSS when you need to style around a component. Hardcoding a colour or a pixel
value in `style` opts that element out of brand switching and density switching –
which is the entire point of the system.

## Surfaces and dark mode

`Surface` sets `data-surface` on a wrapper. The token CSS keys off it and flips
the foreground tokens – text, icon, border, button, chip, form and tab-bar
colours – for everything inside. It nests in either direction, so a light island
inside a dark section works.

```tsx
<Surface surface="dark" style={{ background: "var(--color-surface-primary-darkest)" }}>
  <Text>Foreground colours have flipped.</Text>
</Surface>
```

**`Surface` has no `background` prop today.** It adapts foregrounds and leaves
the background to you – paint it from a brand colour, as above. This is worth
knowing before you reach for the prop and find it missing.

## A worked example

A settings card, showing composition: `Surface` for appearance, `Stack` for
arrangement, field components for the form, and `Button` for the actions.

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
        <Stack gap="xxsmall">
          <Text variant="display6" as="h3">Notifications</Text>
          <Text variant="bodySmall" muted>
            Choose how we reach you about your account.
          </Text>
        </Stack>

        <Input
          label="Email address"
          type="email"
          defaultValue="thomas@example.com"
          hint="We only use this for the alerts you pick below."
        />

        <CheckboxGroup
          legend="Email me about"
          description="You can change this at any time."
        >
          <CheckboxField label="Security alerts" defaultChecked />
          <CheckboxField label="Product updates" />
          <CheckboxField
            label="Weekly summary"
            hint="Sent every Monday morning."
          />
        </CheckboxGroup>

        <SwitchField
          label="Push notifications"
          hint="Requires the mobile app."
        />

        <Stack direction="row" gap="xsmall" justify="end">
          <Button variant="outline">Cancel</Button>
          <Button variant="solid">Save changes</Button>
        </Stack>
      </Stack>
    </Surface>
  );
}
```

Note what the example does *not* do: no hex colours, and no raw pixel values for
spacing, radius or type. The card's own padding uses a layout token because the
card is arranging widgets. Gaps come from `Stack`. The inline `style` here does
the one job the components leave to the consumer – painting a background and a
border on a container.

The one literal is the `1px` border width, and that is deliberate: the system has
no border-width token, so there is nothing to reference. Inventing one that
merely equals `1px` today would be worse than the literal.

## How this system is kept honest

These are build-time guarantees, not conventions:

- **Components consume semantic tokens only.** A stylelint rule fails the build
  on any raw colour, any `var(--primitive-…)` reference, and any raw `px` / `rem`
  / `em` on padding, margin, gap, radius or font-size in component CSS.
- **Cross-brand structural parity is enforced.** Every brand must define the same
  set of semantic token keys; a missing or retyped key fails the token build. A
  brand cannot quietly drift out of the contract.
- **The published packages are tested outside the monorepo.** CI packs both
  tarballs, installs them into a scratch project and imports them like a real
  app, so exports maps and CSS Modules scoping are verified as a consumer sees
  them.

The system is in production use: Prep+Eat is a shipped app built on it, and one
of the four brands here. Being React Native, it consumes the tokens only, not
these components, for the reason given at the top of this file.

## Licence

MIT.
