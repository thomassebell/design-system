import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../src/components/Checkbox/Checkbox";
import { Stack } from "../src/components/Stack/Stack";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  argTypes: {
    size: {
      control: "select",
      options: ["regular", "dense"],
    },
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
  args: { checked: true },
};

export const Indeterminate: Story = {
  args: { indeterminate: true },
};

export const Dense: Story = {
  args: { size: "dense" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  args: { disabled: true, checked: true },
};

export const Error: Story = {
  args: { "aria-invalid": true },
};

/** Every visual state side-by-side at both sizes. Useful as a single
 *  reference for designers reviewing the component in Figma alongside
 *  Storybook. */
export const AllStates: Story = {
  render: () => (
    <Stack gap="medium">
      {(["regular", "dense"] as const).map((size) => (
        <Stack key={size} direction="row" gap="medium" align="center">
          <Checkbox size={size} />
          <Checkbox size={size} defaultChecked />
          <Checkbox size={size} indeterminate />
          <Checkbox size={size} disabled />
          <Checkbox size={size} disabled defaultChecked />
          <Checkbox size={size} aria-invalid />
        </Stack>
      ))}
    </Stack>
  ),
};
