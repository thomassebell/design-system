import type { Meta, StoryObj } from "@storybook/react";
import { filterByPrefix, useCssTokens, type Token } from "./helpers";

const meta: Meta = {
  title: "Tokens/Colors",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Live catalog of every color token in the design system. Use the Brand and Density toolbar switchers to see how the values change between themes.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const css = {
  swatchOuter: {
    width: 64,
    height: 64,
    borderRadius: 8,
    border: "1px solid rgba(0, 0, 0, 0.18)",
    flexShrink: 0,
    overflow: "hidden",
    // Checkerboard so transparent or pure-white tokens are still
    // clearly visible against the Storybook canvas.
    backgroundImage: [
      "linear-gradient(45deg, rgba(0,0,0,0.08) 25%, transparent 25%)",
      "linear-gradient(-45deg, rgba(0,0,0,0.08) 25%, transparent 25%)",
      "linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.08) 75%)",
      "linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.08) 75%)",
    ].join(", "),
    backgroundSize: "12px 12px",
    backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0",
  } as React.CSSProperties,
  swatchInner: {
    width: "100%",
    height: "100%",
  } as React.CSSProperties,
  row: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "12px 0",
    borderBottom: "1px solid #eee",
  } as React.CSSProperties,
  meta: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 13,
    lineHeight: 1.5,
  } as React.CSSProperties,
  value: { color: "#666" } as React.CSSProperties,
};

function Swatch({ name, value }: Token) {
  return (
    <div style={css.row}>
      <div style={css.swatchOuter} aria-hidden="true">
        <div
          style={{ ...css.swatchInner, background: `var(${name})` }}
        />
      </div>
      <div style={css.meta}>
        <div>{name}</div>
        <div style={css.value}>{value}</div>
      </div>
    </div>
  );
}

function ColorList({ prefixes }: { prefixes: string[] }) {
  const tokens = filterByPrefix(useCssTokens(), ...prefixes);
  return (
    <div style={{ maxWidth: 720 }}>
      {tokens.length === 0 && (
        <p>
          No color tokens matched <code>{prefixes.join(", ")}</code>.
        </p>
      )}
      {tokens.map((t) => (
        <Swatch key={t.name} {...t} />
      ))}
    </div>
  );
}

/** Background, text, border, action, and feedback colors — what components actually consume. */
export const Semantic: Story = {
  render: () => (
    <ColorList
      prefixes={[
        "--color-bg",
        "--color-text",
        "--color-border",
        "--color-action",
        "--color-feedback",
      ]}
    />
  ),
};

/** Raw primitive ramps — building blocks the semantic layer references. */
export const Primitives: Story = {
  render: () => <ColorList prefixes={["--color-primitive"]} />,
};
