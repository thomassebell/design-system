import { forwardRef, useId, type ReactNode } from "react";
import { Checkbox, type CheckboxProps } from "../Checkbox/Checkbox";
import { Field } from "../Field/Field";

/* CheckboxField = Checkbox + label + optional hint/error, composed via
   the shared Field primitive. Generates an id (so the label's `for`
   and the input's `id` always match), wires `aria-describedby` from
   the input to the hint message, and translates a string `error` into
   `aria-invalid` on the Checkbox so the bare component's red-border
   styling kicks in. */

export interface CheckboxFieldProps extends Omit<CheckboxProps, "id"> {
  /** Label rendered next to the checkbox. Click toggles via htmlFor. */
  label?: ReactNode;
  /** Helper text below the checkbox. */
  hint?: ReactNode;
  /** Error message — replaces hint, turns the label + message red,
   *  and applies aria-invalid (red border + red focus ring) to the box. */
  error?: ReactNode;
  /** Optional override for the auto-generated id. */
  id?: string;
}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ label, hint, error, id, className, ...checkboxProps }, ref) => {
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
          <Checkbox
            ref={ref}
            id={inputId}
            aria-describedby={hintId}
            aria-invalid={hasError || undefined}
            {...checkboxProps}
          />
        }
      />
    );
  }
);

CheckboxField.displayName = "CheckboxField";
