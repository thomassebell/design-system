import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxGroup } from "../src/components/CheckboxGroup/CheckboxGroup";
import { CheckboxField } from "../src/components/CheckboxField/CheckboxField";

const meta: Meta<typeof CheckboxGroup> = {
  title: "Components/CheckboxGroup",
  component: CheckboxGroup,
  argTypes: {
    legend: { control: "text" },
    description: { control: "text" },
    error: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof CheckboxGroup>;

export const Default: Story = {
  args: {
    legend: "Notification preferences",
    children: (
      <>
        <CheckboxField label="Email" />
        <CheckboxField label="SMS" />
        <CheckboxField label="Push notifications" />
      </>
    ),
  },
};

export const WithDescription: Story = {
  args: {
    legend: "Notification preferences",
    description: "We'll only send you what you ask for.",
    children: (
      <>
        <CheckboxField label="Email" defaultChecked />
        <CheckboxField label="SMS" />
        <CheckboxField label="Push notifications" defaultChecked />
      </>
    ),
  },
};

export const WithError: Story = {
  args: {
    legend: "Topics you're interested in",
    description: "Pick at least one so we know what to send you.",
    error:
      "Error messages should not only inform your users about the problem, but also guide them towards a solution. Please use plainspoken and readable text.",
    children: (
      <>
        <CheckboxField label="Product updates" />
        <CheckboxField label="Engineering blog" />
        <CheckboxField label="Company news" />
      </>
    ),
  },
};

export const PerFieldHints: Story = {
  args: {
    legend: "Account permissions",
    description: "Choose what this member can do.",
    children: (
      <>
        <CheckboxField
          label="Manage billing"
          hint="View invoices and update the payment method."
          defaultChecked
        />
        <CheckboxField
          label="Manage members"
          hint="Invite, remove, and change member roles."
        />
        <CheckboxField
          label="Manage integrations"
          hint="Connect or disconnect third-party services."
        />
      </>
    ),
  },
};

export const Mixed: Story = {
  args: {
    legend: "Email subscriptions",
    description: "You can change these anytime in settings.",
    children: (
      <>
        <CheckboxField
          label="Weekly digest"
          hint="Every Monday morning."
          defaultChecked
        />
        <CheckboxField
          label="Product updates"
          hint="When we ship new features."
        />
        <CheckboxField
          label="Marketing"
          hint="Tips, case studies, occasional offers."
          disabled
        />
      </>
    ),
  },
};
