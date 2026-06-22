import {
  createContext,
  forwardRef,
  useContext,
  type HTMLAttributes,
} from "react";

/** Appearance mode for a subtree. Light is the default surface; dark adapts
 *  foreground colours for a dark background. */
export type SurfaceMode = "light" | "dark";

const SurfaceContext = createContext<SurfaceMode>("light");

/** Read the nearest surface mode from context — for the rare component that
 *  needs to branch on appearance in JS. Styling adapts automatically via CSS,
 *  so most components never need this. */
export const useSurface = (): SurfaceMode => useContext(SurfaceContext);

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  /** The appearance mode for this subtree. Sets `data-surface`, which the token
   *  CSS keys off to flip foreground colours (text, icon, border, button, form
   *  controls). The background is yours to set — paint it from brand colours. */
  surface: SurfaceMode;
}

/** Scopes an appearance mode to its subtree via `data-surface`. Foreground
 *  tokens adapt automatically; the background is a free brand-colour choice you
 *  set yourself. Nests in either direction — a light island can live inside a
 *  dark section and vice-versa, because the token CSS scopes both
 *  `[data-surface="light"]` and `[data-surface="dark"]`. */
export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  ({ surface, children, ...rest }, ref) => (
    <SurfaceContext.Provider value={surface}>
      <div ref={ref} data-surface={surface} {...rest}>
        {children}
      </div>
    </SurfaceContext.Provider>
  ),
);

Surface.displayName = "Surface";
