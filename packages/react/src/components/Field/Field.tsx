import { type ReactNode } from "react";
import { cx } from "../../utils/shared";
import styles from "./Field.module.css";

/* Internal layout primitive for inline-control fields (Checkbox /
   Switch / Radio). Not exported from the package root — consumed only
   by the matching *Field wrappers.

   Layout: control on the left, label + optional hint stacked on the
   right. The label uses paragraph-size primary text — same weight as
   surrounding form copy — because the control itself communicates
   state visually; the text doesn't need to promote on hover or focus. */

export interface FieldProps {
  /** The control element rendered to the left of the label. */
  control: ReactNode;
  /** Label rendered next to the control. */
  label?: ReactNode;
  /** Helper text shown below the label. */
  hint?: ReactNode;
  /** Error message — replaces hint when present, and turns the label
   *  and message red. */
  error?: ReactNode;
  /** Forwarded to `<label htmlFor>` so clicking the label toggles the
   *  control. */
  htmlFor?: string;
  /** ID applied to the hint element. The consumer should mirror this
   *  on the control's `aria-describedby` so the message is announced. */
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
  const hasMessage = message != null && message !== false;

  return (
    <div className={cx(styles.field, hasError && styles.hasError, className)}>
      <span className={styles.control}>{control}</span>

      <div className={styles.text}>
        {label && (
          <label htmlFor={htmlFor} className={styles.label}>
            {label}
          </label>
        )}

        {hasMessage && (
          <p id={hintId} className={styles.hint}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
