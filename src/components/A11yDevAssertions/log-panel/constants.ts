// ---------------------------------------------------------------------------
// Shared constants for the A11y log panel — fonts, geometry, colors, edges.
// ---------------------------------------------------------------------------

export const FONT_SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
export const FONT_MONO =
  "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Courier New', monospace";

// ── Default panel geometry ───────────────────────────────────────
export const PREFERRED_WIDTH = 420;
export const PREFERRED_HEIGHT = 460;
export const MIN_WIDTH = 300;
export const MIN_HEIGHT = 200;
export const MAX_WIDTH = 800;
export const VIEWPORT_PAD = 24;
export const EDGE_SIZE = 6;
export const CORNER_SIZE = 12;
// Below this viewport width the panel goes near-full-width (mobile).
export const MOBILE_BREAKPOINT = 480;
export const SIDE_GUTTER = 16; // gap from screen edge on mobile

// ── Colors ───────────────────────────────────────────────────────
export const COLOR_RED = '#dc2626';
export const COLOR_AMBER = '#ffc220'; // --ld-semantic-color-fill-warning
export const COLOR_TEXT = '#2e2f32'; // --ld-semantic-color-text / text-onFill-warning
export const COLOR_GREEN = '#16a34a';
export const COLOR_INK = '#1f2937';
export const COLOR_MUTED = '#6b7280';
export const COLOR_SURFACE = '#ffffff';
export const COLOR_BORDER = '#e5e7eb';
export const COLOR_BG_SUBTLE = '#f3f4f6';

// ── Drag directions ──────────────────────────────────────────────
export type Edge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export const EDGE_CURSORS: Record<Edge, string> = {
  n: 'ns-resize', s: 'ns-resize', e: 'ew-resize', w: 'ew-resize',
  ne: 'nesw-resize', sw: 'nesw-resize', nw: 'nwse-resize', se: 'nwse-resize',
};
