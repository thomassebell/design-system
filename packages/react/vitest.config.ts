import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Tests assert against a DOM, so use jsdom rather than the default node env.
    environment: "jsdom",
    // Lets `expect`, `describe`, etc. be used without explicit imports.
    globals: true,
    // Loads jest-dom matchers (toBeInTheDocument, toHaveClass, etc.).
    setupFiles: ["./vitest.setup.ts"],
    // CSS Modules: keep the original class names instead of hashing them so
    // `expect(...).toHaveClass("solid")` works against the source class name.
    css: {
      modules: { classNameStrategy: "non-scoped" },
    },
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
