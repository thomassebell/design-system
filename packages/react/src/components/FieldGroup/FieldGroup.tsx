import { useId, type ReactNode } from "react";
import { cx } from "../../utils/shared";
import styles from "./FieldGroup.module.css";

/* Internal layout primitive for grouping multiple fields under a shared
   <legend> with optional group-level hint or error. Used by
   CheckboxGroup and RadioGroup. Not exported from the package root —
   the matching *Group wrappers are the public surface. */

export interface FieldGroupProps {
  /** Group heading rendered as the <legend>. Required for accessibility. */
  legend: ReactNode;
  /** The fields belonging to the group. */
  children: ReactNode;
  /** Helper text shown below the children. */
  hint?: ReactNode;
  /** Group-level error message — replaces hint when present. Turns the
   *  message red. (Per-field errors stay on the individual fields.) */
  error?: ReactNode;
  className?: string;
}

export function FieldGroup({
  legend,
  children,
  hint,
  error,
  className,
}: FieldGroupProps) {
  const reactId = useId();
  const message = error ?? hint;
  const hasError = error != null && error !== false;
  const hasMessage = message != null && message !== false;
  const messageId = hasMessage ? `${reactId}-message` : undefined;

  return (
    <fieldset
      className={cx(styles.group, className)}
      aria-describedby={messageId}
    >
      <legend className={styles.legend}>{legend}</legend>

      <div className={styles.items}>{children}</div>

      {hasMessage && (
        <p
          id={messageId}
          className={cx(styles.message, hasError && styles.messageError)}
        >
          {message}
        </p>
      )}
    </fieldset>
  );
}
