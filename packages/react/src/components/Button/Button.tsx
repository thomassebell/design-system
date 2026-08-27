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
import styles from "./Button.module.css";

export type ButtonVariant = "solid" | "outline" | "danger" | "text";

/** The props Button owns, whatever element it ends up rendering. */
export interface ButtonOwnProps {
  variant?: ButtonVariant;
  /** Icon rendered before the label. Decorative — pass an `<Icon>` or any ReactNode. */
  startIcon?: ReactNode;
  /** Icon rendered after the label. Decorative — pass an `<Icon>` or any ReactNode. */
  endIcon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  /** Disabled in the semantic sense, on whatever element is rendered – see
   *  the note on `as` for how that is expressed when it is not a `<button>`. */
  disabled?: boolean;
  children?: ReactNode;
}

/**
 * `as` follows the pattern `Text` and `Stack` already set: the *style* is this
 * component's job, the *element* is the caller's. A call to action that
 * navigates is an `<a>`, not a `<button>` – on a marketing or share surface
 * most of them are – and neither wrapping a button in an anchor (invalid HTML)
 * nor copying these classes onto one's own anchor is an acceptable answer.
 *
 * The accepted props follow the element: `as="a"` takes `href`, and rejects
 * `type`.
 */
export type ButtonProps<E extends ElementType = "button"> = ButtonOwnProps & {
  as?: E;
} & Omit<ComponentPropsWithoutRef<E>, keyof ButtonOwnProps | "as">;

interface ButtonComponent {
  /* `ref` is declared here because a plain call signature has no implicit
     `ref` the way ForwardRefExoticComponent does – omit it and `<Button ref>`
     stops typechecking even though it still works at runtime. */
  <E extends ElementType = "button">(
    props: ButtonProps<E> & { ref?: ComponentPropsWithRef<E>["ref"] }
  ): ReactElement | null;
  displayName?: string;
}

/* The implementation is typed loosely on purpose. `ButtonProps<E>` is the
   contract callers see; inside, `E` is unresolved and destructuring a fully
   generic prop bag fights the compiler for no benefit. */
type ButtonImplProps = ButtonOwnProps & {
  as?: ElementType;
  className?: string;
};

const ButtonImpl = (
  {
    as,
    variant = "solid",
    startIcon,
    endIcon,
    fullWidth = false,
    loading = false,
    disabled,
    className,
    children,
    ...rest
  }: ButtonImplProps,
  ref: Ref<Element>
) => {
  const Component = (as ?? "button") as ElementType;
  const isDisabled = Boolean(disabled) || loading;

  /* `disabled` is a `<button>` attribute and nothing else. React drops it from
     an anchor silently, so a "disabled" link would still look faded and still
     navigate. An anchor can only express the state by announcing it and having
     no destination left to follow – dropping `href` also takes it out of the
     tab order, which is what a disabled control should do. */
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
        styles.button,
        styles[variant],
        fullWidth && styles.fullWidth,
        loading && styles.loading,
        className
      )}
      aria-busy={loading || undefined}
      {...rest}
      /* After `rest`, not before: a disabled link must lose its `href` even
         when the caller passed one. That is the whole point of the state. */
      {...elementState}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {startIcon && (
        <span
          className={cx(styles.icon, styles.iconStart, loading && styles.hidden)}
          aria-hidden="true"
        >
          {startIcon}
        </span>
      )}
      <span className={cx(loading && styles.hidden)}>{children}</span>
      {endIcon && (
        <span
          className={cx(styles.icon, styles.iconEnd, loading && styles.hidden)}
          aria-hidden="true"
        >
          {endIcon}
        </span>
      )}
    </Component>
  );
};

export const Button = forwardRef(ButtonImpl) as unknown as ButtonComponent;
Button.displayName = "Button";
