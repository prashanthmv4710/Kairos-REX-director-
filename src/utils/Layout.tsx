import * as React from 'react';

/**
 * Responsive layout system, anchored to the canonical Living Design
 * breakpoints in `src/themes/base.css` (sourced from Airtable view
 * `viw3aImoD7tLBVm7S`). The five tiers are the only allowed responsive
 * thresholds in this project — see `src/context/agents.mdc` for the rule.
 *
 * Why this lives in `src/utils/` and not in component CSS:
 *   • CSS `@media` cannot read `var()`, so we can't drive media queries from
 *     the synced custom properties. Instead, we hard-code the matching pixel
 *     values here (the only place outside base.css that does so) and expose
 *     them as React state. Component CSS still uses rem literals that match
 *     these pixel values numerically.
 *   • `useInitializeLayout()` runs once at app boot (in App.tsx) and writes
 *     `data-ld-viewport` on `<html>`. Pure-CSS components can hook into it
 *     via `[data-ld-viewport="small"]` selectors without needing JS.
 *   • Components that need to react in JS use `useViewport()`.
 */

export const BREAKPOINTS_PX = {
  small: 0,
  medium: 600,
  large: 900,
  xLarge: 1200,
  xxLarge: 1920,
} as const;

export type ViewportTier = keyof typeof BREAKPOINTS_PX;

const TIER_ORDER: ViewportTier[] = ['small', 'medium', 'large', 'xLarge', 'xxLarge'];

/** Resolve a width in px to its canonical tier. */
function widthToTier(widthPx: number): ViewportTier {
  let tier: ViewportTier = 'small';
  for (const t of TIER_ORDER) {
    if (widthPx >= BREAKPOINTS_PX[t]) tier = t;
  }
  return tier;
}

function readTier(): ViewportTier {
  if (typeof window === 'undefined') return 'small';
  return widthToTier(window.innerWidth);
}

const VIEWPORT_EVENT = 'ld-kit-viewport-change';

/**
 * Install matchMedia listeners for every canonical boundary, write the
 * current tier onto `<html data-ld-viewport>`, and dispatch a custom event
 * so subscribers (`useViewport`) can rerender. Idempotent; safe to call
 * multiple times.
 */
export function useInitializeLayout(): void {
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const apply = () => {
      const tier = readTier();
      document.documentElement.setAttribute('data-ld-viewport', tier);
      window.dispatchEvent(new CustomEvent(VIEWPORT_EVENT, {detail: {tier}}));
    };

    apply();

    // One MQL per tier boundary — fires only when crossing a canonical line,
    // which is much cheaper than listening to every resize event.
    const mqls: MediaQueryList[] = [];
    const onChange = () => apply();
    for (const t of TIER_ORDER) {
      const px = BREAKPOINTS_PX[t];
      if (px === 0) continue;
      const mql = window.matchMedia(`(min-width: ${px}px)`);
      mql.addEventListener('change', onChange);
      mqls.push(mql);
    }

    return () => {
      for (const mql of mqls) mql.removeEventListener('change', onChange);
    };
  }, []);
}

/**
 * Subscribe to the active viewport tier and a few common booleans derived
 * from it. Updates only when crossing a canonical boundary.
 */
export function useViewport(): {
  tier: ViewportTier;
  /** True below `large` — i.e. small or medium. */
  isMobile: boolean;
  /** True at or above `medium` (>= 600px). */
  isAtLeastMedium: boolean;
  /** True at or above `large` (>= 900px). */
  isAtLeastLarge: boolean;
  /** True at or above `xLarge` (>= 1200px). */
  isAtLeastXLarge: boolean;
  /** True at or above `xxLarge` (>= 1920px). */
  isAtLeastXxLarge: boolean;
} {
  const [tier, setTier] = React.useState<ViewportTier>(readTier);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const onChange = (e: Event) => {
      const next = (e as CustomEvent).detail?.tier as ViewportTier | undefined;
      if (next) setTier(next);
    };
    window.addEventListener(VIEWPORT_EVENT, onChange);
    // Resync on mount in case useInitializeLayout hasn't run yet.
    setTier(readTier());
    return () => window.removeEventListener(VIEWPORT_EVENT, onChange);
  }, []);

  const tierIndex = TIER_ORDER.indexOf(tier);
  return {
    tier,
    isMobile: tierIndex < TIER_ORDER.indexOf('large'),
    isAtLeastMedium: tierIndex >= TIER_ORDER.indexOf('medium'),
    isAtLeastLarge: tierIndex >= TIER_ORDER.indexOf('large'),
    isAtLeastXLarge: tierIndex >= TIER_ORDER.indexOf('xLarge'),
    isAtLeastXxLarge: tierIndex >= TIER_ORDER.indexOf('xxLarge'),
  };
}
