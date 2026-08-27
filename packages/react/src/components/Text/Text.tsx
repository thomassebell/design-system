import { forwardRef, type ElementType, type HTMLAttributes } from "react";
import { cx } from "../../utils/shared";
import styles from "./Text.module.css";

/**
 * One variant per step of the type ramp — nothing more.
 *
 * A variant is a *style* (size + family + line-height + default weight). It
 * says nothing about the document outline: `display1` is not an `<h1>`, and a
 * page's `<h1>` is free to be `display6`. Set the element with `as`.
 */
export type TextVariant =
  | "display1"
  | "display2"
  | "display3"
  | "display4"
  | "display5"
  | "display6"
  | "body"
  | "bodySmall";

/** The three weight slots the token layer provides. */
export type TextWeight = "understate" | "default" | "emphasized";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Type style: size, family, line-height. Carries no element semantics. */
  variant?: TextVariant;
  /**
   * The element to render. Defaults to `<p>` for every variant — heading
   * level is a document-structure decision, so it is always explicit:
   * `<Text variant="display6" as="h1">`.
   */
  as?: ElementType;
  /** Override the variant's default weight for the whole block. */
  weight?: TextWeight;
  /** Muted secondary color. */
  muted?: boolean;
  /** Truncate with ellipsis after this many lines (1–3). */
  truncate?: 1 | 2 | 3;
  /** Text alignment. */
  align?: "left" | "center" | "right";
}

const weightClass: Record<TextWeight, string> = {
  understate: styles.weightUnderstate,
  default: styles.weightDefault,
  emphasized: styles.weightEmphasized,
};

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      variant = "body",
      as,
      weight,
      muted = false,
      truncate,
      align,
      className,
      style,
      children,
      ...rest
    },
    ref
  ) => {
    const Component = as ?? "p";

    return (
      <Component
        ref={ref}
        className={cx(
          styles.text,
          styles[variant],
          weight && weightClass[weight],
          muted && styles.muted,
          truncate && styles[`truncate${truncate}`],
          align && styles[`align${align}`],
          className
        )}
        style={style}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = "Text";
