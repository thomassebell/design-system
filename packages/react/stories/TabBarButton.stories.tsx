import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TabBarButton } from "../src/components/TabBarButton/TabBarButton";
import { Icon } from "../src/components/Icon/Icon";

const HomeIcon = () => (
  <Icon size="lg">
    <path d="M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z" />
  </Icon>
);

const SearchIcon = () => (
  <Icon size="lg">
    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </Icon>
);

const HeartIcon = () => (
  <Icon size="lg">
    <path d="M12 21s-7.5-4.9-9.5-9.5C1.2 8.4 3.3 5 6.7 5c2 0 3.6 1.1 4.3 2.7h2C13.7 6.1 15.3 5 17.3 5c3.4 0 5.5 3.4 4.2 6.5C19.5 16.1 12 21 12 21z" />
  </Icon>
);

const ProfileIcon = () => (
  <Icon size="lg">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
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

/** A full bar composed from items — this is how apps will use the component.
 *  The bar chrome itself reads the same tab-bar tokens; click around to see
 *  that the bold active label never shifts its neighbours. */
export const InABar: Story = {
  render: () => {
    const items = [
      { label: "Home", icon: <HomeIcon /> },
      { label: "Search", icon: <SearchIcon /> },
      { label: "Favourites", icon: <HeartIcon /> },
      { label: "Profile", icon: <ProfileIcon /> },
    ];
    const [activeIndex, setActiveIndex] = useState(0);
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          maxWidth: 420,
          background: "var(--tab-bar-surface)",
          borderTop: "1px solid var(--tab-bar-border)",
        }}
      >
        {items.map((item, i) => (
          <TabBarButton
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={i === activeIndex}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>
    );
  },
};
