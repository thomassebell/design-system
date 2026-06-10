import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  external: ["react"],
  // Compile *.css with esbuild's local-css loader so CSS Modules produce
  // real scoped class names in BOTH dist/index.js and dist/index.css.
  // Without this, tsup falls back to the plain "css" loader and every
  // `import styles from "*.module.css"` compiles to an empty object –
  // components ship unstyled. Storybook/Vitest use Vite and never catch
  // it; the consumer smoke test (scripts/consumer-smoke-test.mjs) does.
  // Selectors that must stay un-scoped (e.g. .ds-visually-hidden in
  // globals.css) are wrapped in :global(...).
  loader: {
    ".css": "local-css",
  },
});
