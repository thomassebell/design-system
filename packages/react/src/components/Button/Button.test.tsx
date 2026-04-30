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

  it("applies the size class — regular by default, dense when set", () => {
    const { rerender } = render(<Button>Default</Button>);
    expect(screen.getByRole("button")).toHaveClass("regular");

    rerender(<Button size="dense">Dense</Button>);
    expect(screen.getByRole("button")).toHaveClass("dense");
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
});
