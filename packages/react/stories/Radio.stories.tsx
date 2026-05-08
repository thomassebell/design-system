import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio } from "../src/components/Radio/Radio";
import { Stack } from "../src/components/Stack/Stack";

const meta: Meta<typeof Radio> = {
  title: "Components/Radio",
  component: Radio,
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
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: { name: "demo" },
};

export const Checked: Story = {
  args: { name: "demo", checked: true, readOnly: true },
};

export const Dense: Story = {
  args: { name: "demo", size: "dense" },
};

export const Disabled: Story = {
  args: { name: "demo", disabled: true },
};

export const DisabledChecked: Story = {
  args: { name: "demo", disabled: true, checked: true, readOnly: true },
};

export const Error: Story = {
  args: { name: "demo", "aria-invalid": true },
};

/** Side-by-side states at both sizes — quick reference for designers
 *  comparing Storybook against Figma. */
export const AllStates: Story = {
  render: () => (
    <Stack gap="medium">
      {(["regular", "dense"] as const).map((size) => (
        <Stack key={size} direction="row" gap="medium" align="center">
          <Radio name={`row-${size}-1`} size={size} />
          <Radio name={`row-${size}-2`} size={size} defaultChecked />
          <Radio name={`row-${size}-3`} size={size} disabled />
          <Radio name={`row-${size}-4`} size={size} disabled defaultChecked />
          <Radio name={`row-${size}-5`} size={size} aria-invalid />
          <Radio name={`row-${size}-6`} size={size} aria-invalid defaultChecked />
        </Stack>
      ))}
    </Stack>
  ),
};
