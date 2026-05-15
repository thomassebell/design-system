// All four brand × density token stylesheets are inlined as <style> tags
// via Vite's ?inline CSS imports. The CSS is in the JS bundle, so by the
// time preview.js finishes executing every set of rules is already in
// the CSSOM. Switching modes is then a synchronous flip of the `media`
// attribute on each <style> — instant, no network, no race against
// Chromatic taking a snapshot before the new stylesheet loads.

import sebellDefaultCss from "@ds/tokens/dist/sebell-default.css?inline";
import sebellCompactCss from "@ds/tokens/dist/sebell-compact.css?inline";
import brandADefaultCss from "@ds/tokens/dist/brand-a-default.css?inline";
import brandACompactCss from "@ds/tokens/dist/brand-a-compact.css?inline";
import brandBDefaultCss from "@ds/tokens/dist/brand-b-default.css?inline";
import brandBCompactCss from "@ds/tokens/dist/brand-b-compact.css?inline";

const SHEETS = {
  "sebell-default": sebellDefaultCss,
  "sebell-compact": sebellCompactCss,
  "brand-a-default": brandADefaultCss,
  "brand-a-compact": brandACompactCss,
  "brand-b-default": brandBDefaultCss,
  "brand-b-compact": brandBCompactCss,
};

const DEFAULT_MODE = "sebell-default";
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
fonts.href = "https://fonts.googleapis.com/css2?family=Gabarito:wght@300;400;500;600;700&family=Inter:wght@200;400;500;600;700&family=Roboto:wght@300;400;700&family=Noto+Sans:wght@300;400;500;700&family=Noto+Serif:wght@300;400;500;700&display=swap";
document.head.appendChild(fonts);

export const globalTypes = {
  brand: {
    name: "Brand",
    description: "Switch brand theme",
    toolbar: {
      icon: "paintbrush",
      items: [
        { value: "sebell", title: "Sebell" },
        { value: "brand-a", title: "Brand A" },
        { value: "brand-b", title: "Brand B" },
      ],
    },
  },
  density: {
    name: "Density",
    description: "Switch layout density",
    toolbar: {
      icon: "grow",
      items: [
        { value: "default", title: "Default" },
        { value: "compact", title: "Compact" },
      ],
    },
  },
};

// IMPORTANT: do not move these globals onto globalTypes as `defaultValue`.
// Storybook 10+ silently breaks Chromatic per-snapshot mode globals if
// defaultValue is set. `initialGlobals` at module level is the supported
// pattern. See memory/feedback_storybook_initial_globals.md.
export const initialGlobals = {
  brand: "sebell",
  density: "default",
};

export const decorators = [
  (Story, context) => {
    const { brand, density } = context.globals;
    activateMode(`${brand}-${density}`);
    return Story();
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
    // Snapshot every story across the 4 brand × density combos. Each
    // mode is a flat record of globals; Chromatic merges them into the
    // story's globals before capturing the snapshot.
    chromatic: {
      modes: {
        "sebell-default": { brand: "sebell", density: "default" },
        "sebell-compact": { brand: "sebell", density: "compact" },
        "brand-a-default": { brand: "brand-a", density: "default" },
        "brand-a-compact": { brand: "brand-a", density: "compact" },
        "brand-b-default": { brand: "brand-b", density: "default" },
        "brand-b-compact": { brand: "brand-b", density: "compact" },
      },
    },
  },
};
