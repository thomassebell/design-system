import StyleDictionary from "style-dictionary";
import { readFileSync } from "fs";

const brands = ["brand-a", "brand-b"];

for (const brand of brands) {
  console.log(`\n▸ Building ${brand}...`);

  const sd = new StyleDictionary({
    source: [
      `brands/${brand}-colors.json`,
      `brands/${brand}-overrides.json`,
      "src/color-semantic.json",
      "src/typography-shared.json",
      "src/spacing-shared.json",
    ],
    platforms: {
      css: {
        transformGroup: "css",
        buildPath: `dist/${brand}/`,
        files: [
          {
            destination: "tokens.css",
            format: "css/variables",
            options: { outputReferences: true },
          },
        ],
      },
      js: {
        transformGroup: "js",
        buildPath: `dist/${brand}/`,
        files: [
          { destination: "tokens.js", format: "javascript/es6" },
          { destination: "tokens.d.ts", format: "typescript/es6-declarations" },
        ],
      },
      json: {
        transformGroup: "js",
        buildPath: `output/${brand}/`,
        files: [
          { destination: "tokens.json", format: "json/nested" },
        ],
      },
    },
  });

  await sd.buildAllPlatforms();
  console.log(`✓ ${brand} built`);
}
