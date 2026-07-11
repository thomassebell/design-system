import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/shared";
import styles from "./TabBar.module.css";

export interface TabBarProps extends HTMLAttributes<HTMLElement> {
  /** The bar's items — usually a set of `<TabBarButton>`s. */
  children: ReactNode;
  /** Accessible name for the navigation landmark. */
  "aria-label"?: string;
}

/** The bottom tab bar chrome. Renders a `<nav>` landmark so the active
 *  item's `aria-current="page"` reads naturally to assistive tech. */
export const TabBar = forwardRef<HTMLElement, TabBarProps>(
  ({ children, className, "aria-label": ariaLabel = "Main", ...rest }, ref) => {
    return (
      <nav
        ref={ref}
        className={cx(styles.tabBar, className)}
        aria-label={ariaLabel}
        {...rest}
      >
        {children}
      </nav>
    );
  }
);

TabBar.displayName = "TabBar";
