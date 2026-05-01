import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../src/components/Button/Button";
import { Stack } from "../src/components/Stack/Stack";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "outline", "ghost", "danger"],
    },
    size: {
      control: "select",
      options: ["regular", "dense"],
    },
    fullWidth: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Solid: Story = {
  // Renders in the default brand × density — Brand A, Default density.
  args: { children: "Button", variant: "solid" },
};

/* ── Multi-mode regression stories ─────────────────
 * The three stories below are the same Solid Button but each pinned
 * to a different brand × density via per-story `globals`. Chromatic
 * snapshots them as four genuinely different images — covering brand
 * AND density without relying on the broken chromatic.modes feature.
 */

export const SolidBrandACompact: Story = {
  args: { children: "Button", variant: "solid" },
  globals: { brand: "brand-a", density: "compact" },
};

export const SolidBrandBDefault: Story = {
  args: { children: "Button", variant: "solid" },
  globals: { brand: "brand-b", density: "default" },
};

export const SolidBrandBCompact: Story = {
  args: { children: "Button", variant: "solid" },
  globals: { brand: "brand-b", density: "compact" },
};

export const Outline: Story = {
  args: { children: "Button", variant: "outline" },
};

export const Ghost: Story = {
  args: { children: "Button", variant: "ghost" },
};

export const Danger: Story = {
  args: { children: "Delete", variant: "danger" },
};

export const Loading: Story = {
  args: { children: "Saving…", loading: true },
};

/** Both sizes side-by-side. Toggle Density to see each tighten further. */
export const Sizes: Story = {
  render: () => (
    <Stack direction="row" gap="small" align="center">
      <Button size="regular">Regular</Button>
      <Button size="dense">Dense</Button>
    </Stack>
  ),
};

/** Dense variant on its own — for toolbars, table actions, dense forms. */
export const Dense: Story = {
  args: { children: "Dense", size: "dense" },
};
