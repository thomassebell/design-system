import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "../src/components/Input/Input";
import { Button } from "../src/components/Button/Button";
import { Icon } from "../src/components/Icon/Icon";
import { Stack } from "../src/components/Stack/Stack";

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
    disabled: { control: "boolean" },
    readOnly: { control: "boolean" },
    label: { control: "text" },
    hint: { control: "text" },
    error: { control: "text" },
    prefix: { control: "text" },
    suffix: { control: "text" },
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

/** Hint sits between the label and the input, lighter at rest and
 *  promoting to primary text colour on hover/focus. */
export const WithHint: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "••••••••",
    hint: "At least 8 characters.",
  },
};

/** Error renders as a pink banner above the input with an inline
 *  error icon. The label turns red and the input border thickens to
 *  2px in error red. Hint is hidden in this state. */
export const WithError: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
    defaultValue: "not-an-email",
    error:
      "Error messages should not only inform your users about the problem, but also guide them towards a solution. Please use plainspoken and readable text.",
  },
};

export const WithStartIcon: Story = {
  args: {
    label: "Search",
    placeholder: "Search…",
    startIcon: <SearchIcon />,
  },
};

/** Prefix shows a static text snippet before the value — useful for
 *  fixed protocol or unit indicators. */
export const WithPrefix: Story = {
  args: {
    label: "Website",
    prefix: "https://",
    placeholder: "your-domain.com",
  },
};

/** Suffix shows a static text snippet after the value — useful for
 *  units (kg, %, ms) or fixed extensions. */
export const WithSuffix: Story = {
  args: {
    label: "Weight",
    suffix: "kg",
    placeholder: "0",
    type: "number",
  },
};

/** Both prefix and suffix together — e.g. a price field with currency
 *  on the left and unit on the right. */
export const WithPrefixAndSuffix: Story = {
  args: {
    label: "Price per item",
    prefix: "$",
    suffix: "/ unit",
    placeholder: "0.00",
  },
};

/** Read-only — the value is visible but not editable. Distinct from
 *  disabled: no opacity dim, just a subdued grey border. */
export const ReadOnly: Story = {
  args: {
    label: "Account ID",
    defaultValue: "acc_8f2nq31q",
    hint: "Generated automatically — cannot be changed.",
    readOnly: true,
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

/** Input paired with a Button — they should line up at exactly the
 *  same height. Toggle Density and they tighten together. */
export const HeightMatchesButton: Story = {
  render: () => (
    <Stack direction="row" gap="small" align="end">
      <div style={{ flex: 1 }}>
        <Input label="Email" placeholder="you@example.com" />
      </div>
      <Button>Subscribe</Button>
    </Stack>
  ),
};

/** All states stacked side-by-side — a quick reference for designers
 *  comparing Storybook against Figma. */
export const AllStates: Story = {
  render: () => (
    <Stack gap="medium">
      <Input label="Default" placeholder="Type here…" />
      <Input
        label="With hint"
        placeholder="Type here…"
        hint="A short helper sentence."
      />
      <Input
        label="Read-only"
        defaultValue="Read-only value"
        readOnly
      />
      <Input label="Disabled" placeholder="Cannot interact" disabled />
      <Input
        label="Error"
        defaultValue="bad@@"
        error="Please enter a valid email address."
      />
    </Stack>
  ),
};
