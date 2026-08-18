/**
 * Consumer smoke test.
 *
 * Storybook renders components from src/ via Vite, so it can never catch a
 * broken *published* package. This script consumes @sebellds/tokens and @sebellds/react
 * exactly like an external app would:
 *
 *   1. `npm pack` both packages into a temp directory.
 *   2. `npm install` the tarballs (plus react) into a scratch project.
 *   3. Import the component entry, resolve the documented CSS export paths,
 *      and check the CSS Modules class map actually maps to scoped classes
 *      that exist in the shipped stylesheet.
 *
 * Run AFTER `npm run build` (it packs whatever is in dist/).
 * Usage: npm run smoke   (from the repo root; CI runs it on every push/PR)
 */

import { execSync } from "child_process";
import { mkdtempSync, writeFileSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tmp = mkdtempSync(join(tmpdir(), "ds-smoke-"));

function run(cmd, cwd) {
  return execSync(cmd, { cwd, encoding: "utf-8", stdio: ["pipe", "pipe", "inherit"] });
}

try {
  console.log("▸ Packing @sebellds/tokens and @sebellds/react…");
  const tarballs = run(
    `npm pack --workspace @sebellds/tokens --workspace @sebellds/react --pack-destination "${tmp}"`,
    repoRoot,
  )
    .trim()
    .split("\n")
    .filter((l) => l.endsWith(".tgz"));

  if (tarballs.length !== 2) {
    throw new Error(`Expected 2 tarballs, got: ${JSON.stringify(tarballs)}`);
  }

  console.log("▸ Installing into a scratch project…");
  writeFileSync(
    join(tmp, "package.json"),
    JSON.stringify({ name: "ds-smoke", private: true, type: "module" }, null, 2),
  );
  const tarballArgs = tarballs.map((t) => `"${join(tmp, t)}"`).join(" ");
  run(
    `npm install --no-audit --no-fund --loglevel=error react react-dom ${tarballArgs}`,
    tmp,
  );

  console.log("▸ Importing like a consumer…");
  writeFileSync(
    join(tmp, "check.mjs"),
    `
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

// 1. The JS entry resolves and exports components.
const ds = await import("@sebellds/react");
assert(ds.Button, "Button export missing");
assert(ds.Text, "Text export missing");
assert(typeof ds.cx === "function", "cx export missing");

// 2. The documented stylesheet export resolves and has real content.
const stylesPath = require.resolve("@sebellds/react/styles.css");
const css = readFileSync(stylesPath, "utf-8");
assert(css.includes("box-sizing"), "reset missing from styles.css");
assert(css.includes(".ds-visually-hidden"), "global utility class missing or hashed");
assert(css.includes("var(--"), "component styles reference no token variables");

// 3. CSS Modules survived the build: scoped (non-trivial) class names exist
//    in the stylesheet. A plain ".button" would mean scoping was lost; an
//    empty class map in the JS would mean components ship unstyled.
assert(/\\.Button_\\w+/.test(css), "scoped Button classes missing from styles.css");
assert(!/(^|[}\\s])\\.button\\s*\\{/.test(css), "unscoped .button leaked into styles.css");

// 4. Token stylesheets resolve via the documented path and define variables.
const tokensPath = require.resolve("@sebellds/tokens/dist/sebell-default.css");
const tokens = readFileSync(tokensPath, "utf-8");
assert(tokens.includes("--color-"), "color variables missing from token CSS");
assert(tokens.includes("--semantic-"), "semantic spacing variables missing from token CSS");

console.log("✓ consumer smoke test passed");
`,
  );
  run("node check.mjs", tmp);
  console.log("✓ All consumer checks passed.");
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
