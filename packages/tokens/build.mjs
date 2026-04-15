import StyleDictionary from "style-dictionary";
import { readdirSync, existsSync } from "fs";

// ── Auto-discover brands and densities ───────────

function getNames(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(function(f) { return f.endsWith(".json"); })
    .map(function(f) { return f.replace(".json", ""); });
}

var brands = getNames("brands");
var densities = getNames("densities");

if (brands.length === 0) {
  console.error("No brand files found in brands/");
  console.error("Run: node scripts/import-from-figma.mjs <file> brand <name>");
  process.exit(1);
}

// If no density modes, just build brands
if (densities.length === 0) {
  densities = [null];
}

console.log("Brands:    " + brands.join(", "));
console.log("Densities: " + (densities[0] === null ? "(none)" : densities.join(", ")));
console.log("");

// ── Build each combination ───────────────────────

for (var brand of brands) {
  for (var density of densities) {
    var label = density ? brand + "/" + density : brand;
    var buildPath = density ? "dist/" + brand + "/" + density + "/" : "dist/" + brand + "/";
    var outputPath = density ? "output/" + brand + "/" + density + "/" : "output/" + brand + "/";

    console.log("▸ Building " + label + "...");

    var sources = ["brands/" + brand + ".json"];
    if (density) {
      sources.push("densities/" + density + ".json");
    }

    var sd = new StyleDictionary({
      source: sources,
      platforms: {
        css: {
          transformGroup: "css",
          buildPath: buildPath,
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
          buildPath: buildPath,
          files: [
            { destination: "tokens.js", format: "javascript/es6" },
            { destination: "tokens.d.ts", format: "typescript/es6-declarations" },
          ],
        },
        json: {
          transformGroup: "js",
          buildPath: outputPath,
          files: [
            { destination: "tokens.json", format: "json/nested" },
          ],
        },
      },
    });

    await sd.buildAllPlatforms();
    console.log("✓ " + label + " built");
    console.log("");
  }
}

console.log("Done! Output structure:");
for (var brand of brands) {
  for (var density of densities) {
    if (density) {
      console.log("  dist/" + brand + "/" + density + "/tokens.css");
    } else {
      console.log("  dist/" + brand + "/tokens.css");
    }
  }
}
