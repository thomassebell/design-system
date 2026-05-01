module.exports = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(ts|tsx)",
    "../src/**/*.stories.@(ts|tsx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
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
