/* ─────────────────────────────────────────────
   @ds/react — Design System Components
   ───────────────────────────────────────────── */

// Styles (consumers import "@ds/react/styles.css" separately)

// Components
export { Button } from "./components/Button";
export type { ButtonProps, ButtonVariant } from "./components/Button";

export { Text } from "./components/Text";
export type { TextProps, TextVariant } from "./components/Text";

export { Stack } from "./components/Stack";
export type { StackProps } from "./components/Stack";

export { Input } from "./components/Input";
export type { InputProps } from "./components/Input";

export { Checkbox } from "./components/Checkbox";
export type { CheckboxProps } from "./components/Checkbox";

export { CheckboxField } from "./components/CheckboxField";
export type { CheckboxFieldProps } from "./components/CheckboxField";

export { CheckboxGroup } from "./components/CheckboxGroup";
export type { CheckboxGroupProps } from "./components/CheckboxGroup";

export { Icon } from "./components/Icon";
export type { IconProps } from "./components/Icon";

// Utilities
export { cx } from "./utils/shared";
export type { Size, DSProps } from "./utils/shared";
