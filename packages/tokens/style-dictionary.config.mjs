import StyleDictionary from "style-dictionary";

export default {
  source: ["src/**/*.json"],
  platforms: {
    // CSS custom properties for React / web
    css: {
      transformGroup: "css",
      buildPath: "dist/",
      files: [
        {
          destination: "tokens.css",
          format: "css/variables",
          options: {
            outputReferences: true,
          },
        },
      ],
    },

    // JS/TS module for importing tokens in React components
    js: {
      transformGroup: "js",
      buildPath: "dist/",
      files: [
        {
          destination: "tokens.js",
          format: "javascript/es6",
        },
        {
          destination: "tokens.d.ts",
          format: "typescript/es6-declarations",
        },
      ],
    },

    // JSON output consumed by the Swift generator
    json: {
      transformGroup: "js",
      buildPath: "output/",
      files: [
        {
          destination: "tokens.json",
          format: "json/nested",
        },
      ],
    },
  },
};
