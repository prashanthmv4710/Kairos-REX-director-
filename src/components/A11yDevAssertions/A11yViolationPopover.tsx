import * as React from 'react';
import type {Violation} from './violation-messages';
import {FONT_SANS} from './log-panel/constants';

/**
 * A11yViolationPopover — compact summary that proactively surfaces new
 * violations near the FAB in Pre-ship mode.
 *
 * This is the key UX differentiator between Ideation and Pre-ship:
 *
 *   • Ideation — FAB count updates silently, user clicks to explore.
 *   • Pre-ship — this popover appears automatically when the scanner
 *     finds *new* violations, showing a quick summary with the option
 *     to open the full log panel or dismiss.
 *
 * Auto-dismisses after 10 s if not interacted with.
 * Not shown when the log panel is already open.
 */

const COLOR_RED = '#ea1100';
const COLOR_AMBER = '#995213';
const COLOR_WHITE = '#ffffff';
const COLOR_SUBTLE = '#9ca3af'; // dismiss affordance
const COLOR_INK = '#1f2937';    // primary popover text + action fill
const COLOR_MUTED = '#6b7280';  // secondary summary text

const AUTO_DISMISS_MS = 10_000;

export interface A11yViolationPopoverProps {
  /** Violations that are new since the last scan — gates whether the popover appears. */
  newViolations: Violation[];
  /**
   * All current violations. The summary counts reflect this total so the popover
   * stays in sync with the FAB badge (which also shows the total count).
   * Optional — defaults to `newViolations` when a caller doesn't supply it.
   */
  violations?: Violation[];
  /** Called when the user clicks "Review" to open the full panel. */
  onReview: () => void;
  /** Called when the user dismisses or the auto-dismiss fires. */
  onDismiss: () => void;
  /**
   * Copy the fix prompt for an AI agent (clipboard + agent-agnostic request
   * file). When provided AND the total exceeds NUDGE_THRESHOLD, the popover
   * surfaces a one-tap "Copy prompt → paste to AI" CTA — a suggestion, never an
   * automatic action.
   */
  onCopyForAI?: () => void;
}

// Show the proactive "Copy prompt → paste to AI" nudge only when there are MORE than
// this many issues (i.e. 6+). Below it, a manual review is the lighter touch.
const NUDGE_THRESHOLD = 5;

export function A11yViolationPopover({
  newViolations = [],
  // Fall back to the fresh set when an "all violations" list isn't supplied,
  // so the popover never crashes on a partial caller.
  violations = newViolations,
  onReview,
  onDismiss,
  onCopyForAI,
}: A11yViolationPopoverProps): JSX.Element | null {
  const [visible, setVisible] = React.useState(false);
  // Paused by hover OR focus — a keyboard/screen-reader user tabbing toward
  // "Review" must be able to stop the countdown too (WCAG 2.2.1 Timing
  // Adjustable), not just a mouse user.
  const [paused, setPaused] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fade-in on mount
  React.useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Auto-dismiss (paused while hovered or focused)
  React.useEffect(() => {
    if (paused) return;

    timerRef.current = setTimeout(() => {
      setVisible(false);
      // Allow the fade-out transition to finish before unmounting. Reuse the
      // same ref slot (the outer timer has already fired) so this inner
      // timeout is also cancelled by the cleanup below if the component
      // unmounts mid-fade (route change, panel opened, violations resolved).
      timerRef.current = setTimeout(onDismiss, 200);
    }, AUTO_DISMISS_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [paused, onDismiss]);

  if (newViolations.length === 0) return null;

  // Summary counts reflect ALL current violations so the popover matches the
  // FAB badge total, rather than only the freshly-detected subset.
  const errorCount = violations.filter((v) => v.severity === 'error').length;
  const warningCount = violations.filter((v) => v.severity === 'warning').length;

  return (
    <div
      data-ld-a11y-ignore="true"
      data-ld-a11y-devtool="true"
      role="status"
      aria-live="polite"
      // No aria-label here — a live region's label REPLACES its inner text
      // for the announcement, so a label would swallow the error/warning
      // breakdown and the "Review" / "Copy prompt" buttons that follow.
      // Letting the region announce its own (already well-written) content
      // is correct.
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      style={{
        position: 'fixed',
        bottom: 132,
        right: 22,
        width: 340,
        background: COLOR_WHITE,
        borderRadius: 12,
        boxShadow:
          '0 8px 30px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08)',
        fontFamily: FONT_SANS,
        zIndex: 2147483644,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        overflow: 'hidden',
      }}
    >
      {/* Dismiss */}
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onDismiss}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 14,
          color: COLOR_SUBTLE,
          padding: '2px 4px',
          lineHeight: 1,
          zIndex: 1,
        }}
      >
        ✕
      </button>

      {/* Centered icon */}
      <div style={{padding: '20px 14px 0', textAlign: 'center'}}>
        <svg aria-hidden="true" width="32" height="32" viewBox="0 0 16 16" fill="none" style={{color: COLOR_RED}}>
          <path d="M5.2.98h5.6L15 5.2v5.6L10.8 15H5.2L1 10.8V5.2L5.2.98Z" fill="currentColor" />
          <text x="8" y="12" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="sans-serif">!</text>
        </svg>
      </div>

      {/* Title — number-forward */}
      <div style={{padding: '8px 14px 0', textAlign: 'center', fontSize: 18, fontWeight: 600, color: COLOR_INK}}>
        {violations.length} accessibility issue{violations.length !== 1 ? 's' : ''}
      </div>

      {/* Summary — only the non-zero parts */}
      <div style={{padding: '4px 14px 0', textAlign: 'center', fontSize: 14, color: COLOR_MUTED}}>
        {[
          errorCount > 0 ? `${errorCount} error${errorCount !== 1 ? 's' : ''}` : null,
          warningCount > 0 ? `${warningCount} warning${warningCount !== 1 ? 's' : ''}` : null,
        ].filter(Boolean).join(' · ') || 'on this page'}
      </div>

      {/* Actions */}
      <div
        style={{
          padding: '16px 14px 16px',
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <button
          type="button"
          onClick={onReview}
          style={{
            padding: '6px 16px',
            fontSize: 12,
            fontWeight: 600,
            fontFamily: FONT_SANS,
            color: violations.length > NUDGE_THRESHOLD && onCopyForAI ? '#1f2937' : COLOR_WHITE,
            background: violations.length > NUDGE_THRESHOLD && onCopyForAI ? 'transparent' : '#1f2937',
            border: violations.length > NUDGE_THRESHOLD && onCopyForAI ? '1px solid #d1d5db' : 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Review
        </button>
        {/* Proactive nudge — only a SUGGESTION, shown when issues exceed the
            threshold. Copies the prompt for any AI agent. Never auto-fires. */}
        {violations.length > NUDGE_THRESHOLD && onCopyForAI && (
          <button
            type="button"
            onClick={() => { onCopyForAI(); onDismiss(); }}
            style={{
              padding: '6px 16px',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: FONT_SANS,
              color: COLOR_WHITE,
              background: COLOR_INK,
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Copy prompt → paste to AI
          </button>
        )}
      </div>

      {/* Nubbin / arrow pointing down toward the FAB */}
      <div
        style={{
          position: 'absolute',
          bottom: -6,
          right: 20,
          width: 12,
          height: 12,
          background: COLOR_WHITE,
          transform: 'rotate(45deg)',
          boxShadow: '2px 2px 4px rgba(0,0,0,0.06)',
        }}
      />
    </div>
  );
}
