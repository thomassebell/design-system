import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/shared";
import styles from "./Button.module.css";

export type ButtonVariant = "solid" | "outline" | "ghost" | "danger";

/** Component size — design-driven, independent of the system's
 *  density mode. "regular" is the default; "dense" is tighter for
 *  toolbars, table rows, and dense forms. Both still respond to
 *  density (Default ↔ Compact) automatically. */
export type ButtonSize = "regular" | "dense";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon rendered before the label. Decorative — pass an `<Icon>` or any ReactNode. */
  startIcon?: ReactNode;
  /** Icon rendered after the label. Decorative — pass an `<Icon>` or any ReactNode. */
  endIcon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "solid",
      size = "regular",
      startIcon,
      endIcon,
      fullWidth = false,
      loading = false,
      disabled,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cx(
          styles.button,
          styles[size],
          styles[variant],
          fullWidth && styles.fullWidth,
          loading && styles.loading,
          className
        )}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...rest}
      >
        {loading && <span className={styles.spinner} aria-hidden="true" />}
        {startIcon && (
          <span
            className={cx(styles.icon, styles.iconStart, loading && styles.hidden)}
            aria-hidden="true"
          >
            {startIcon}
          </span>
        )}
        <span className={cx(loading && styles.hidden)}>{children}</span>
        {endIcon && (
          <span
            className={cx(styles.icon, styles.iconEnd, loading && styles.hidden)}
            aria-hidden="true"
          >
            {endIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
