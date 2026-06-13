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
    size: {
      control: "select",
      options: ["regular", "dense"],
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

/** Both sizes side-by-side. Toggle Density to see each tighten further. */
export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" gap="small" align="center">
      <IconButton {...args} size="regular" />
      <IconButton {...args} size="dense" />
    </Stack>
  ),
};

/** Dense variant on its own — for toolbars, table actions, dense forms. */
export const Dense: Story = {
  args: { size: "dense" },
};

/** All variants × sizes — visual reference. */
export const Matrix: Story = {
  render: () => (
    <Stack direction="column" gap="small">
      <Stack direction="row" gap="small" align="center">
        <IconButton icon={<PlusIcon />} label="Add" variant="solid" />
        <IconButton icon={<PlusIcon />} label="Add" variant="outline" />
        <IconButton icon={<TrashIcon />} label="Delete" variant="danger" />
      </Stack>
      <Stack direction="row" gap="small" align="center">
        <IconButton icon={<PlusIcon />} label="Add" variant="solid" size="dense" />
        <IconButton icon={<PlusIcon />} label="Add" variant="outline" size="dense" />
        <IconButton icon={<TrashIcon />} label="Delete" variant="danger" size="dense" />
      </Stack>
    </Stack>
  ),
};
