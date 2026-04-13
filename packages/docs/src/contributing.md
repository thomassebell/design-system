# Contributing a Component

## Before you start

1. **Check if it already exists** — search Storybook and the component index.
2. **Open an RFC** — create a short proposal (see template below) so the team can align on the API before you write code.

## RFC Template

```
## Component: <Name>
### Problem
What user problem does this solve? Where is it needed?
### Proposed API
<Name prop1="value" prop2={true}>Children</Name>
### Variants / States
- List sizes, variants, disabled, loading, error, etc.
### Accessibility
- Keyboard interactions, ARIA roles, screen reader behavior.
### Open questions
- Anything you're unsure about.
```

## Component checklist

- [ ] Lives in `packages/react/src/components/<Name>/`
- [ ] Exports from barrel (`index.ts`)
- [ ] Uses design tokens via CSS custom properties — no hard-coded colors/sizes
- [ ] CSS Module co-located (`<Name>.module.css`)
- [ ] `forwardRef` with proper `displayName`
- [ ] TypeScript props interface exported
- [ ] Storybook story with controls for every prop
- [ ] Accessibility: keyboard nav, focus management, ARIA attributes
- [ ] iOS counterpart documented (even if not yet implemented)

## File structure

```
components/
  Button/
    Button.tsx            ← component
    Button.module.css     ← styles (tokens only)
    Button.test.tsx       ← unit tests
    index.ts              ← barrel export
stories/
  Button.stories.tsx      ← Storybook
```

## Naming conventions

- **Component files**: PascalCase (`Button.tsx`)
- **CSS modules**: PascalCase matching the component (`Button.module.css`)
- **Token usage**: always use `var(--token-name)` — never raw hex/px values
- **Props**: camelCase, boolean props prefixed with `is` / `has` only when ambiguous
