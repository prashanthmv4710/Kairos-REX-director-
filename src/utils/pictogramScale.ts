/* ── Pictogram Scale ──────────────────────────────────────────────
 *  Single source of truth for sizing Lottie/dotLottie marks (the generic
 *  agent emotes, etc.) off the Living Design
 *  pictogram scale (`--ld-semantic-scale-pictogram-*` in base.css)
 *  instead of one-off pixel numbers. Every Lottie render — in the
 *  Lottie docs gallery and in live product surfaces like
 *  AgentFrameworkPage — should size itself from `PICTOGRAM_SIZE_VAR` so
 *  the whole app shares the same finite set of Lottie sizes.
 * ─────────────────────────────────────────────────────────────── */

export type PictogramSize = 'small' | 'medium' | 'large' | 'x-large';

/** Token → CSS value, with the current base.css value inlined as a
 *  fallback in case the custom property isn't defined (e.g. SSR). */
export const PICTOGRAM_SIZE_VAR: Record<PictogramSize, string> = {
  small: 'var(--ld-semantic-scale-pictogram-small, 3rem)',
  medium: 'var(--ld-semantic-scale-pictogram-medium, 3.5rem)',
  large: 'var(--ld-semantic-scale-pictogram-large, 4rem)',
  'x-large': 'var(--ld-semantic-scale-pictogram-x-large, 4.5rem)',
};
