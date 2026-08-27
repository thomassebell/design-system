import type { Meta, StoryObj } from "@storybook/react-vite";
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
      options: ["solid", "outline", "danger", "text"],
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

export const Danger: Story = {
  args: { children: "Delete", variant: "danger" },
};

/** Text variant: nav-link aesthetic — transparent background, brand-coloured
 *  underline, no padding. Use for tertiary actions or contextual nav. */
export const Text: Story = {
  args: { children: "Read more", variant: "text" },
};

export const Loading: Story = {
  args: { children: "Saving…", loading: true },
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

/** The text variant renders its icons at 16px (all other variants use
 *  24px) and without the optical bleed – matching the Figma design. */
export const TextWithIcons: Story = {
  args: {
    children: "Read more",
    variant: "text",
    startIcon: <PlusIcon />,
    endIcon: <ChevronRightIcon />,
  },
};

/** Icons across all variants — visual reference. */
export const IconsMatrix: Story = {
  render: () => (
    <Stack direction="row" gap="small" align="center">
      <Button variant="solid" startIcon={<PlusIcon />}>Add</Button>
      <Button variant="outline" startIcon={<PlusIcon />}>Add</Button>
      <Button variant="danger" startIcon={<PlusIcon />}>Delete</Button>
    </Stack>
  ),
};

/** A call to action that navigates is an `<a>`, not a `<button>` – set the
 *  element with `as` and the styling is unchanged. On a marketing or share
 *  surface most buttons are links, so this is the common case, not the exotic
 *  one. `href` is accepted because the props follow the element. */
export const AsLink: Story = {
  render: () => (
    <Stack direction="row" gap="small" align="center">
      <Button as="a" href="https://example.com" variant="solid">
        Get the app
      </Button>
      <Button as="a" href="https://example.com" variant="outline">
        Open the recipe
      </Button>
      <Button as="a" href="https://example.com" variant="text" endIcon={<ChevronRightIcon />}>
        Read more
      </Button>
    </Stack>
  ),
};

/** A disabled link. `disabled` is a `<button>` attribute and means nothing on
 *  an anchor, so the state is expressed as `aria-disabled` with the `href`
 *  removed – a faded link that still navigated would be the worse bug. */
export const AsDisabledLink: Story = {
  render: () => (
    <Stack direction="row" gap="small" align="center">
      <Button as="a" href="https://example.com" variant="solid" disabled>
        Get the app
      </Button>
      <Button as="a" href="https://example.com" variant="outline" disabled>
        Open the recipe
      </Button>
    </Stack>
  ),
};
