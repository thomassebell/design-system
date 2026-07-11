import type { Meta, StoryObj } from "@storybook/react-vite";
import { TabBarButton } from "../src/components/TabBarButton/TabBarButton";
import { Icon } from "../src/components/Icon/Icon";

const HomeIcon = () => (
  <Icon size="lg">
    <path d="M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z" />
  </Icon>
);

const meta: Meta<typeof TabBarButton> = {
  title: "Components/TabBarButton",
  component: TabBarButton,
  args: {
    icon: <HomeIcon />,
    label: "Home",
  },
  argTypes: {
    active: { control: "boolean" },
    disabled: { control: "boolean" },
    icon: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof TabBarButton>;

export const Inactive: Story = {};

export const Active: Story = {
  args: { active: true },
};

/* The composed bar lives in the TabBar story — see Components/TabBar. */
