import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/shared";
import styles from "./TabBarButton.module.css";

export interface TabBarButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** The icon to render above the label. Pass an `<Icon>` or any ReactNode. */
  icon: ReactNode;
  /** Visible label under the icon. Doubles as the accessible name. */
  label: string;
  /** Marks this item as the current destination (`aria-current="page"`). */
  active?: boolean;
}

export const TabBarButton = forwardRef<HTMLButtonElement, TabBarButtonProps>(
  ({ icon, label, active = false, className, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={cx(styles.tabBarButton, active && styles.active, className)}
        aria-current={active ? "page" : undefined}
        {...rest}
      >
        <span className={styles.indicator} aria-hidden="true" />
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
        {/* data-label feeds the CSS ghost that reserves the bold width. */}
        <span className={styles.label} data-label={label}>
          {label}
        </span>
      </button>
    );
  }
);

TabBarButton.displayName = "TabBarButton";
