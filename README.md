# Design System

A cross-platform design system powering **React** (web) and **iOS** (SwiftUI) from a single source of truth.

```
design-system/
├── packages/
│   ├── tokens/          ← Design tokens (JSON → CSS + Swift)
│   ├── react/           ← React component library + Storybook
│   ├── ios-tokens/      ← Swift Package consuming generated tokens
│   └── docs/            ← Documentation site
├── .github/workflows/   ← CI pipeline
├── turbo.json           ← Turborepo pipeline config
└── package.json         ← Workspace root
```

## Quick start

```bash
# Install everything
npm install

# Build tokens (CSS variables + Swift constants)
npm run tokens:build

# Launch Storybook to develop components
npm run storybook

# Build all packages
npm run build
```

## Packages

| Package | Description |
|---------|-------------|
| `@ds/tokens` | Design tokens defined in JSON, transformed via Style Dictionary into CSS custom properties and Swift constants. |
| `@ds/react` | React component library (Button, Text, Stack, Input, Icon) with CSS Modules consuming token variables. |
| `ios-tokens` | Swift Package that exposes `DesignTokens.swift` for iOS / SwiftUI. |
| `@ds/docs` | Documentation site (token reference, component guidelines, contribution guide). |

## How tokens flow

```
JSON source files (packages/tokens/src/)
        │
        ▼
   Style Dictionary
        │
   ┌────┴─────┐
   ▼          ▼
tokens.css   tokens.json
(web)           │
                ▼
         generate-swift.mjs
                │
                ▼
        DesignTokens.swift
             (iOS)
```

## Adding a component

See [Contributing Guide](packages/docs/src/contributing.md).

## Architecture decisions

- **Tokens are the contract.** Both platforms consume the same semantic names.
- **CSS Modules over CSS-in-JS.** Zero runtime cost, good DX with TypeScript.
- **forwardRef everywhere.** Consumers can always attach refs.
- **Accessibility first.** ARIA attributes, keyboard navigation, focus management baked in.
