import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/shared";
import styles from "./Chip.module.css";

export type ChipVariant = "solid" | "outline";

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ChipVariant;
  /** Selected state of the toggle. Announced via `aria-pressed`. */
  active?: boolean;
  /** Icon rendered before the label. Decorative – pass an `<Icon>` or any ReactNode. */
  startIcon?: ReactNode;
  /** Icon rendered after the label. Decorative – pass an `<Icon>` or any ReactNode. */
  endIcon?: ReactNode;
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      variant = "solid",
      active = false,
      startIcon,
      endIcon,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cx(
          styles.chip,
          styles[variant],
          active && styles.active,
          className
        )}
        aria-pressed={active}
        {...rest}
      >
        {startIcon && (
          <span className={styles.icon} aria-hidden="true">
            {startIcon}
          </span>
        )}
        <span>{children}</span>
        {endIcon && (
          <span className={styles.icon} aria-hidden="true">
            {endIcon}
          </span>
        )}
      </button>
    );
  }
);

Chip.displayName = "Chip";
