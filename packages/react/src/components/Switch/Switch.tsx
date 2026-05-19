import { forwardRef, type InputHTMLAttributes } from "react";
import { cx } from "../../utils/shared";
import styles from "./Switch.module.css";

/* Switch is a toggle control — a checkbox under the hood with
   `role="switch"` so screen readers announce "switch, on/off" instead
   of "checkbox, checked". Visually it's a slide-handle track; the
   underlying <input type="checkbox"> keeps native keyboard, form,
   and screen-reader behaviour for free. */

export type SwitchProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "role"
>;

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        className={cx(styles.switchEl, className)}
        {...rest}
      />
    );
  }
);

Switch.displayName = "Switch";
