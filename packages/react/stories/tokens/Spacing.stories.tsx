import type { Meta, StoryObj } from "@storybook/react-vite";
import { filterByPrefix, useCssTokens, type Token } from "./helpers";

const meta: Meta = {
  title: "Tokens/Spacing",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

const css = {
  row: {
    display: "grid",
    gridTemplateColumns: "240px 80px 1fr",
    alignItems: "center",
    gap: 16,
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  } as React.CSSProperties,
  name: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 13,
    wordBreak: "break-all",
  } as React.CSSProperties,
  value: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 13,
    color: "#666",
  } as React.CSSProperties,
  bar: {
    height: 16,
    background: "var(--color-action-primary, var(--color-surface-primary-main, #3b82f6))",
    borderRadius: 2,
  } as React.CSSProperties,
};

function Bars({ tokens }: { tokens: Token[] }) {
  // Sort by numeric value so smallest bar is at the top.
  const sorted = [...tokens].sort((a, b) => parseFloat(a.value) - parseFloat(b.value));
  return (
    <div style={{ maxWidth: 900 }}>
      {sorted.map((t) => (
        <div key={t.name} style={css.row}>
          <div style={css.name}>{t.name}</div>
          <div style={css.value}>{t.value}</div>
          <div style={{ ...css.bar, width: `var(${t.name})` }} />
        </div>
      ))}
    </div>
  );
}

/** Raw size scale that semantic and component tokens reference. */
export const Primitives: Story = {
  render: () => <Bars tokens={filterByPrefix(useCssTokens(), "--primitive-size-")} />,
};

/** Layout-level spacing — page sections, gaps between regions. */
export const Layout: Story = {
  render: () => <Bars tokens={filterByPrefix(useCssTokens(), "--semantic-layout-")} />,
};

/** Component-level spacing — padding inside buttons, gaps between items, etc. */
export const Components: Story = {
  render: () => <Bars tokens={filterByPrefix(useCssTokens(), "--semantic-components-")} />,
};
