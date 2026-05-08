import { forwardRef, useEffect, useRef, type InputHTMLAttributes } from "react";
import { cx } from "../../utils/shared";
import styles from "./Checkbox.module.css";

/** Component size — pairs with Input + Button. "regular" is 20px,
 *  "dense" is 16px. Both still respond to density (Default ↔ Compact)
 *  via the surrounding Field's spacing tokens. */
export type CheckboxSize = "regular" | "dense";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  /** 20px (regular) or 16px (dense). */
  size?: CheckboxSize;
  /** Render the indeterminate state. HTML has no `indeterminate`
   *  attribute — only a JS property — so we set it imperatively. */
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ size = "regular", indeterminate = false, className, ...rest }, forwardedRef) => {
    const innerRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const setRef = (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    return (
      <input
        ref={setRef}
        type="checkbox"
        className={cx(styles.checkbox, styles[size], className)}
        {...rest}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";
