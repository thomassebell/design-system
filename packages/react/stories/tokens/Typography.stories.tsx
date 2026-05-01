import type { Meta, StoryObj } from "@storybook/react-vite";
import { filterByPrefix, useCssTokens, type Token } from "./helpers";

const meta: Meta = {
  title: "Tokens/Typography",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

const css = {
  row: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gap: 24,
    alignItems: "baseline",
    padding: "16px 0",
    borderBottom: "1px solid #eee",
  } as React.CSSProperties,
  meta: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 12,
    color: "#666",
    lineHeight: 1.5,
    wordBreak: "break-all",
  } as React.CSSProperties,
};

const SAMPLE = "The quick brown fox jumps over the lazy dog";

function Sample({
  token,
  style,
}: {
  token: Token;
  style: React.CSSProperties;
}) {
  return (
    <div style={css.row}>
      <div style={css.meta}>
        <div>{token.name}</div>
        <div>{token.value}</div>
      </div>
      <div style={style}>{SAMPLE}</div>
    </div>
  );
}

/** Every font-size token, rendered at its actual size. */
export const Sizes: Story = {
  render: () => {
    const tokens = filterByPrefix(useCssTokens(), "--typography-font-size-");
    return (
      <div style={{ maxWidth: 900 }}>
        {tokens.map((t) => (
          <Sample
            key={t.name}
            token={t}
            style={{
              fontSize: `var(${t.name})`,
              lineHeight: 1.4,
              fontFamily: "var(--typography-font-family-paragraph)",
            }}
          />
        ))}
      </div>
    );
  },
};

/** Each font-family in the system, shown at a comfortable reading size. */
export const Families: Story = {
  render: () => {
    const tokens = filterByPrefix(useCssTokens(), "--typography-font-family-");
    return (
      <div style={{ maxWidth: 900 }}>
        {tokens.map((t) => (
          <Sample
            key={t.name}
            token={t}
            style={{
              fontFamily: `var(${t.name})`,
              fontSize: 24,
              lineHeight: 1.4,
            }}
          />
        ))}
      </div>
    );
  },
};

/** Every font-weight token, rendered at the same size. */
export const Weights: Story = {
  render: () => {
    const tokens = filterByPrefix(useCssTokens(), "--typography-font-weight-");
    return (
      <div style={{ maxWidth: 900 }}>
        {tokens.map((t) => (
          <Sample
            key={t.name}
            token={t}
            style={{
              fontWeight: `var(${t.name})`,
              fontSize: 24,
              fontFamily: "var(--typography-font-family-paragraph)",
            }}
          />
        ))}
      </div>
    );
  },
};

/** Line-height tokens, applied to a multi-line paragraph for visual comparison. */
export const LineHeights: Story = {
  render: () => {
    const tokens = filterByPrefix(useCssTokens(), "--typography-line-height-");
    return (
      <div style={{ maxWidth: 900 }}>
        {tokens.map((t) => (
          <div key={t.name} style={css.row}>
            <div style={css.meta}>
              <div>{t.name}</div>
              <div>{t.value}</div>
            </div>
            <div
              style={{
                lineHeight: `var(${t.name})`,
                fontSize: 16,
                fontFamily: "var(--typography-font-family-paragraph)",
                maxWidth: 480,
              }}
            >
              {SAMPLE}. {SAMPLE}. {SAMPLE}.
            </div>
          </div>
        ))}
      </div>
    );
  },
};
