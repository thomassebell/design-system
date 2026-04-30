import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../../utils/shared";
import styles from "./Stack.module.css";

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** Layout direction. */
  direction?: "row" | "column";
  /** Gap between children — maps to a semantic layout token, so it
      changes with the active density mode (Default vs Compact). */
  gap?:
    | "xxsmall"
    | "xsmall"
    | "small"
    | "medium"
    | "large"
    | "xlarge"
    | "xxlarge";
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
      gap = "medium",
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
            "--stack-gap": `var(--semantic-layout-${gap})`,
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
