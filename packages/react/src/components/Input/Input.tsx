import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx, type Size } from "../utils/shared";
import styles from "./Input.module.css";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Size variant. */
  size?: Size;
  /** Label rendered above the input. */
  label?: string;
  /** Helper text below the input. */
  hint?: string;
  /** Error message — replaces hint when present. */
  error?: string;
  /** Element rendered inside the input, before the text. */
  leadingIcon?: ReactNode;
  /** Element rendered inside the input, after the text. */
  trailingIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "md",
      label,
      hint,
      error,
      leadingIcon,
      trailingIcon,
      className,
      id,
      ...rest
    },
    ref
  ) => {
    const inputId = id ?? (label ? `ds-input-${label.replace(/\s/g, "-").toLowerCase()}` : undefined);
    const hintId = (hint || error) ? `${inputId}-hint` : undefined;

    return (
      <div className={cx(styles.wrapper, className)}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}

        <div
          className={cx(
            styles.inputWrap,
            styles[size],
            error && styles.hasError
          )}
        >
          {leadingIcon && (
            <span className={styles.icon} aria-hidden="true">
              {leadingIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={styles.input}
            aria-invalid={!!error || undefined}
            aria-describedby={hintId}
            {...rest}
          />

          {trailingIcon && (
            <span className={styles.icon} aria-hidden="true">
              {trailingIcon}
            </span>
          )}
        </div>

        {(error || hint) && (
          <p id={hintId} className={cx(styles.hint, error && styles.hintError)}>
            {error ?? hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
