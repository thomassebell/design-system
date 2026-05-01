import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/shared";
import styles from "./Input.module.css";

/** Component size — design-driven, independent of the system's
 *  density mode. "regular" is the default; "dense" is tighter for
 *  toolbars, table rows, and dense forms. Both still respond to
 *  density (Default ↔ Compact) automatically. */
export type InputSize = "regular" | "dense";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Component size — pairs with Button so they line up at equal heights. */
  size?: InputSize;
  /** Label rendered above the input. */
  label?: string;
  /** Helper text below the input. */
  hint?: string;
  /** Error message — replaces hint when present. */
  error?: string;
  /** Element rendered inside the input, before the text. */
  startIcon?: ReactNode;
  /** Element rendered inside the input, after the text. */
  endIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = "regular",
      label,
      hint,
      error,
      startIcon,
      endIcon,
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
          {startIcon && (
            <span className={styles.icon} aria-hidden="true">
              {startIcon}
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

          {endIcon && (
            <span className={styles.icon} aria-hidden="true">
              {endIcon}
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
