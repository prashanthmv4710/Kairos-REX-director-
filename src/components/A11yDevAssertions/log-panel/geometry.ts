import {
  PREFERRED_WIDTH,
  PREFERRED_HEIGHT,
  MIN_WIDTH,
  VIEWPORT_PAD,
  MOBILE_BREAKPOINT,
  SIDE_GUTTER,
} from './constants';

/**
 * Optional bounds for embedded/contained mode. When passed (by the inert demo),
 * default size/position and drag clamps resolve against these frame dimensions
 * instead of the window. When omitted — the production global scanner path —
 * every code path below falls back to `window` exactly as before, so behavior
 * is byte-for-byte identical.
 */
export interface Bounds {
  width: number;
  height: number;
}

const winW = () => (typeof window !== 'undefined' ? window.innerWidth : 1024);
const winH = () => (typeof window !== 'undefined' ? window.innerHeight : 768);

/** Effective viewport width — the embed frame's width when embedded, else the window. */
export const boundsW = (b?: Bounds) => (b ? b.width : winW());
/** Effective viewport height — the embed frame's height when embedded, else the window. */
export const boundsH = (b?: Bounds) => (b ? b.height : winH());

/** Viewport-aware default size — never wider/taller than the screen (or frame) allows. */
export function defaultSize(bounds?: Bounds) {
  const w = boundsW(bounds);
  const h = boundsH(bounds);
  if (w < MOBILE_BREAKPOINT) {
    return {
      width: Math.max(MIN_WIDTH - 40, w - SIDE_GUTTER * 2),
      height: Math.min(PREFERRED_HEIGHT, h - 100),
    };
  }
  return {
    width: Math.min(PREFERRED_WIDTH, w - VIEWPORT_PAD * 2),
    height: Math.min(PREFERRED_HEIGHT, h - VIEWPORT_PAD * 2),
  };
}

/** Compute default top/left from bottom-right anchor, clamped on-screen (or in-frame). */
export function defaultPosition(bounds?: Bounds) {
  const w = boundsW(bounds);
  const h = boundsH(bounds);
  const {width, height} = defaultSize(bounds);
  if (w < MOBILE_BREAKPOINT) {
    // Center horizontally, anchor near the bottom above the FAB.
    return {x: Math.max(SIDE_GUTTER, (w - width) / 2), y: Math.max(VIEWPORT_PAD, h - 88 - height)};
  }
  return {x: Math.max(VIEWPORT_PAD, w - 22 - width), y: Math.max(VIEWPORT_PAD, h - 132 - height)};
}
