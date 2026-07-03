/* ─────────────────────────────────────────────
   @ds/react — Design System Components
   ───────────────────────────────────────────── */

// Global styles (reset + utilities). tsup extracts all CSS – this file plus
// every component's CSS Module – into dist/index.css, which consumers load
// via the "@ds/react/styles.css" export alongside a token stylesheet from
// @ds/tokens/dist/.
import "./styles/globals.css";

// Components
export { Button } from "./components/Button";
export type { ButtonProps, ButtonVariant } from "./components/Button";

export { IconButton } from "./components/IconButton";
export type { IconButtonProps, IconButtonVariant } from "./components/IconButton";

export { TabBarButton } from "./components/TabBarButton";
export type { TabBarButtonProps } from "./components/TabBarButton";

export { Text } from "./components/Text";
export type { TextProps, TextVariant } from "./components/Text";

export { Stack } from "./components/Stack";
export type { StackProps } from "./components/Stack";

export { Surface, useSurface } from "./components/Surface";
export type { SurfaceProps, SurfaceMode } from "./components/Surface";

export { Input } from "./components/Input";
export type { InputProps } from "./components/Input";

export { Checkbox } from "./components/Checkbox";
export type { CheckboxProps } from "./components/Checkbox";

export { CheckboxField } from "./components/CheckboxField";
export type { CheckboxFieldProps } from "./components/CheckboxField";

export { CheckboxGroup } from "./components/CheckboxGroup";
export type { CheckboxGroupProps } from "./components/CheckboxGroup";

export { Radio } from "./components/Radio";
export type { RadioProps } from "./components/Radio";

export { RadioField } from "./components/RadioField";
export type { RadioFieldProps } from "./components/RadioField";

export { RadioGroup } from "./components/RadioGroup";
export type { RadioGroupProps, RadioOption } from "./components/RadioGroup";

export { Switch } from "./components/Switch";
export type { SwitchProps } from "./components/Switch";

export { SwitchField } from "./components/SwitchField";
export type { SwitchFieldProps } from "./components/SwitchField";

export { Icon } from "./components/Icon";
export type { IconProps } from "./components/Icon";

// Utilities
export { cx } from "./utils/shared";
export type { Size, DSProps } from "./utils/shared";
