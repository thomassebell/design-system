import { forwardRef, useId, type ReactNode } from "react";
import { Radio, type RadioProps } from "../Radio/Radio";
import { Field } from "../Field/Field";

/* RadioField = Radio + label + optional hint/error, composed via
   the shared Field primitive. Mirrors CheckboxField exactly — only
   the underlying control differs.

   Note: standalone use is rare in practice (radios almost always live
   in a group). Most consumers should reach for RadioGroup, which
   internally renders multiple radios sharing a `name` so the browser
   coordinates the single-selection. RadioField is exposed for the
   occasional one-off case (e.g. a single optional opt-in radio). */

export interface RadioFieldProps extends Omit<RadioProps, "id"> {
  /** Label rendered next to the radio. */
  label?: ReactNode;
  /** Helper text below the label. */
  hint?: ReactNode;
  /** Error message — replaces hint, turns the label + message red,
   *  and applies aria-invalid (red ring + red dot when checked) to
   *  the radio. */
  error?: ReactNode;
  /** Optional override for the auto-generated id. */
  id?: string;
}

export const RadioField = forwardRef<HTMLInputElement, RadioFieldProps>(
  ({ label, hint, error, id, className, ...radioProps }, ref) => {
    const reactId = useId();
    const inputId = id ?? reactId;
    const hasError = Boolean(error);
    const hasMessage = hasError || Boolean(hint);
    const hintId = hasMessage ? `${inputId}-hint` : undefined;

    return (
      <Field
        htmlFor={inputId}
        hintId={hintId}
        label={label}
        hint={hint}
        error={error}
        className={className}
        control={
          <Radio
            ref={ref}
            id={inputId}
            aria-describedby={hintId}
            aria-invalid={hasError || undefined}
            {...radioProps}
          />
        }
      />
    );
  }
);

RadioField.displayName = "RadioField";
