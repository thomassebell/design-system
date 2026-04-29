import type { Meta, StoryObj } from "@storybook/react";
import { filterByPrefix, useCssTokens, type Token } from "./helpers";

const meta: Meta = {
  title: "Tokens/Radius",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

const css = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
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
    textAlign: "center",
    wordBreak: "break-all",
  } as React.CSSProperties,
  box: {
    width: 96,
    height: 96,
    background: "var(--color-surface-secondary-lighter, #f3f4f6)",
    border: "1px solid var(--color-border-default, #e5e7eb)",
  } as React.CSSProperties,
  value: { color: "#666" } as React.CSSProperties,
};

function Boxes({ tokens }: { tokens: Token[] }) {
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
}

/** Brand-foundation radius primitives. Different shape per brand —
    Brand A is `square / round`, Brand B is `none / small / medium / large`. */
export const Primitives: Story = {
  render: () => <Boxes tokens={filterByPrefix(useCssTokens(), "--primitive-radius-")} />,
};

/** Semantic radius scale that components reference (small / medium / large / non). */
export const Semantic: Story = {
  render: () => {
    const all = useCssTokens();
    // Match --radius-* but exclude --primitive-radius-*.
    const tokens = all.filter(
      (t) => t.name.startsWith("--radius-") && !t.name.startsWith("--primitive-radius-"),
    );
    return <Boxes tokens={tokens} />;
  },
};
