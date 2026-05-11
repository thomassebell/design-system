import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../src/components/Checkbox/Checkbox";
import { Stack } from "../src/components/Stack/Stack";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  argTypes: {
    checked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Indeterminate: Story = {
  args: { indeterminate: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true },
};

export const Error: Story = {
  args: { "aria-invalid": true },
};

export const ErrorChecked: Story = {
  args: { "aria-invalid": true, defaultChecked: true },
};

/** All states side-by-side — a single-frame reference for designers
 *  comparing Storybook against Figma. Hover/pressed/focus are
 *  pseudo-classes and don't render statically — tab into and hover
 *  over the resting row to see them live. */
export const AllStates: Story = {
  render: () => (
    <Stack gap="medium">
      <Stack direction="row" gap="medium" align="center">
        <Checkbox />
        <Checkbox defaultChecked />
        <Checkbox indeterminate />
        <Checkbox disabled />
        <Checkbox disabled defaultChecked />
        <Checkbox aria-invalid />
        <Checkbox aria-invalid defaultChecked />
      </Stack>
    </Stack>
  ),
};
