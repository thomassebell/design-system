import { forwardRef, useId, type ReactNode } from "react";
import { Switch, type SwitchProps } from "../Switch/Switch";
import { Field } from "../Field/Field";

/* SwitchField = Switch + label + optional hint/error, composed via
   Field. Same shape as CheckboxField and RadioField — generates an
   id, wires aria-describedby, translates `error` (string) into
   aria-invalid on the Switch.

   Layout note: this uses Field's default control-on-left direction.
   The iOS / Mac settings convention is label-left + switch-right; if
   that becomes the preferred look, add a `direction` prop to Field
   and default this component to `reverse`. */

export interface SwitchFieldProps extends Omit<SwitchProps, "id"> {
  /** Label rendered next to the switch. */
  label?: ReactNode;
  /** Helper text below the switch. */
  hint?: ReactNode;
  /** Error message — replaces hint, turns the label + message red,
   *  and applies aria-invalid (red ring) to the switch. */
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
