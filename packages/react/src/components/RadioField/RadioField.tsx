import { forwardRef, useId, type ReactNode } from "react";
import { Radio, type RadioProps } from "../Radio/Radio";
import { Field } from "../Field/Field";

/* RadioField = Radio + label + optional hint/error. Direct parity
   with CheckboxField — useful for one-off radios outside a group.
   Inside a RadioGroup the radios are rendered through Field directly
   (not via RadioField) so the group can pass a single aria-invalid
   down to every option without ergonomic gymnastics. */

export interface RadioFieldProps extends Omit<RadioProps, "id"> {
  /** Label rendered next to the radio. */
  label?: ReactNode;
  /** Helper text below the radio. */
  hint?: ReactNode;
  /** Error message — replaces hint, turns the label + message red,
   *  and applies aria-invalid (red border + red focus ring) to the radio. */
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
