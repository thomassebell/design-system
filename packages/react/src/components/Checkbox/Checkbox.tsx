import { forwardRef, useEffect, useRef, type InputHTMLAttributes } from "react";
import { cx } from "../../utils/shared";
import styles from "./Checkbox.module.css";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Render the indeterminate state. HTML has no `indeterminate`
   *  attribute — only a JS property — so we set it imperatively. */
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ indeterminate = false, className, ...rest }, forwardedRef) => {
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
        className={cx(styles.checkbox, className)}
        {...rest}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";
