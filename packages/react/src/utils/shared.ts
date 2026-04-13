import type { ReactNode } from "react";

/** Standard size scale used across components. */
export type Size = "sm" | "md" | "lg";

/** Base props every DS component accepts. */
export interface DSProps {
  className?: string;
  children?: ReactNode;
}

/**
 * Merge class names, filtering out falsy values.
 * Tiny alternative to clsx / classnames.
 */
export function cx(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
