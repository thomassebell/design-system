// Brand × density token stylesheets are preloaded at module load — all
// four are inserted into <head> as <link rel="stylesheet"> with the
// inactive ones gated by media="not all". The browser still fetches
// (and caches) every stylesheet, but only the active one applies to
// the document. Switching modes is then a synchronous flip of the
// `media` attribute — no network wait, no race against Chromatic
// snapshotting before the stylesheet has loaded.

const TOKEN_LINK_DATA_ATTR = "ds-token-mode";

const MODES = [
  "brand-a-default",
  "brand-a-compact",
  "brand-b-default",
  "brand-b-compact",
];

const DEFAULT_MODE = "brand-a-default";

(function preloadAllTokenStylesheets() {
  if (typeof document === "undefined") return;
  for (const mode of MODES) {
    if (document.querySelector(`link[data-${TOKEN_LINK_DATA_ATTR}="${mode}"]`)) continue;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `/tokens/${mode}.css`;
    link.dataset[camelDataKey(TOKEN_LINK_DATA_ATTR)] = mode;
    // Inactive sheets are loaded but don't apply.
    link.media = mode === DEFAULT_MODE ? "all" : "not all";
    document.head.appendChild(link);
  }
})();

function camelDataKey(attr) {
  // dataset uses camelCase: data-foo-bar -> dataset.fooBar
  return attr
    .split("-")
    .map((p, i) => (i === 0 ? p : p[0].toUpperCase() + p.slice(1)))
    .join("");
}

function activateMode(mode) {
  if (typeof document === "undefined") return;
  const links = document.querySelectorAll(`link[data-${TOKEN_LINK_DATA_ATTR}]`);
  links.forEach((link) => {
    const linkMode = link.dataset[camelDataKey(TOKEN_LINK_DATA_ATTR)];
    link.media = linkMode === mode ? "all" : "not all";
  });
}

// Web fonts used across the system.
const fonts = document.createElement("link");
fonts.rel = "stylesheet";
fonts.href = "https://fonts.googleapis.com/css2?family=Gabarito:wght@300;400;500;600;700&family=Inter:wght@200;400;500;600;700&family=Roboto:wght@300;400;700&display=swap";
document.head.appendChild(fonts);

export const globalTypes = {
  brand: {
    name: "Brand",
    description: "Switch brand theme",
    defaultValue: "brand-a",
    toolbar: {
      icon: "paintbrush",
      items: [
        { value: "brand-a", title: "Brand A" },
        { value: "brand-b", title: "Brand B" },
      ],
    },
  },
  density: {
    name: "Density",
    description: "Switch layout density",
    defaultValue: "default",
    toolbar: {
      icon: "grow",
      items: [
        { value: "default", title: "Default" },
        { value: "compact", title: "Compact" },
      ],
    },
  },
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
      config: { rules: [] },
      options: {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"],
        },
      },
    },
    // Snapshot every story in all four brand × density combinations so
    // brand-specific colours, density-specific spacing, and any
    // interaction between the two are all covered by visual regression.
    chromatic: {
      modes: {
        "brand-a-default": {
          globals: { brand: "brand-a", density: "default" },
        },
        "brand-a-compact": {
          globals: { brand: "brand-a", density: "compact" },
        },
        "brand-b-default": {
          globals: { brand: "brand-b", density: "default" },
        },
        "brand-b-compact": {
          globals: { brand: "brand-b", density: "compact" },
        },
      },
    },
  },
};
