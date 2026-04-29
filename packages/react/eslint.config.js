// ESLint flat config for @ds/react.
// Lints components and Storybook stories with sensible defaults
// for React + TypeScript. Run with `npm run lint`.

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import storybook from "eslint-plugin-storybook";
import globals from "globals";

export default [
  // What we never lint.
  {
    ignores: ["dist/**", "storybook-static/**", "node_modules/**"],
  },

  // Base JS recommended rules.
  js.configs.recommended,

  // TypeScript recommended rules (untyped — fast, no project parsing).
  ...tseslint.configs.recommended,

  // App + library source code.
  {
    files: ["src/**/*.{ts,tsx}", "stories/**/*.{ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // We use TypeScript for prop types; PropTypes is redundant.
      "react/prop-types": "off",

      // The new JSX transform doesn't require React in scope.
      "react/react-in-jsx-scope": "off",
    },
  },

  // Storybook-specific rules for story files.
  ...storybook.configs["flat/recommended"],
];
