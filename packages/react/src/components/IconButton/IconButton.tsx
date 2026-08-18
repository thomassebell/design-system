import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { cx } from "../../utils/shared";
import styles from "./IconButton.module.css";

/** Icon-only sibling of Button. Same surface treatments, minus the "text"
 *  variant — an underlined link aesthetic has no meaning for a centered
 *  icon with no label. */
export type IconButtonVariant = "solid" | "outline" | "danger";

/** The props IconButton owns, whatever element it ends up rendering. */
export interface IconButtonOwnProps {
  /** The icon to render, centered. Pass an `<Icon>` or any ReactNode. */
  icon: ReactNode;
  /** Accessible name for the button. Required — an icon-only control has no
   *  visible text, so screen readers rely on this. Becomes `aria-label`. */
  label: string;
  variant?: IconButtonVariant;
  loading?: boolean;
  /** Disabled in the semantic sense, on whatever element is rendered – see
   *  the note on `as` in `Button` for how that is expressed on an anchor. */
  disabled?: boolean;
}

/**
 * Same polymorphism as `Button`, for the same reason: an icon-only control is
 * as often a navigation (a logo home link, a social icon) as an action.
 */
export type IconButtonProps<E extends ElementType = "button"> = IconButtonOwnProps & {
  as?: E;
} & Omit<ComponentPropsWithoutRef<E>, keyof IconButtonOwnProps | "as" | "children">;

interface IconButtonComponent {
  /* See the note in Button – a call signature carries no implicit `ref`. */
  <E extends ElementType = "button">(
    props: IconButtonProps<E> & { ref?: ComponentPropsWithRef<E>["ref"] }
  ): ReactElement | null;
  displayName?: string;
}

/* Loosely typed for the same reason as Button's implementation. */
type IconButtonImplProps = IconButtonOwnProps & {
  as?: ElementType;
  className?: string;
};

const IconButtonImpl = (
  {
    as,
    icon,
    label,
    variant = "solid",
    loading = false,
    disabled,
    className,
    ...rest
  }: IconButtonImplProps,
  ref: Ref<Element>
) => {
  const Component = (as ?? "button") as ElementType;
  const isDisabled = Boolean(disabled) || loading;

  /* See the matching note in Button: an anchor cannot be `disabled`, so the
     state is announced and the destination removed. */
  const elementState =
    Component === "button"
      ? { disabled: isDisabled }
      : isDisabled
        ? { "aria-disabled": true, href: undefined, onClick: undefined }
        : {};

  return (
    <Component
      ref={ref}
      className={cx(
        styles.iconButton,
        styles[variant],
        loading && styles.loading,
        className
      )}
      aria-label={label}
      aria-busy={loading || undefined}
      {...rest}
      {...elementState}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span className={cx(styles.icon, loading && styles.hidden)} aria-hidden="true">
        {icon}
      </span>
    </Component>
  );
};

export const IconButton = forwardRef(IconButtonImpl) as unknown as IconButtonComponent;
IconButton.displayName = "IconButton";
