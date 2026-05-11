import { forwardRef, type InputHTMLAttributes } from "react";
import { cx } from "../../utils/shared";
import styles from "./Radio.module.css";

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        type="radio"
        className={cx(styles.radio, className)}
        {...rest}
      />
    );
  }
);

Radio.displayName = "Radio";
