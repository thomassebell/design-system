import "./tokens.css";

const fonts = document.createElement("link");
fonts.rel = "stylesheet";
fonts.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Gabarito:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;600;700&display=swap";
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

const tokenFiles = {
  "brand-a/default": "tokens.css",
  "brand-a/compact": "tokens-brand-a-compact.css",
  "brand-b/default": "tokens-brand-b.css",
  "brand-b/compact": "tokens-brand-b-compact.css",
};

export const decorators = [
  (Story, context) => {
    const brand = context.globals.brand;
    const density = context.globals.density;
    const key = brand + "/" + density;
    const file = tokenFiles[key];

    const linkId = "brand-density-tokens";
    let link = document.getElementById(linkId);
    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    if (key === "brand-a/default") {
      link.href = "";
    } else {
      link.href = file;
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
  },
};
