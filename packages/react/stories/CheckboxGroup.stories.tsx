import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxGroup } from "../src/components/CheckboxGroup/CheckboxGroup";
import { CheckboxField } from "../src/components/CheckboxField/CheckboxField";

const meta: Meta<typeof CheckboxGroup> = {
  title: "Components/CheckboxGroup",
  component: CheckboxGroup,
  argTypes: {
    legend: { control: "text" },
    hint: { control: "text" },
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

export const WithHint: Story = {
  args: {
    legend: "Notification preferences",
    hint: "We'll only send you what you ask for.",
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
    error: "Please select at least one topic.",
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

export const Dense: Story = {
  args: {
    legend: "Filters",
    children: (
      <>
        <CheckboxField size="dense" label="In stock" defaultChecked />
        <CheckboxField size="dense" label="On sale" />
        <CheckboxField size="dense" label="Free shipping" />
        <CheckboxField size="dense" label="Same-day delivery" />
      </>
    ),
  },
};

export const Mixed: Story = {
  args: {
    legend: "Email subscriptions",
    hint: "You can change these anytime in settings.",
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
