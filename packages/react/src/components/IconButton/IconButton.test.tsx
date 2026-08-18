import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IconButton } from "./IconButton";
import { Icon } from "../Icon/Icon";

const PlusIcon = () => (
  <Icon size="lg">
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

describe("IconButton", () => {
  it("exposes its label as the accessible name", () => {
    render(<IconButton icon={<PlusIcon />} label="Add item" />);
    expect(screen.getByRole("button", { name: "Add item" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<IconButton icon={<PlusIcon />} label="Add" onClick={onClick} />);

    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<IconButton icon={<PlusIcon />} label="Add" onClick={onClick} disabled />);

    await user.click(screen.getByRole("button"));

    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not fire onClick while loading and exposes aria-busy", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<IconButton icon={<PlusIcon />} label="Saving" onClick={onClick} loading />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("applies the variant class — solid by default", () => {
    const { rerender } = render(<IconButton icon={<PlusIcon />} label="Add" />);
    expect(screen.getByRole("button")).toHaveClass("solid");

    rerender(<IconButton icon={<PlusIcon />} label="Delete" variant="danger" />);
    expect(screen.getByRole("button")).toHaveClass("danger");
  });

  it("forwards additional props to the underlying <button>", () => {
    render(
      <IconButton icon={<PlusIcon />} label="Submit" data-testid="my-button" type="submit" />,
    );
    const btn = screen.getByTestId("my-button");
    expect(btn).toHaveAttribute("type", "submit");
  });

  it("forwards refs to the underlying button element", () => {
    let captured: HTMLButtonElement | null = null;
    render(
      <IconButton
        icon={<PlusIcon />}
        label="Ref"
        ref={(el) => {
          captured = el;
        }}
      />,
    );
    expect(captured).toBeInstanceOf(HTMLButtonElement);
  });

  it("renders an anchor with a working href when as=\"a\"", () => {
    render(<IconButton as="a" href="/home" icon={<svg />} label="Home" />);
    const link = screen.getByRole("link", { name: "Home" });
    expect(link).toBeInstanceOf(HTMLAnchorElement);
    expect(link).toHaveAttribute("href", "/home");
    expect(link).not.toHaveAttribute("as");
  });

  it("strips href and does not fire onClick on a disabled anchor", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <IconButton
        as="a"
        href="/home"
        onClick={onClick}
        disabled
        icon={<svg />}
        label="Home"
      />,
    );

    const link = screen.getByLabelText("Home");
    await user.click(link);

    expect(onClick).not.toHaveBeenCalled();
    expect(link).not.toHaveAttribute("href");
    expect(link).toHaveAttribute("aria-disabled", "true");
  });
});
