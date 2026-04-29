import type { Meta, StoryObj } from "@storybook/react";
import { filterByPrefix, useCssTokens } from "./helpers";

const meta: Meta = {
  title: "Tokens/Radius",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

const css = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: 24,
    maxWidth: 900,
  } as React.CSSProperties,
  cell: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 12,
  } as React.CSSProperties,
  box: {
    width: 96,
    height: 96,
    background: "var(--color-bg-secondary, #f3f4f6)",
    border: "1px solid var(--color-border-default, #e5e7eb)",
  } as React.CSSProperties,
  value: { color: "#666" } as React.CSSProperties,
};

/** Every `--radius-*` token shown as a sample box. */
export const Scale: Story = {
  render: () => {
    const tokens = filterByPrefix(useCssTokens(), "--radius-");
    return (
      <div style={css.grid}>
        {tokens.map((t) => (
          <div key={t.name} style={css.cell}>
            <div style={{ ...css.box, borderRadius: `var(${t.name})` }} />
            <div>{t.name}</div>
            <div style={css.value}>{t.value}</div>
          </div>
        ))}
      </div>
    );
  },
};
