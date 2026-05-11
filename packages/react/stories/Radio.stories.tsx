import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio } from "../src/components/Radio/Radio";
import { Stack } from "../src/components/Stack/Stack";

const meta: Meta<typeof Radio> = {
  title: "Components/Radio",
  component: Radio,
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: { name: "demo" },
};

export const Checked: Story = {
  args: { name: "demo", defaultChecked: true },
};

export const Disabled: Story = {
  args: { name: "demo", disabled: true },
};

export const DisabledChecked: Story = {
  args: { name: "demo", disabled: true, defaultChecked: true },
};

export const Error: Story = {
  args: { name: "demo", "aria-invalid": true },
};

export const ErrorChecked: Story = {
  args: { name: "demo", "aria-invalid": true, defaultChecked: true },
};

/** All states side-by-side — quick reference for designers comparing
 *  Storybook against Figma. Hover / pressed / focus are pseudo-classes
 *  and don't render statically — tab into and hover over the resting
 *  row to see them live. */
export const AllStates: Story = {
  render: () => (
    <Stack gap="medium">
      <Stack direction="row" gap="medium" align="center">
        <Radio name="row1-a" />
        <Radio name="row1-b" defaultChecked />
        <Radio name="row1-c" disabled />
        <Radio name="row1-d" disabled defaultChecked />
        <Radio name="row1-e" aria-invalid />
        <Radio name="row1-f" aria-invalid defaultChecked />
      </Stack>
    </Stack>
  ),
};
