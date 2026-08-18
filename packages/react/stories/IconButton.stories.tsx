import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton } from "../src/components/IconButton/IconButton";
import { Stack } from "../src/components/Stack/Stack";
import { Icon } from "../src/components/Icon/Icon";

/** Plus icon — the icon used in the Figma design. */
const PlusIcon = () => (
  <Icon size="lg">
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

/** Trash icon — pairs naturally with the danger variant. */
const TrashIcon = () => (
  <Icon size="lg">
    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
  </Icon>
);

const meta: Meta<typeof IconButton> = {
  title: "Components/IconButton",
  component: IconButton,
  args: {
    icon: <PlusIcon />,
    label: "Add item",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "outline", "danger"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    // icon / label are set via args above; hide the raw controls.
    icon: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Solid: Story = {
  args: { variant: "solid" },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Danger: Story = {
  args: { variant: "danger", icon: <TrashIcon />, label: "Delete" },
};

export const Loading: Story = {
  args: { loading: true, label: "Saving" },
};

/** All variants — visual reference. */
export const Matrix: Story = {
  render: () => (
    <Stack direction="row" gap="small" align="center">
      <IconButton icon={<PlusIcon />} label="Add" variant="solid" />
      <IconButton icon={<PlusIcon />} label="Add" variant="outline" />
      <IconButton icon={<TrashIcon />} label="Delete" variant="danger" />
    </Stack>
  ),
};

/** An icon-only control is as often a navigation as an action – a logo home
 *  link, a social icon. Same `as` prop as `Button`, same reasoning. */
export const AsLink: Story = {
  render: () => (
    <Stack direction="row" gap="small" align="center">
      <IconButton as="a" href="https://example.com" icon={<PlusIcon />} label="Add" />
      <IconButton
        as="a"
        href="https://example.com"
        icon={<PlusIcon />}
        label="Add"
        variant="outline"
      />
      <IconButton
        as="a"
        href="https://example.com"
        icon={<PlusIcon />}
        label="Add"
        variant="outline"
        disabled
      />
    </Stack>
  ),
};
