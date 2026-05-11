import { type ReactNode } from "react";
import { FieldGroup } from "../FieldGroup/FieldGroup";

/* CheckboxGroup = FieldGroup with CheckboxField children. Each child
   manages its own checked state — checkboxes are independent by
   nature (multiple selections allowed), so the group doesn't
   coordinate. */

export interface CheckboxGroupProps {
  /** Group heading rendered as the <legend>. */
  legend: ReactNode;
  /** Secondary line below the legend — context for the group. */
  description?: ReactNode;
  /** Group-level error — renders as a pink banner with an alert icon
   *  between the header and the items. */
  error?: ReactNode;
  /** CheckboxField (or other field) elements belonging to this group. */
  children: ReactNode;
  className?: string;
}

export function CheckboxGroup({
  legend,
  description,
  error,
  children,
  className,
}: CheckboxGroupProps) {
  return (
    <FieldGroup
      legend={legend}
      description={description}
      error={error}
      className={className}
    >
      {children}
    </FieldGroup>
  );
}
