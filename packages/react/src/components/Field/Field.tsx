import { type ReactNode } from "react";
import { cx } from "../../utils/shared";
import styles from "./Field.module.css";

/* Internal layout primitive for inline-control fields (Checkbox / Switch /
   Radio). Not exported from the package root — consumed only by the
   matching *Field wrappers. */

export interface FieldProps {
  /** The control element rendered to the left of the label. */
  control: ReactNode;
  /** Label rendered next to the control. */
  label?: ReactNode;
  /** Helper text shown below the control. */
  hint?: ReactNode;
  /** Error message — replaces hint when present. */
  error?: ReactNode;
  /** Forwarded to `<label htmlFor>` so clicking the label toggles the control. */
  htmlFor?: string;
  /** ID applied to the hint element. The consumer should mirror this on
   *  the control's `aria-describedby` so the message is announced. */
  hintId?: string;
  className?: string;
}

export function Field({
  control,
  label,
  hint,
  error,
  htmlFor,
  hintId,
  className,
}: FieldProps) {
  const message = error ?? hint;
  const hasError = error != null && error !== false;

  return (
    <div className={cx(styles.field, hasError && styles.hasError, className)}>
      <span className={styles.control}>{control}</span>

      {label && (
        <label htmlFor={htmlFor} className={styles.label}>
          {label}
        </label>
      )}

      {message != null && message !== false && (
        <p id={hintId} className={cx(styles.hint, hasError && styles.hintError)}>
          {message}
        </p>
      )}
    </div>
  );
}
