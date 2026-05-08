import { type ReactNode } from "react";
import { FieldGroup } from "../FieldGroup/FieldGroup";

/* CheckboxGroup = FieldGroup with CheckboxField children. Each child
   manages its own checked state — checkboxes are independent by
   nature (multiple selections allowed), so the group doesn't
   coordinate. RadioGroup will be different: single-selection, so it
   takes options + value + onChange instead of children. */

export interface CheckboxGroupProps {
  /** Group heading rendered as the <legend>. */
  legend: ReactNode;
  /** CheckboxField (or other field) elements belonging to this group. */
  children: ReactNode;
  /** Helper text below the children. */
  hint?: ReactNode;
  /** Group-level error — for example "select at least one option". */
  error?: ReactNode;
  className?: string;
}

export function CheckboxGroup({
  legend,
  children,
  hint,
  error,
  className,
}: CheckboxGroupProps) {
  return (
    <FieldGroup
      legend={legend}
      hint={hint}
      error={error}
      className={className}
    >
      {children}
    </FieldGroup>
  );
}
