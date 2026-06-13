import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/shared";
import styles from "./IconButton.module.css";

/** Icon-only sibling of Button. Same surface treatments, minus the "text"
 *  variant — an underlined link aesthetic has no meaning for a centered
 *  icon with no label. */
export type IconButtonVariant = "solid" | "outline" | "danger";

/** Component size — design-driven, independent of the system's density
 *  mode. "regular" is the default; "dense" is tighter for toolbars, table
 *  rows, and dense forms. Both still respond to density automatically. */
export type IconButtonSize = "regular" | "dense";

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size" | "children"> {
  /** The icon to render, centered. Pass an `<Icon>` or any ReactNode. */
  icon: ReactNode;
  /** Accessible name for the button. Required — an icon-only control has no
   *  visible text, so screen readers rely on this. Becomes `aria-label`. */
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      label,
      variant = "solid",
      size = "regular",
      loading = false,
      disabled,
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cx(
          styles.iconButton,
          styles[size],
          styles[variant],
          loading && styles.loading,
          className
        )}
        disabled={disabled || loading}
        aria-label={label}
        aria-busy={loading || undefined}
        {...rest}
      >
        {loading && <span className={styles.spinner} aria-hidden="true" />}
        <span className={cx(styles.icon, loading && styles.hidden)} aria-hidden="true">
          {icon}
        </span>
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
