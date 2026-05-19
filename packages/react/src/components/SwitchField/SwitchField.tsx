import { forwardRef, useId, type ReactNode } from "react";
import { Switch, type SwitchProps } from "../Switch/Switch";
import { Field } from "../Field/Field";

/* SwitchField = Switch + label + optional hint/error, composed via
   the shared Field primitive. Same shape as CheckboxField /
   RadioField — generates an id, wires aria-describedby for the hint
   message, and translates a string `error` into `aria-invalid` on
   the Switch.

   Switches don't have a Group variant (CheckboxGroup, RadioGroup) —
   they're one-per-setting by convention. Use SwitchField directly. */

export interface SwitchFieldProps extends Omit<SwitchProps, "id"> {
  /** Label rendered next to the switch. */
  label?: ReactNode;
  /** Helper text below the label. */
  hint?: ReactNode;
  /** Error message — replaces hint, turns the label + message red,
   *  and applies aria-invalid (red border + red handle) to the switch. */
  error?: ReactNode;
  /** Optional override for the auto-generated id. */
  id?: string;
}

export const SwitchField = forwardRef<HTMLInputElement, SwitchFieldProps>(
  ({ label, hint, error, id, className, ...switchProps }, ref) => {
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
          <Switch
            ref={ref}
            id={inputId}
            aria-describedby={hintId}
            aria-invalid={hasError || undefined}
            {...switchProps}
          />
        }
      />
    );
  }
);

SwitchField.displayName = "SwitchField";
