import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxField } from "../src/components/CheckboxField/CheckboxField";
import { Stack } from "../src/components/Stack/Stack";

const meta: Meta<typeof CheckboxField> = {
  title: "Components/CheckboxField",
  component: CheckboxField,
  argTypes: {
    label: { control: "text" },
    hint: { control: "text" },
    error: { control: "text" },
    checked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof CheckboxField>;

export const Default: Story = {
  args: {
    label: "I agree to the terms and conditions",
  },
};

export const WithHint: Story = {
  args: {
    label: "Subscribe to product updates",
    hint: "About one email a month. Unsubscribe anytime.",
  },
};

export const WithError: Story = {
  args: {
    label: "I agree to the terms and conditions",
    error: "You must agree before continuing.",
  },
};

export const Checked: Story = {
  args: {
    label: "Remember me on this device",
    defaultChecked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: "Select all",
    indeterminate: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Receive marketing emails",
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: "Enrolled in beta program",
    disabled: true,
    defaultChecked: true,
  },
};

/** Stack of fields demonstrating how multiple CheckboxFields look in a
 *  form. */
export const InAForm: Story = {
  render: () => (
    <Stack gap="medium">
      <CheckboxField
        label="Marketing emails"
        hint="Product updates and announcements."
      />
      <CheckboxField
        label="Weekly digest"
        hint="A summary email every Monday."
      />
      <CheckboxField
        label="Account alerts"
        defaultChecked
        hint="Security and billing notifications. Always on for owners."
      />
      <CheckboxField
        label="I agree to the terms"
        error="You must agree before continuing."
      />
    </Stack>
  ),
};
