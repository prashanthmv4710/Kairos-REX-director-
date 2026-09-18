import * as React from 'react';
import type {Violation} from './violation-messages';
import {FONT_SANS} from './log-panel/constants';

/**
 * A11yHighlighter — popper.js-style overlay that highlights a DOM element when
 * the user hovers a violation in the log panel.
 *
 * Design constraints:
 *   • NEVER mutates the target element (no inline styles, no classes, no
 *     attributes). The target is read-only — we only call getBoundingClientRect.
 *   • NEVER affects page layout/CSS. The overlay is a single `position: fixed`
 *     box rendered inside the dev-tools portal (end of <body>) with
 *     `pointer-events: none`. Fixed + viewport coordinates means it is removed
 *     from normal flow and cannot create scrollbars or shift content — unlike a
 *     full-viewport SVG or an absolutely-positioned element with scroll math.
 *
 * Positioning: a fixed box tracks the element's viewport rect
 * (getBoundingClientRect → top/left/width/height directly, no scroll offsets).
 * We recompute on scroll (capture phase, so nested scroll containers count) and
 * resize via requestAnimationFrame.
 */

const COLOR_ERROR = '#dc2626';
const COLOR_WARNING = '#ffc220'; // --ld-semantic-color-fill-warning
const COLOR_TEXT = '#2e2f32'; // text-onFill-warning
const FILL_ERROR = 'rgba(220, 38, 38, 0.06)';
const FILL_WARNING = 'rgba(255, 194, 32, 0.12)';

const FADE_MS = 150; // fade in/out duration for the highlight overlay

// ---------------------------------------------------------------------------
// Global single-highlight registry
// ---------------------------------------------------------------------------
// There can be multiple <A11yHighlighter> instances live at once (the global
// scanner mounted in App.tsx + a demo page's own instance). To avoid two boxes
// on screen, only the MOST-RECENTLY-ACTIVATED instance renders. Activating one
// notifies the others to hide.
let nextHighlightId = 1;
let activeHighlightId: number | null = null;
const highlightListeners = new Set<() => void>();

function setActiveHighlight(id: number | null) {
  activeHighlightId = id;
  highlightListeners.forEach((l) => l());
}

interface ViewportRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/** Viewport-relative rect — exactly what `position: fixed` consumes. */
function getViewportRect(el: Element): ViewportRect {
  const r = el.getBoundingClientRect();
  return {top: r.top, left: r.left, width: r.width, height: r.height};
}

export function A11yHighlighter({
  violation,
  violationNumber,
  container = null,
}: {
  violation: Violation | null;
  violationNumber: number | null;
  /**
   * Optional positioning context. When provided (e.g. the contained scanner
   * demo's frame), the overlay positions itself ABSOLUTELY relative to this
   * element instead of `fixed` to the viewport — so the highlight stays inside
   * the canvas. Default (null) preserves the production viewport behavior.
   */
  container?: HTMLElement | null;
}): JSX.Element | null {
  const [rect, setRect] = React.useState<ViewportRect | null>(null);

  // Rect resolver: viewport-relative by default; frame-relative when contained.
  const rectFor = React.useCallback((el: Element): ViewportRect => {
    if (!container) return getViewportRect(el);
    const r = el.getBoundingClientRect();
    const c = container.getBoundingClientRect();
    return {top: r.top - c.top, left: r.left - c.left, width: r.width, height: r.height};
  }, [container]);
  const elementRef = React.useRef<Element | null>(null);
  const rafRef = React.useRef<number>(0);

  // Fade state. `shown` lags `violation` so the box can fade OUT before it
  // unmounts (e.g. when the dialog closes), rather than vanishing instantly.
  const [opacity, setOpacity] = React.useState(0);
  const [shown, setShown] = React.useState<{v: Violation; n: number | null} | null>(null);
  const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Stable per-instance id + subscription to the global active-highlight token,
  // so this instance re-renders (and hides) when another instance takes over.
  const idRef = React.useRef(0);
  if (idRef.current === 0) idRef.current = nextHighlightId++;
  const [, force] = React.useReducer((x: number) => x + 1, 0);
  React.useEffect(() => {
    highlightListeners.add(force);
    return () => {
      highlightListeners.delete(force);
      // Release ownership if we were the active highlight.
      if (activeHighlightId === idRef.current) setActiveHighlight(null);
    };
  }, []);

  const updateRect = React.useCallback(() => {
    const el = elementRef.current;
    if (!el || !document.body.contains(el)) {
      setRect(null);
      return;
    }
    setRect(rectFor(el));
  }, [rectFor]);

  // Resolve the element to highlight. The stored `element` ref is captured at
  // scan time and goes stale once its page unmounts — common for SESSION items
  // logged on another route. Fall back to re-querying by selector so clicking
  // such an item (after navigating to its page) still locates the element.
  const resolveTarget = React.useCallback((v: Violation): Element | null => {
    if (v.element && document.body.contains(v.element)) return v.element;
    try {
      const found = document.querySelector(v.selector);
      if (found) return found;
    } catch {
      /* selector may not be valid querySelector syntax */
    }
    return null;
  }, []);

  const clearHideTimer = React.useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    const fadeOut = () => {
      setOpacity(0);
      clearHideTimer();
      hideTimerRef.current = setTimeout(() => {
        setShown(null);
        setRect(null);
        elementRef.current = null;
        if (activeHighlightId === idRef.current) setActiveHighlight(null);
      }, FADE_MS);
    };

    if (!violation) {
      fadeOut();
      return clearHideTimer;
    }

    // The target may not be on the page yet — e.g. a session item on another
    // route the user just navigated to. Poll briefly (selector re-query) before
    // giving up, so the highlight lands once the destination page mounts.
    let cancelled = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 15; // ~1.5s at 100ms
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const onReposition = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateRect);
    };

    const attempt = () => {
      if (cancelled) return;
      const el = resolveTarget(violation);
      if (!el) {
        if (attempts++ < MAX_ATTEMPTS) {
          retryTimer = setTimeout(attempt, 100);
        } else {
          // Give up silently in the UI (fade out), but leave a trace in the
          // console — a session violation whose selector never resolves
          // after navigating to its route is otherwise a silent failure
          // that's hard to tell apart from "it worked but you didn't notice".
          // eslint-disable-next-line no-console
          console.warn(
            `[LD a11y] Could not locate element for "${violation.selector}" after ${MAX_ATTEMPTS * 100}ms — it may no longer exist on this page.`,
          );
          fadeOut();
        }
        return;
      }

      clearHideTimer();
      elementRef.current = el;
      setShown({v: violation, n: violationNumber});

      // Claim the single global highlight slot; any other instance hides.
      setActiveHighlight(idRef.current);

      // Bring the element into view, position the box, then fade IN next frame.
      // Passing 'smooth' explicitly overrides the CSS `scroll-behavior`
      // property, so the project's global prefers-reduced-motion guard
      // (themes/base.css's `scroll-behavior: auto !important`) can't reach
      // it unless we defer to 'auto' ourselves when the setting is on.
      const reduceMotion = typeof window !== 'undefined'
        && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'nearest'});
      rafRef.current = requestAnimationFrame(() => {
        setRect(rectFor(el));
        requestAnimationFrame(() => setOpacity(1));
      });

      document.addEventListener('scroll', onReposition, true);
      window.addEventListener('resize', onReposition);
    };

    attempt();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('scroll', onReposition, true);
      window.removeEventListener('resize', onReposition);
    };
  }, [violation, violationNumber, updateRect, clearHideTimer, resolveTarget, rectFor]);

  // Render the lagging `shown` violation (so fade-out can finish). Only the
  // active instance renders → never more than one box on screen.
  if (!rect || !shown || activeHighlightId !== idRef.current) return null;

  const v = shown.v;
  const num = shown.n;
  const isWarning = v.severity === 'warning';
  const severityColor = isWarning ? COLOR_WARNING : COLOR_ERROR;
  const severityFill = isWarning ? FILL_WARNING : FILL_ERROR;
  const labelTextColor = isWarning ? COLOR_TEXT : '#fff';

  // Label sits just above the box, clamped to the viewport top.
  const labelTop = Math.max(4, rect.top - 32);

  return (
    <div
      data-ld-a11y-ignore="true"
      data-ld-a11y-devtool="true"
      style={{opacity, transition: `opacity ${FADE_MS}ms ease`}}
    >
      {/* Highlight box — viewport-fixed by default, frame-absolute when contained. */}
      <div
        style={{
          position: container ? 'absolute' : 'fixed',
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          border: `2px solid ${severityColor}`,
          background: severityFill,
          borderRadius: 2,
          boxSizing: 'border-box',
          pointerEvents: 'none',
          zIndex: 2147483640,
        }}
      />

      {/* Floating label: number badge + message. */}
      <div
        style={{
          position: container ? 'absolute' : 'fixed',
          top: labelTop,
          left: rect.left,
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          maxWidth: '90vw',
          pointerEvents: 'none',
          zIndex: 2147483641,
        }}
      >
        {num != null && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 22,
              height: 22,
              padding: '0 6px',
              background: severityColor,
              color: labelTextColor,
              fontSize: 11,
              fontFamily: FONT_SANS,
              fontWeight: 700,
              borderRadius: '4px 0 0 4px',
              lineHeight: 1,
            }}
          >
            {num}
          </span>
        )}
        <span
          style={{
            maxWidth: 340,
            padding: '4px 10px',
            background: severityColor,
            color: labelTextColor,
            fontSize: 12,
            fontFamily: FONT_SANS,
            fontWeight: 500,
            borderRadius: num != null ? '0 4px 4px 0' : 4,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: '14px',
          }}
        >
          {v.simplified}
        </span>
      </div>
    </div>
  );
}
