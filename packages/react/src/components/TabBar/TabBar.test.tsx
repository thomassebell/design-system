import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TabBar } from "./TabBar";
import { TabBarButton } from "../TabBarButton/TabBarButton";
import { Icon } from "../Icon/Icon";

const HomeIcon = () => (
  <Icon size="lg">
    <path d="M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z" />
  </Icon>
);

describe("TabBar", () => {
  it("renders a navigation landmark with a default accessible name", () => {
    render(
      <TabBar>
        <TabBarButton icon={<HomeIcon />} label="Home" />
      </TabBar>
    );
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
  });

  it("accepts a custom accessible name", () => {
    render(
      <TabBar aria-label="Bottom navigation">
        <TabBarButton icon={<HomeIcon />} label="Home" />
      </TabBar>
    );
    expect(
      screen.getByRole("navigation", { name: "Bottom navigation" })
    ).toBeInTheDocument();
  });

  it("renders its items", () => {
    render(
      <TabBar>
        <TabBarButton icon={<HomeIcon />} label="Home" active />
        <TabBarButton icon={<HomeIcon />} label="Search" />
      </TabBar>
    );
    expect(screen.getByRole("button", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });
});
