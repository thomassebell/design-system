import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../utils/shared";
import styles from "./Stack.module.css";

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** Layout direction. */
  direction?: "row" | "column";
  /** Gap between children — maps to your spacing tokens (1–20). */
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20;
  /** Cross-axis alignment. */
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  /** Main-axis alignment. */
  justify?: "start" | "center" | "end" | "between" | "around";
  /** Allow wrapping. */
  wrap?: boolean;
  /** Render as a different HTML element (e.g. "nav", "ul"). */
  as?: React.ElementType;
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      direction = "column",
      gap = 4,
      align,
      justify,
      wrap = false,
      as: Component = "div",
      className,
      style,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cx(styles.stack, className)}
        style={
          {
            "--stack-direction": direction,
            "--stack-gap": `var(--spacing-${gap})`,
            "--stack-align": align ?? "stretch",
            "--stack-justify":
              justify === "between"
                ? "space-between"
                : justify === "around"
                  ? "space-around"
                  : justify
                    ? `flex-${justify}`
                    : "flex-start",
            "--stack-wrap": wrap ? "wrap" : "nowrap",
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

Stack.displayName = "Stack";
