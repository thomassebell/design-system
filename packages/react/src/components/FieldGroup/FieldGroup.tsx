import { useId, type ReactNode } from "react";
import { cx } from "../../utils/shared";
import styles from "./FieldGroup.module.css";

/* Internal layout primitive for grouping multiple fields. Used by
   CheckboxGroup and RadioGroup. Not exported from the package root.

   Structure (top → bottom):
   - Header: `<legend>` heading + optional description below it
   - Optional error banner (pink-tinted, with an alert icon)
   - Items: the actual fields */

export interface FieldGroupProps {
  /** Group heading rendered as the <legend>. Required for a11y. */
  legend: ReactNode;
  /** Secondary line below the legend — context for the group. */
  description?: ReactNode;
  /** Group-level error message — renders as a prominent banner with
   *  an icon above the items. Replaces the inline message of the
   *  previous design so longer error copy reads comfortably. */
  error?: ReactNode;
  /** The fields belonging to the group. */
  children: ReactNode;
  className?: string;
}

/* Material `error_outline` aesthetic — circle with an exclamation
   inside. Stroked with currentColor so it inherits its colour from
   the surrounding .errorBannerIcon class. */
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

export function FieldGroup({
  legend,
  description,
  error,
  children,
  className,
}: FieldGroupProps) {
  const reactId = useId();
  const hasError = error != null && error !== false;
  const errorId = hasError ? `${reactId}-error` : undefined;

  return (
    <fieldset
      className={cx(styles.group, className)}
      aria-describedby={errorId}
    >
      <legend className={styles.legend}>{legend}</legend>

      {description && <p className={styles.description}>{description}</p>}

      {hasError && (
        <div id={errorId} className={styles.errorBanner}>
          <p className={styles.errorBannerText}>{error}</p>
          <ErrorOutlineIcon />
        </div>
      )}

      <div className={styles.items}>{children}</div>
    </fieldset>
  );
}
