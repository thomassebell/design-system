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
  args: { children: "Button", variant: "solid" },
};

/**
 * Diagnostic story — same as Solid but with story-level globals forcing
 * brand-b + compact. If this Chromatic snapshot shows green and tighter
 * than `Solid`, per-story globals are working and we know `chromatic.modes`
 * isn't the right tool. If it still looks identical to `Solid`, the
 * globals aren't propagating at all and we need to debug deeper.
 */
export const SolidDiagnosticBrandBCompact: Story = {
  args: { children: "Button (diagnostic)", variant: "solid" },
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
