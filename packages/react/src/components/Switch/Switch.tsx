import { forwardRef, type InputHTMLAttributes } from "react";
import { cx } from "../../utils/shared";
import styles from "./Switch.module.css";

/** Component size — pairs with Checkbox + Radio. The track height
 *  matches the Checkbox/Radio box height ("regular" 20px, "dense" 16px),
 *  the track width is wider than tall so the thumb has somewhere to
 *  slide to. */
export type SwitchSize = "regular" | "dense";

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "role"> {
  /** Track height: 20px (regular) or 16px (dense). */
  size?: SwitchSize;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ size = "regular", className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        // role="switch" is what makes screen readers announce
        // "switch, on" / "switch, off" instead of "checkbox, checked".
        // The underlying type=checkbox keeps native form behaviour.
        role="switch"
        className={cx(styles.switchEl, styles[size], className)}
        {...rest}
      />
    );
  }
);

Switch.displayName = "Switch";
