# `brand/` — design system spec

This folder is the canonical brand spec for the Sebell Design System, written in [DESIGN.md](https://github.com/google-labs-code/design.md) format (Google Labs, alpha). It complements the code in `packages/` by describing **what** the system is and **why** each decision exists.

## Where to start

- **New to the project?** Read [`core.design.md`](./core.design.md) first. It's the brand-agnostic spec: token shape, component contracts, the build pipeline at a glance, and the runbook for adding a brand.
- **Working on the Sebell brand?** Read [`brands/sebell.design.md`](./brands/sebell.design.md). It's the production brand — wood-species palette, Noto Serif + Noto Sans, "square or full" radius identity.
- **Adding a new brand?** Follow the runbook at the bottom of [`core.design.md`](./core.design.md). Copy [`_template.brand.design.md`](./_template.brand.design.md) as your starting point.
- **Just need to understand what Brand A or Brand B are for?** They're test fixtures, not real brands. Their DESIGN.md files explain why they exist.

## Folder shape

```
brand/
├── README.md                    ← you are here
├── core.design.md               ← shared system spec (token shape, components, runbook)
├── _template.brand.design.md    ← copy-paste skeleton for new brands
└── brands/
    ├── sebell.design.md         ← production brand
    ├── brand-a.design.md        ← test fixture
    └── brand-b.design.md        ← test fixture
```

## Conventions

- **One brand = one file.** Brand files are self-contained for token values — the alpha DESIGN.md spec doesn't define multi-file merge, so we don't try to use it. `core.design.md` defines shape; brand files define values.
- **Resolved values, not aliases.** Brand-file YAML lists the hex/px values that `dist/<brand>-default.css` actually emits, so the docs and the build can't drift. When you re-export tokens from Figma, update both the JSON and the brand file's YAML in the same commit.
- **Pending work goes at the bottom.** Sebell's file has a "Pending work" section that lists known stopgaps (e.g. warning/info palette aliases that still need a proper Figma fix). Keep this section current.

## Source of truth

This folder is the **specification**, not the source. Token values originate in Figma:

| Layer | Lives in | Becomes |
|-------|----------|---------|
| Foundation primitives | Figma `<brand>-foundation` collection | `packages/tokens/figma-exports/<brand>-foundation.tokens.json` |
| Brand semantics | Figma main DS file, brand mode | `packages/tokens/figma-exports/<brand>.tokens.json` |
| Resolved values | `npm run tokens:build` | `packages/tokens/dist/<brand>-<density>.css` |
| iOS values | `packages/tokens/transforms/generate-swift.mjs` | `packages/ios-tokens/output/DesignTokens.swift` |

Edit in Figma → re-export → `npm run tokens:build` → update the relevant brand DESIGN.md file.
