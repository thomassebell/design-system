/**
 * Helpers for the "Tokens" reference stories.
 *
 * Reads CSS custom properties declared on :root so the catalog
 * always reflects the actual built tokens — no hand-maintained
 * lists to drift out of sync. Re-reads when stylesheets change so
 * the brand/density toolbar swaps update the displayed values.
 */

import { useEffect, useState } from "react";

export interface Token {
  name: string;
  value: string;
}

/** Walk all loaded stylesheets and collect every `--*` declared on `:root`. */
export function readRootCssVariables(): Token[] {
  if (typeof document === "undefined") return [];
  const seen = new Set<string>();
  const list: Token[] = [];
  const rootStyle = getComputedStyle(document.documentElement);

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList | undefined;
    try {
      rules = sheet.cssRules;
    } catch {
      continue; // Cross-origin stylesheet — skip silently.
    }
    if (!rules) continue;
    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSStyleRule)) continue;
      const matchesRoot = (rule.selectorText ?? "")
        .split(",")
        .map((s) => s.trim())
        .some((s) => s === ":root");
      if (!matchesRoot) continue;
      for (let i = 0; i < rule.style.length; i++) {
        const prop = rule.style.item(i);
        if (!prop.startsWith("--")) continue;
        if (seen.has(prop)) continue;
        seen.add(prop);
        list.push({
          name: prop,
          value: rootStyle.getPropertyValue(prop).trim(),
        });
      }
    }
  }
  return list.sort((a, b) => a.name.localeCompare(b.name));
}

export function filterByPrefix(tokens: Token[], ...prefixes: string[]): Token[] {
  return tokens.filter((t) => prefixes.some((p) => t.name.startsWith(p)));
}

/**
 * React hook that returns the live list of root CSS variables and
 * re-reads when the head changes (brand/density toolbar swaps the
 * <link> href, which we observe).
 */
export function useCssTokens(): Token[] {
  const [tokens, setTokens] = useState<Token[]>(() => readRootCssVariables());

  useEffect(() => {
    const update = () => setTokens(readRootCssVariables());
    // Re-read once on mount, in case stylesheets finished loading
    // after the initial render.
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["href"],
    });
    return () => observer.disconnect();
  }, []);

  return tokens;
}
