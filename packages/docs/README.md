# `@ds/docs`

This package is reserved for a future standalone documentation site (e.g.
Astro Starlight, Docusaurus). Right now it's intentionally empty.

**The actual design system docs live as MDX pages inside Storybook:**

- `packages/react/stories/docs/Welcome.mdx`
- `packages/react/stories/docs/Architecture.mdx`
- `packages/react/stories/docs/UpdatingFromFigma.mdx`
- `packages/react/stories/docs/AddingComponent.mdx`
- `packages/react/stories/docs/UsingComponents.mdx`

They render in Storybook's sidebar under "Introduction" and "Guides", co-located
with the live component and token references.

If we ever decide to spin up a standalone docs site (separate Vercel deploy,
different audience, fancier layouts, etc.), it would live here.
