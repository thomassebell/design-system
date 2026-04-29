import type { Meta, StoryObj } from "@storybook/react";
import { filterByPrefix, useCssTokens } from "./helpers";

const meta: Meta = {
  title: "Tokens/Spacing",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

const css = {
  row: {
    display: "grid",
    gridTemplateColumns: "180px 100px 1fr",
    alignItems: "center",
    gap: 16,
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  } as React.CSSProperties,
  name: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 13,
  } as React.CSSProperties,
  value: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 13,
    color: "#666",
  } as React.CSSProperties,
  bar: {
    height: 16,
    background: "var(--color-action-primary, #3b82f6)",
    borderRadius: 2,
  } as React.CSSProperties,
};

/** Every `--spacing-*` token shown as a horizontal bar of that width. */
export const Scale: Story = {
  render: () => {
    const tokens = filterByPrefix(useCssTokens(), "--spacing-").sort((a, b) => {
      // Sort by numeric value so smallest comes first.
      const av = parseFloat(a.value);
      const bv = parseFloat(b.value);
      return av - bv;
    });
    return (
      <div style={{ maxWidth: 900 }}>
        {tokens.map((t) => (
          <div key={t.name} style={css.row}>
            <div style={css.name}>{t.name}</div>
            <div style={css.value}>{t.value}</div>
            <div style={{ ...css.bar, width: `var(${t.name})` }} />
          </div>
        ))}
      </div>
    );
  },
};
