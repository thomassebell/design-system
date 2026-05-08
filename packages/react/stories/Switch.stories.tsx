import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "../src/components/Switch/Switch";
import { Stack } from "../src/components/Stack/Stack";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  argTypes: {
    size: {
      control: "select",
      options: ["regular", "dense"],
    },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Dense: Story = {
  args: { size: "dense" },
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

/** Side-by-side states at both sizes — quick reference for designers
 *  comparing Storybook against Figma. */
export const AllStates: Story = {
  render: () => (
    <Stack gap="medium">
      {(["regular", "dense"] as const).map((size) => (
        <Stack key={size} direction="row" gap="medium" align="center">
          <Switch size={size} />
          <Switch size={size} defaultChecked />
          <Switch size={size} disabled />
          <Switch size={size} disabled defaultChecked />
          <Switch size={size} aria-invalid />
          <Switch size={size} aria-invalid defaultChecked />
        </Stack>
      ))}
    </Stack>
  ),
};
