// The active brand × density tokens are loaded entirely via a single
// <link> element managed below. We deliberately do NOT import a default
// brand CSS at module load — if we did, Brand A's primitives would leak
// into Brand B's view (CSS variables can't be "unset" by a later sheet
// that doesn't redefine them).

const TOKEN_LINK_ID = "ds-active-tokens";

function tokenHref(brand, density) {
  // The dist/ folder is served at /tokens/ via main.cjs staticDirs.
  return `/tokens/${brand}-${density}.css`;
}

// Bootstrap the link synchronously at module load with the default
// brand × density so the browser starts fetching it as early as possible.
(function setupTokenLink() {
  if (typeof document === "undefined") return;
  if (document.getElementById(TOKEN_LINK_ID)) return;
  const link = document.createElement("link");
  link.id = TOKEN_LINK_ID;
  link.rel = "stylesheet";
  link.href = tokenHref("brand-a", "default");
  document.head.appendChild(link);
})();

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
    const link = document.getElementById(TOKEN_LINK_ID);
    if (link) {
      const href = tokenHref(brand, density);
      // getAttribute returns the path; .href returns the absolute URL.
      if (link.getAttribute("href") !== href) {
        link.setAttribute("href", href);
      }
    }
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
