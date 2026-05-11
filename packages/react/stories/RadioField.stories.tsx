import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioField } from "../src/components/RadioField/RadioField";

const meta: Meta<typeof RadioField> = {
  title: "Components/RadioField",
  component: RadioField,
  argTypes: {
    label: { control: "text" },
    hint: { control: "text" },
    error: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof RadioField>;

export const Default: Story = {
  args: {
    name: "demo",
    label: "Standard plan",
  },
};

export const WithHint: Story = {
  args: {
    name: "demo",
    label: "Standard plan",
    hint: "All the basics, $10 / month.",
  },
};

export const WithError: Story = {
  args: {
    name: "demo",
    label: "Accept the terms",
    error: "Please choose an option to continue.",
  },
};

export const Checked: Story = {
  args: {
    name: "demo",
    label: "Pro plan",
    defaultChecked: true,
    hint: "Everything in Standard plus advanced analytics.",
  },
};

export const Disabled: Story = {
  args: {
    name: "demo",
    label: "Enterprise plan",
    hint: "Available on annual contract — talk to sales.",
    disabled: true,
  },
};
