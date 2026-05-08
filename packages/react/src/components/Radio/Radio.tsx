import { forwardRef, type InputHTMLAttributes } from "react";
import { cx } from "../../utils/shared";
import styles from "./Radio.module.css";

/** Component size — pairs with Input + Button + Checkbox. "regular"
 *  is 20px, "dense" is 16px. */
export type RadioSize = "regular" | "dense";

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** 20px (regular) or 16px (dense). */
  size?: RadioSize;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ size = "regular", className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        type="radio"
        className={cx(styles.radio, styles[size], className)}
        {...rest}
      />
    );
  }
);

Radio.displayName = "Radio";
