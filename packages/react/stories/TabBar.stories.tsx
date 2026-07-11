import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TabBar } from "../src/components/TabBar/TabBar";
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

const meta: Meta<typeof TabBar> = {
  title: "Components/TabBar",
  component: TabBar,
};

export default meta;
type Story = StoryObj<typeof TabBar>;

/** The composed bar — surface, elevation shadow, and centered items all come
 *  from the tab-bar tokens. Click around to see that the bold active label
 *  never shifts its neighbours. */
export const Default: Story = {
  render: () => {
    const items = [
      { label: "Home", icon: <HomeIcon /> },
      { label: "Search", icon: <SearchIcon /> },
      { label: "Favourites", icon: <HeartIcon /> },
      { label: "Profile", icon: <ProfileIcon /> },
    ];
    const [activeIndex, setActiveIndex] = useState(0);
    return (
      <div style={{ maxWidth: 420, paddingTop: 48 }}>
        <TabBar>
          {items.map((item, i) => (
            <TabBarButton
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={i === activeIndex}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </TabBar>
      </div>
    );
  },
};
