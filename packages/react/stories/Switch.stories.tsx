import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "../src/components/Switch/Switch";
import { Stack } from "../src/components/Stack/Stack";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {},
};

export const On: Story = {
  args: { defaultChecked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledOn: Story = {
  args: { disabled: true, defaultChecked: true },
};

export const Error: Story = {
  args: { "aria-invalid": true },
};

export const ErrorOn: Story = {
  args: { "aria-invalid": true, defaultChecked: true },
};

/** All states side-by-side — quick reference for designers comparing
 *  Storybook against Figma. Hover / pressed / focus are pseudo-classes
 *  and don't render statically; toggle them live by hovering / tabbing. */
export const AllStates: Story = {
  render: () => (
    <Stack gap="medium">
      <Stack direction="row" gap="medium" align="center">
        <Switch />
        <Switch defaultChecked />
        <Switch disabled />
        <Switch disabled defaultChecked />
        <Switch aria-invalid />
        <Switch aria-invalid defaultChecked />
      </Stack>
    </Stack>
  ),
};
