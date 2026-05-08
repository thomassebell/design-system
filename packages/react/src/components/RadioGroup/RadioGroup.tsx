import { useId, useState, type ReactNode } from "react";
import { Radio, type RadioSize } from "../Radio/Radio";
import { Field } from "../Field/Field";
import { FieldGroup } from "../FieldGroup/FieldGroup";

/* RadioGroup is data-driven (options + value + onChange) because radios
   need single-selection coordination and a shared `name` so the
   browser groups them. Each option renders as Field + Radio directly
   — bypassing RadioField — so the group's aria-invalid can flow down
   to every radio without prop-precedence gymnastics. */

export interface RadioOption {
  /** The submitted value when this option is selected. */
  value: string;
  /** Visible label next to the radio. */
  label: ReactNode;
  /** Per-option helper text below the label. */
  hint?: ReactNode;
  /** Disable just this option. */
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** Group heading rendered as the <legend>. */
  legend: ReactNode;
  /** HTML name attribute — shared by every radio so the browser
   *  groups them. Required: without it, multiple groups on the same
   *  page would all share the browser's default group. */
  name: string;
  /** The options to render. */
  options: RadioOption[];
  /** Currently selected value (controlled mode). */
  value?: string;
  /** Initial selected value (uncontrolled mode). */
  defaultValue?: string;
  /** Called with the new value when the user selects a different option. */
  onChange?: (value: string) => void;
  /** Helper text shown below the options. */
  hint?: ReactNode;
  /** Group-level error — replaces hint, turns the message red, and
   *  applies aria-invalid to every radio so they all show the red
   *  border + red focus ring. */
  error?: ReactNode;
  /** Component size — applies to every radio in the group. */
  size?: RadioSize;
  /** Disable every option in the group. Per-option `disabled` still
   *  works on top of this. */
  disabled?: boolean;
  className?: string;
}

export function RadioGroup({
  legend,
  name,
  options,
  value,
  defaultValue,
  onChange,
  hint,
  error,
  size,
  disabled,
  className,
}: RadioGroupProps) {
  const groupId = useId();
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const currentValue = isControlled ? value : internalValue;
  const hasError = Boolean(error);

  const handleChange = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  return (
    <FieldGroup legend={legend} hint={hint} error={error} className={className}>
      {options.map((opt) => {
        const inputId = `${groupId}-${opt.value}`;
        const hintId = opt.hint ? `${inputId}-hint` : undefined;
        const optionDisabled = disabled || opt.disabled;

        return (
          <Field
            key={opt.value}
            htmlFor={inputId}
            hintId={hintId}
            label={opt.label}
            hint={opt.hint}
            control={
              <Radio
                id={inputId}
                name={name}
                value={opt.value}
                checked={currentValue === opt.value}
                onChange={(e) => {
                  if (e.target.checked) handleChange(opt.value);
                }}
                size={size}
                disabled={optionDisabled}
                aria-describedby={hintId}
                aria-invalid={hasError || undefined}
              />
            }
          />
        );
      })}
    </FieldGroup>
  );
}
