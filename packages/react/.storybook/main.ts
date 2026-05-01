import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(ts|tsx)",
    "../src/**/*.stories.@(ts|tsx)",
  ],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@chromatic-com/storybook",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: [
    { from: ".", to: "/" },
    // Serve the built tokens output so the brand/density toggle can
    // <link rel="stylesheet" href="/tokens/brand-x-density.css"> at runtime.
    { from: "../../tokens/dist", to: "/tokens" },
  ],
};

export default config;
