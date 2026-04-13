import { forwardRef, type SVGAttributes } from "react";
import { cx, type Size } from "../utils/shared";
import styles from "./Icon.module.css";

const sizeMap: Record<Size, number> = { sm: 16, md: 20, lg: 24 };

export interface IconProps extends SVGAttributes<SVGSVGElement> {
  /** Size of the icon. */
  size?: Size;
  /** Accessible label. If omitted the icon is decorative (aria-hidden). */
  label?: string;
}

/**
 * Thin wrapper around an inline SVG slot.
 * Pass children as raw <path> / <circle> etc.
 *
 * Usage:
 *   <Icon size="md" label="Search">
 *     <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
 *   </Icon>
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ size = "md", label, className, children, ...rest }, ref) => {
    const px = sizeMap[size];

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={px}
        height={px}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cx(styles.icon, className)}
        role={label ? "img" : "presentation"}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        {...rest}
      >
        {children}
      </svg>
    );
  }
);

Icon.displayName = "Icon";
