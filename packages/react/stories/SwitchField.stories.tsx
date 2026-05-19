import type { Meta, StoryObj } from "@storybook/react-vite";
import { SwitchField } from "../src/components/SwitchField/SwitchField";
import { Stack } from "../src/components/Stack/Stack";

const meta: Meta<typeof SwitchField> = {
  title: "Components/SwitchField",
  component: SwitchField,
  argTypes: {
    label: { control: "text" },
    hint: { control: "text" },
    error: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof SwitchField>;

export const Default: Story = {
  args: {
    label: "Email notifications",
  },
};

export const WithHint: Story = {
  args: {
    label: "Two-factor authentication",
    hint: "Use an authenticator app to add a second factor when signing in.",
  },
};

export const On: Story = {
  args: {
    label: "Auto-save drafts",
    defaultChecked: true,
    hint: "Drafts save every 30 seconds.",
  },
};

export const WithError: Story = {
  args: {
    label: "Public profile",
    error: "Profile must be public when listed in the directory.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Beta features",
    disabled: true,
    hint: "Available on Pro plan.",
  },
};

export const DisabledOn: Story = {
  args: {
    label: "Enrolled in beta program",
    disabled: true,
    defaultChecked: true,
  },
};

/** A short settings panel — the typical Switch use case. Stack of
 *  toggles, each with a hint, mixing on / off / disabled states. */
export const SettingsPanel: Story = {
  render: () => (
    <Stack gap="medium">
      <SwitchField
        label="Email notifications"
        hint="Get an email when someone mentions you."
        defaultChecked
      />
      <SwitchField
        label="Push notifications"
        hint="Real-time alerts on your devices."
      />
      <SwitchField
        label="Weekly digest"
        hint="A summary every Monday morning."
        defaultChecked
      />
      <SwitchField
        label="Beta features"
        hint="Available on Pro plan."
        disabled
      />
    </Stack>
  ),
};
