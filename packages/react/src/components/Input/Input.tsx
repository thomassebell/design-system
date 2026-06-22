import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../utils/shared";
import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label rendered above the input. */
  label?: string;
  /** Helper text shown between the label and the input. Hidden when
   *  the field is disabled or read-only. */
  hint?: string;
  /** Error message — when present, renders as a prominent banner with
   *  an icon above the input and turns the label + input border red.
   *  Coexists with hint (it doesn't replace it). */
  error?: string;
  /** Element rendered inside the input, before the prefix/value. */
  startIcon?: ReactNode;
  /** Element rendered inside the input, after the value/suffix. */
  endIcon?: ReactNode;
  /** Short text shown inside the input before the value (e.g. "https://"). */
  prefix?: string;
  /** Short text shown inside the input after the value (e.g. "kg", ".com"). */
  suffix?: string;
}

/* Small inline error icon for the error banner — Material's `error_outline`
   aesthetic (circle with exclamation). Stroked with currentColor so it
   inherits the banner's icon colour from CSS. */
function ErrorOutlineIcon() {
  return (
    <svg
      className={styles.errorBannerIcon}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="13" />
      <circle cx="12" cy="16.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      startIcon,
      endIcon,
      prefix,
      suffix,
      className,
      id,
      disabled,
      readOnly,
      ...rest
    },
    ref
  ) => {
    const reactId = useId();
    const inputId = id ?? reactId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;

    // Hint is hidden in disabled / readOnly per the Figma design
    const showHint = Boolean(hint) && !disabled && !readOnly;
    const hasError = Boolean(error);

    // Combine hint + error ids on aria-describedby so screen readers
    // pick up both messages when the input is focused.
    const describedBy =
      [showHint ? hintId : null, hasError ? errorId : null]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div
        className={cx(
          styles.wrapper,
          hasError && styles.hasError,
          className
        )}
      >
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}

        {showHint && (
          <p id={hintId} className={styles.hint}>
            {hint}
          </p>
        )}

        {hasError && (
          <div id={errorId} className={styles.errorBanner}>
            <p className={styles.errorBannerText}>{error}</p>
            <ErrorOutlineIcon />
          </div>
        )}

        <div className={styles.inputWrap}>
          {startIcon && (
            <span className={styles.icon} aria-hidden="true">
              {startIcon}
            </span>
          )}

          {prefix && <span className={styles.affix}>{prefix}</span>}

          <input
            ref={ref}
            id={inputId}
            className={styles.input}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            disabled={disabled}
            readOnly={readOnly}
            {...rest}
          />

          {suffix && <span className={styles.affix}>{suffix}</span>}

          {endIcon && (
            <span className={styles.icon} aria-hidden="true">
              {endIcon}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
