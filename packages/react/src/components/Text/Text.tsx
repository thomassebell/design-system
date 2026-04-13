import { forwardRef, type ElementType, type HTMLAttributes } from "react";
import { cx, type Size } from "../utils/shared";
import styles from "./Text.module.css";

export type TextVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body"
  | "bodySmall"
  | "caption"
  | "overline";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Typographic variant controlling size, weight, and line-height. */
  variant?: TextVariant;
  /** Render as a different HTML element. */
  as?: ElementType;
  /** Muted secondary color. */
  muted?: boolean;
  /** Truncate with ellipsis after this many lines (1–3). */
  truncate?: 1 | 2 | 3;
  /** Text alignment. */
  align?: "left" | "center" | "right";
}

const defaultElement: Record<TextVariant, ElementType> = {
  display: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",
  bodySmall: "p",
  caption: "span",
  overline: "span",
};

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      variant = "body",
      as,
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
    const Component = as ?? defaultElement[variant];

    return (
      <Component
        ref={ref}
        className={cx(
          styles.text,
          styles[variant],
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
