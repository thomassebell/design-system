const path = require("path");

module.exports = {
  stories: ["../stories/**/*.stories.@(ts|tsx)", "../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: [{ from: ".", to: "/" }],
  viteFinal: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias["../utils/shared"] = path.resolve(__dirname, "../src/utils/shared.ts");
    return config;
  },
};
