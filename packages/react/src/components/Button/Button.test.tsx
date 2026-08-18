import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders its label", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Save
      </Button>,
    );

    await user.click(screen.getByRole("button"));

    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not fire onClick while loading and exposes aria-busy", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} loading>
        Saving…
      </Button>,
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("applies the variant class", () => {
    render(<Button variant="danger">Delete</Button>);
    expect(screen.getByRole("button")).toHaveClass("danger");
  });

  it("applies fullWidth class when the prop is set", () => {
    render(<Button fullWidth>Wide</Button>);
    expect(screen.getByRole("button")).toHaveClass("fullWidth");
  });

  it("forwards additional props to the underlying <button>", () => {
    render(
      <Button data-testid="my-button" type="submit">
        Submit
      </Button>,
    );
    const btn = screen.getByTestId("my-button");
    expect(btn).toHaveAttribute("type", "submit");
  });

  it("forwards refs to the underlying button element", () => {
    let captured: HTMLButtonElement | null = null;
    render(
      <Button
        ref={(el) => {
          captured = el;
        }}
      >
        Ref
      </Button>,
    );
    expect(captured).toBeInstanceOf(HTMLButtonElement);
  });

  it("hides label visually while loading but keeps it readable to assistive tech", () => {
    render(<Button loading>Saving…</Button>);
    // The label is wrapped in a span with the .hiddenLabel class so the spinner
    // can take its visual place. The text is still in the DOM and accessible.
    expect(screen.getByRole("button", { name: "Saving…" })).toBeInTheDocument();
  });

  it("renders an anchor with a working href when as=\"a\"", () => {
    render(
      <Button as="a" href="https://example.com">
        Get the app
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Get the app" });
    expect(link).toBeInstanceOf(HTMLAnchorElement);
    expect(link).toHaveAttribute("href", "https://example.com");
    // The style is the same style – only the element changed.
    expect(link).toHaveClass("button");
    expect(link).toHaveClass("solid");
    // `as` must be consumed, not leaked onto the DOM.
    expect(link).not.toHaveAttribute("as");
  });

  it("strips href and does not fire onClick on a disabled anchor", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button as="a" href="https://example.com" onClick={onClick} disabled>
        Get the app
      </Button>,
    );

    const link = screen.getByText("Get the app").closest("a")!;
    await user.click(link);

    expect(onClick).not.toHaveBeenCalled();
    expect(link).not.toHaveAttribute("href");
    expect(link).toHaveAttribute("aria-disabled", "true");
  });

  it("forwards refs to the anchor element when as=\"a\"", () => {
    let captured: HTMLAnchorElement | null = null;
    render(
      <Button
        as="a"
        href="https://example.com"
        ref={(el: HTMLAnchorElement | null) => {
          captured = el;
        }}
      >
        Ref
      </Button>,
    );
    expect(captured).toBeInstanceOf(HTMLAnchorElement);
  });
});
