import type { Meta, StoryObj } from "@storybook/react";
import { Stack } from "../src/components/Stack/Stack";

/** Sample tile used inside the stack so layout is visible. */
const Box = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      background: "var(--color-bg-secondary, #eee)",
      border: "1px solid var(--color-border-subtle, #ddd)",
      padding: "12px 16px",
      borderRadius: 8,
      minWidth: 60,
      textAlign: "center",
      fontFamily: "system-ui, sans-serif",
      fontSize: 14,
    }}
  >
    {children}
  </div>
);

const meta: Meta<typeof Stack> = {
  title: "Components/Stack",
  component: Stack,
  argTypes: {
    direction: {
      control: "select",
      options: ["row", "column"],
    },
    gap: {
      control: "select",
      options: [0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48],
    },
    align: {
      control: "select",
      options: [undefined, "start", "center", "end", "stretch", "baseline"],
    },
    justify: {
      control: "select",
      options: [undefined, "start", "center", "end", "between", "around"],
    },
    wrap: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Column: Story = {
  args: { direction: "column", gap: 4 },
  render: (args) => (
    <Stack {...args}>
      <Box>One</Box>
      <Box>Two</Box>
      <Box>Three</Box>
    </Stack>
  ),
};

export const Row: Story = {
  args: { direction: "row", gap: 4 },
  render: (args) => (
    <Stack {...args}>
      <Box>One</Box>
      <Box>Two</Box>
      <Box>Three</Box>
    </Stack>
  ),
};

export const RowCentered: Story = {
  args: { direction: "row", gap: 4, justify: "center", align: "center" },
  render: (args) => (
    <div style={{ height: 120, border: "1px dashed #ccc" }}>
      <Stack {...args} style={{ height: "100%" }}>
        <Box>One</Box>
        <Box>Two</Box>
        <Box>Three</Box>
      </Stack>
    </div>
  ),
};

export const SpaceBetween: Story = {
  args: { direction: "row", justify: "between" },
  render: (args) => (
    <Stack {...args} style={{ width: "100%" }}>
      <Box>Start</Box>
      <Box>Middle</Box>
      <Box>End</Box>
    </Stack>
  ),
};

export const Wrapping: Story = {
  args: { direction: "row", gap: 4, wrap: true },
  render: (args) => (
    <div style={{ maxWidth: 320, border: "1px dashed #ccc", padding: 8 }}>
      <Stack {...args}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Box key={i}>Item {i + 1}</Box>
        ))}
      </Stack>
    </div>
  ),
};

/** Showing every gap step on the spacing scale, side-by-side. */
export const GapScale: Story = {
  render: () => (
    <Stack direction="column" gap={6}>
      {[0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48].map((g) => (
        <div key={g}>
          <div
            style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: 12,
              color: "#666",
              marginBottom: 4,
            }}
          >
            gap = {g}
          </div>
          <Stack direction="row" gap={g as never}>
            <Box>A</Box>
            <Box>B</Box>
            <Box>C</Box>
          </Stack>
        </div>
      ))}
    </Stack>
  ),
};
