import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../src/components/Input/Input";
import { Icon } from "../src/components/Icon/Icon";

/** A small inline search-glass icon used in the example stories. */
const SearchIcon = () => (
  <Icon size="sm">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </Icon>
);

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    label: { control: "text" },
    hint: { control: "text" },
    error: { control: "text" },
    placeholder: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
  },
};

export const WithHint: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "••••••••",
    hint: "At least 8 characters.",
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
    defaultValue: "not-an-email",
    error: "Please enter a valid email address.",
  },
};

export const Small: Story = {
  args: { size: "sm", label: "Small", placeholder: "Small input" },
};

export const Medium: Story = {
  args: { size: "md", label: "Medium", placeholder: "Medium input" },
};

export const Large: Story = {
  args: { size: "lg", label: "Large", placeholder: "Large input" },
};

export const WithLeadingIcon: Story = {
  args: {
    label: "Search",
    placeholder: "Search…",
    leadingIcon: <SearchIcon />,
  },
};

export const Disabled: Story = {
  args: {
    label: "Username",
    placeholder: "Disabled",
    disabled: true,
  },
};

export const NoLabel: Story = {
  args: { placeholder: "No label, just a placeholder" },
};
