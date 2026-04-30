import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../utils/shared";
import styles from "./Stack.module.css";

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** Layout direction. */
  direction?: "row" | "column";
  /** Gap between children — maps to a primitive size token in pixels.
      Allowed values are the values that exist in primitive.size.* in the
      Figma export (0 / 2 / 4 / 6 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48). */
  gap?: 0 | 2 | 4 | 6 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48;
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
            "--stack-gap": `var(--primitive-size-${gap})`,
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
