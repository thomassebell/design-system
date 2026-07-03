import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TabBarButton } from "./TabBarButton";
import { Icon } from "../Icon/Icon";

const HomeIcon = () => (
  <Icon size="lg">
    <path d="M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z" />
  </Icon>
);

describe("TabBarButton", () => {
  it("exposes its label as the accessible name", () => {
    render(<TabBarButton icon={<HomeIcon />} label="Home" />);
    expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
  });

  it("marks the active item as the current page", () => {
    render(<TabBarButton icon={<HomeIcon />} label="Home" active />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-current", "page");
  });

  it("does not set aria-current when inactive", () => {
    render(<TabBarButton icon={<HomeIcon />} label="Home" />);
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-current");
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<TabBarButton icon={<HomeIcon />} label="Home" onClick={onClick} />);

    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <TabBarButton icon={<HomeIcon />} label="Home" onClick={onClick} disabled />
    );

    await user.click(screen.getByRole("button"));

    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("carries the label into the bold-width ghost", () => {
    render(<TabBarButton icon={<HomeIcon />} label="Recipes" />);
    // The CSS ghost reads attr(data-label); without it the active bold weight
    // would widen the item and shift its neighbours.
    expect(screen.getByText("Recipes")).toHaveAttribute("data-label", "Recipes");
  });
});
