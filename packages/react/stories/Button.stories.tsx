import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../src/components/Button/Button";
import { Stack } from "../src/components/Stack/Stack";
import { Icon } from "../src/components/Icon/Icon";

/** Plus icon — used as a leading icon in stories below. */
const PlusIcon = () => (
  <Icon size="lg">
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

/** Chevron-right — used as a trailing icon. */
const ChevronRightIcon = () => (
  <Icon size="lg">
    <path d="M9 6l6 6-6 6" />
  </Icon>
);

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "outline", "ghost", "danger"],
    },
    size: {
      control: "select",
      options: ["regular", "dense"],
    },
    fullWidth: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Solid: Story = {
  args: { children: "Button", variant: "solid" },
};

export const Outline: Story = {
  args: { children: "Button", variant: "outline" },
};

export const Ghost: Story = {
  args: { children: "Button", variant: "ghost" },
};

export const Danger: Story = {
  args: { children: "Delete", variant: "danger" },
};

export const Loading: Story = {
  args: { children: "Saving…", loading: true },
};

/** Both sizes side-by-side. Toggle Density to see each tighten further. */
export const Sizes: Story = {
  render: () => (
    <Stack direction="row" gap="small" align="center">
      <Button size="regular">Regular</Button>
      <Button size="dense">Dense</Button>
    </Stack>
  ),
};

/** Dense variant on its own — for toolbars, table actions, dense forms. */
export const Dense: Story = {
  args: { children: "Dense", size: "dense" },
};

/* ── Icons ──────────────────────────────────── */

export const WithStartIcon: Story = {
  args: {
    children: "Add item",
    variant: "solid",
    startIcon: <PlusIcon />,
  },
};

export const WithEndIcon: Story = {
  args: {
    children: "Continue",
    variant: "solid",
    endIcon: <ChevronRightIcon />,
  },
};

export const WithBothIcons: Story = {
  args: {
    children: "Add and continue",
    variant: "solid",
    startIcon: <PlusIcon />,
    endIcon: <ChevronRightIcon />,
  },
};

/** Icons across all variants × sizes — visual reference. */
export const IconsMatrix: Story = {
  render: () => (
    <Stack direction="column" gap="small">
      <Stack direction="row" gap="small" align="center">
        <Button variant="solid" startIcon={<PlusIcon />}>Add</Button>
        <Button variant="outline" startIcon={<PlusIcon />}>Add</Button>
        <Button variant="ghost" startIcon={<PlusIcon />}>Add</Button>
        <Button variant="danger" startIcon={<PlusIcon />}>Delete</Button>
      </Stack>
      <Stack direction="row" gap="small" align="center">
        <Button size="dense" variant="solid" startIcon={<PlusIcon />}>Add</Button>
        <Button size="dense" variant="outline" startIcon={<PlusIcon />}>Add</Button>
        <Button size="dense" variant="ghost" startIcon={<PlusIcon />}>Add</Button>
        <Button size="dense" variant="danger" startIcon={<PlusIcon />}>Delete</Button>
      </Stack>
    </Stack>
  ),
};
