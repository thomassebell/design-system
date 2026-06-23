// Every brand × density token stylesheet is inlined as a <style> tag via
// Vite's ?inline CSS imports. The CSS lives in the JS bundle, so by the time
// preview.js finishes executing every set of rules is already in the CSSOM.
// Switching modes is then a synchronous flip of the `media` attribute on each
// <style> — instant, no network, no race against Chromatic taking a snapshot
// before the new stylesheet loads.
//
// The brand × density matrix is NOT hardcoded here — it comes from the single
// source of truth in ../../tokens/brands.config.js. Add a brand or density
// there and the toolbar, the per-mode stylesheets, the Chromatic modes, and
// the defaults all update automatically.

import React from "react";
import {
  BRANDS,
  DENSITIES,
  DEFAULT_BRAND,
  DEFAULT_DENSITY,
} from "../../tokens/brands.config.js";

// Eagerly inline every built token stylesheet. Keyed by file path; we reduce
// the path down to its mode name ("sebell-default") below. This is just the
// loading mechanism — brands.config.js stays authoritative for which modes we
// actually expose.
const cssModules = import.meta.glob("../../tokens/dist/*.css", {
  query: "?inline",
  import: "default",
  eager: true,
});

const cssByMode = {};
for (const [path, css] of Object.entries(cssModules)) {
  const mode = path.split("/").pop().replace(/\.css$/, "");
  cssByMode[mode] = css;
}

// The modes we expose = the cartesian product of brands × densities, in config
// order. SHEETS maps each "brand-density" mode to its inlined CSS string.
const MODES = BRANDS.flatMap((b) => DENSITIES.map((d) => `${b.id}-${d.id}`));

const SHEETS = {};
for (const mode of MODES) {
  if (!cssByMode[mode]) {
    console.warn(
      `[preview] No built stylesheet for mode "${mode}". ` +
        `Run \`npm run tokens:build\` — expected dist/${mode}.css.`,
    );
    continue;
  }
  SHEETS[mode] = cssByMode[mode];
}

const DEFAULT_MODE = `${DEFAULT_BRAND}-${DEFAULT_DENSITY}`;
const STYLE_DATA_ATTR = "tokenMode"; // dataset key (renders as data-token-mode)

(function attachAllModeStyles() {
  if (typeof document === "undefined") return;
  for (const [mode, css] of Object.entries(SHEETS)) {
    if (document.querySelector(`style[data-token-mode="${mode}"]`)) continue;
    const style = document.createElement("style");
    style.dataset[STYLE_DATA_ATTR] = mode;
    style.textContent = css;
    style.media = mode === DEFAULT_MODE ? "all" : "not all";
    document.head.appendChild(style);
  }
})();

function activateMode(mode) {
  if (typeof document === "undefined") return;
  document.querySelectorAll("style[data-token-mode]").forEach((style) => {
    style.media = style.dataset[STYLE_DATA_ATTR] === mode ? "all" : "not all";
  });
}

// Web fonts used across the system.
const fonts = document.createElement("link");
fonts.rel = "stylesheet";
fonts.href = "https://fonts.googleapis.com/css2?family=Gabarito:wght@300;400;500;600;700&family=Inter:wght@200;400;500;600;700&family=Roboto:wght@300;400;700&family=Montserrat:wght@200;400;700&family=Noto+Sans:wght@300;400;500;700&family=Noto+Serif:wght@300;400;500;700&display=swap";
document.head.appendChild(fonts);

export const globalTypes = {
  brand: {
    name: "Brand",
    description: "Switch brand theme",
    toolbar: {
      icon: "paintbrush",
      items: BRANDS.map((b) => ({ value: b.id, title: b.title })),
    },
  },
  density: {
    name: "Density",
    description: "Switch layout density",
    toolbar: {
      icon: "grow",
      items: DENSITIES.map((d) => ({ value: d.id, title: d.title })),
    },
  },
  surface: {
    name: "Surface",
    description: "Switch appearance mode (light / dark)",
    toolbar: {
      icon: "contrast",
      items: [
        { value: "light", title: "Light" },
        { value: "dark", title: "Dark" },
      ],
    },
  },
};

// IMPORTANT: do not move these globals onto globalTypes as `defaultValue`.
// Storybook 10+ silently breaks Chromatic per-snapshot mode globals if
// defaultValue is set. `initialGlobals` at module level is the supported
// pattern. See memory/feedback_storybook_initial_globals.md.
export const initialGlobals = {
  brand: DEFAULT_BRAND,
  density: DEFAULT_DENSITY,
  surface: "light",
};

export const decorators = [
  (Story, context) => {
    const { brand, density, surface } = context.globals;
    activateMode(`${brand}-${density}`);
    // Backgrounds are a free brand-colour choice, not owned by the appearance
    // mode — but for the preview we paint a representative page so dark mode is
    // actually visible. data-surface scopes the foreground token flip; the
    // components inside adapt automatically.
    const pageBg = surface === "dark" ? "#1f2e20" : "#fbfbf9";
    return React.createElement(
      "div",
      {
        "data-surface": surface,
        style: {
          background: pageBg,
          color: "var(--text-default)",
          padding: "2rem",
          minHeight: "100vh",
        },
      },
      Story(),
    );
  },
];

export default {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      manual: false,
      config: {
        rules: [
          // Stories render components in isolation, so axe sees content
          // outside any landmark and warns. Landmarks (<main>, <nav>,
          // etc.) belong to the consuming app, not individual components.
          { id: "region", enabled: false },
        ],
      },
      options: {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"],
        },
      },
    },
    // Snapshot every story across the full brand × density matrix. Each mode
    // is a flat record of globals; Chromatic merges them into the story's
    // globals before capturing the snapshot. Built from the same config as
    // the toolbar, so modes can never drift from the brands we ship.
    chromatic: {
      modes: Object.fromEntries(
        BRANDS.flatMap((b) =>
          DENSITIES.map((d) => [
            `${b.id}-${d.id}`,
            { brand: b.id, density: d.id },
          ]),
        ),
      ),
    },
  },
};
