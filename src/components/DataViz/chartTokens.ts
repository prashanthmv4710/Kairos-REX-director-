// ---------------------------------------------------------------------------
// Data Visualization — color tokens
// ---------------------------------------------------------------------------
// Single source of truth for the categorical palette used by every DataViz
// chart. Values reference the LD `--ld-semantic-color-chart-categorical-*`
// foundation tokens (defined in src/themes/base.css) with hex fallbacks so
// charts still render in isolation / SSR.

export interface CategoryColor {
  /** Series / slice / stroke color. */
  fill: string;
}

const color = (n: number, fallback: string): CategoryColor => ({
  fill: `var(--ld-semantic-color-chart-categorical-${n}, ${fallback})`,
});

/** LD categorical palette (8 colors). Index 0 == chart-categorical-1. */
export const CHART_CATEGORICAL_COLORS: CategoryColor[] = [
  color(1, '#002e99'),
  color(2, '#df74b1'),
  color(3, '#cc851a'),
  color(4, '#0092db'),
  color(5, '#af2f00'),
  color(6, '#a184b2'),
  color(7, '#3f931c'),
  color(8, '#b1267d'),
];

/** Resolve a 0-based color index safely, wrapping the palette. */
export function categoryColor(index: number): CategoryColor {
  const len = CHART_CATEGORICAL_COLORS.length;
  const i = ((index % len) + len) % len;
  return CHART_CATEGORICAL_COLORS[i];
}

// Shared chart chrome.
export const CHART_TEXT_COLOR = 'var(--ld-semantic-color-text, #2e2f32)';
export const CHART_TEXT_SUBTLE = 'var(--ld-semantic-color-text-subtle, #74767c)';
export const CHART_GRID_COLOR = 'var(--ld-semantic-color-separator, #e3e4e5)';
export const CHART_AXIS_COLOR = 'var(--ld-semantic-color-separator, #e3e4e5)';
export const CHART_SURFACE = 'var(--ld-semantic-color-surface, #ffffff)';

export const CHART_FONT_FAMILY =
  "'Everyday Sans UI', 'Everyday Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
export const CHART_CAPTION_SIZE = 12;
export const CHART_CAPTION_LINE_HEIGHT = 16;
