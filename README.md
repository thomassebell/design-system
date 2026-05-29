# Design System

A cross-platform design system powering **React** (web) and **iOS** (SwiftUI) from a single source of truth.

📐 **Architecture & CI at a glance:** [`docs/architecture.svg`](docs/architecture.svg) — the build pipeline plus every check and test that gates a change.

```
design-system/
├── packages/
│   ├── tokens/          ← Design tokens (JSON → CSS + Swift)
│   ├── react/           ← React component library + Storybook
│   ├── ios-tokens/      ← Swift Package consuming generated tokens
│   └── docs/            ← Documentation site
├── docs/                ← Repo-level docs (architecture diagram)
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

## Brand structure

This is a multi-brand design system. The active brands are **Sebell** (production) and **Brand A / Brand B** (test fixtures that exercise the multi-brand pipeline). The brand spec — token shape, component contracts, and the runbook for adding a new brand — lives in [`brand/`](./brand/), written in the [DESIGN.md](https://github.com/google-labs-code/design.md) format.

Start with [`brand/core.design.md`](./brand/core.design.md) for the system-level contract, then read [`brand/brands/sebell.design.md`](./brand/brands/sebell.design.md) for the Sebell brand specifics.

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
