// @refresh reset

/**
 * @module A11yDevAssertions
 *
 * # CRITICAL AGENT DIRECTIVE - HARD STOP
 * 
 * This file is read-only output. Treat it as immutable.
 * 
 * - NEVER edit this file directly.
 * - NEVER apply "quick fixes" in this file.
 * - NEVER reformat, refactor, or rewrite content in place.
 * - NEVER treat this file as the source of truth.
 * 
 * If behavior must change, modify the upstream source of this content (the canonical source), not this copy.
 * 
 * Any direct edits in this file are invalid and must be rejected.
 *
 * For prop API + usage notes, read `A11yDevAssertions.md` in this folder
 * or run `npm run ld-kit -- show A11yDevAssertions`.
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import type {Violation} from './violation-messages';
import {formatAllForCopy} from './violation-messages';
import {useA11yScan} from './useA11yScan';
import {A11yFab} from './A11yFab';
import {A11yLogPanel} from './A11yLogPanel';
import {A11yHighlighter} from './A11yHighlighter';
import {A11yViolationPopover} from './A11yViolationPopover';
import {isReportOnlyMode} from './scan/report-only';

/**
 * A11yDevAssertions — dev-only runtime scanner.
 *
 * Mounts once at the root of the app (above your Page). Watches the DOM with
 * a MutationObserver and runs a battery of accessibility checks. On violation
 * it fires THREE parallel signals:
 *
 *   1. logs to the browser console with a `[LD a11y]` prefix
 *   2. POSTs a structured report to `/__ld_a11y_report` so the Vite dev
 *      server plugin prints it to THE TERMINAL the agent is running, writes
 *      `.ld-a11y-report.json`, and serves a live snapshot at the same URL
 *   3. renders a non-blocking floating action button (FAB) at the bottom-right
 *      with a count badge. Clicking the FAB opens a log panel to its left
 *      with violation details, hover-to-highlight, and copy-to-agent support
 *
 * The FAB only renders while there's something to act on — red/amber badge
 * with the violation count. On a clean page it stays out of the way rather
 * than sitting there with a green ✓; Ctrl/Cmd+Shift+A summons it anyway (the
 * "is this tool alive" check), and hides it again on a second press. New
 * violations surface via a proactive popover near the FAB. Push gate modal
 * shown when navigating away with violations.
 *
 * Escape hatch: add `data-ld-a11y-ignore` to any element you genuinely need
 * to exempt (third-party embeds, etc.). Every opt-out should come with a
 * justification the user approved. Do not add this to silence a real defect.
 */

// ---------------------------------------------------------------------------
// Singleton portal host
// ---------------------------------------------------------------------------
// All scanner UI renders into ONE stable host element (`#ld-a11y-devtools-root`).
// This guarantees a single FAB even when:
//   • Vite HMR / Fast Refresh re-mounts the component (old portal can't orphan)
//   • the component is accidentally mounted more than once (only the first
//     instance claims ownership; the rest render null)
const HOST_ID = 'ld-a11y-devtools-root';

// Ownership is tracked as a property on the host DOM NODE itself, not a
// module-level `let`. A plain module variable gets reset to its initial
// value whenever Vite Fast Refresh re-evaluates this module — independent of
// whether this component's own hooks re-ran — so a later real unmount's
// cleanup closure (holding the *old* owner symbol) would compare against a
// freshly-reset variable, always fail the check, and skip removing the host,
// permanently orphaning it. The DOM node survives module re-evaluation, so a
// property on it does not have this problem.
const OWNER_ATTR = '__ldA11yHostOwner';
type OwnedNode = HTMLElement & {[OWNER_ATTR]?: symbol};

function useSingletonHost(): HTMLElement | null {
  const [host, setHost] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    if (typeof document === 'undefined') return;

    let el = document.getElementById(HOST_ID) as OwnedNode | null;
    let created = false;
    if (!el) {
      el = document.createElement('div') as OwnedNode;
      el.id = HOST_ID;
      el.setAttribute('data-ld-a11y-ignore', 'true');
      el.setAttribute('data-ld-a11y-devtool', 'true');
      document.body.appendChild(el);
      created = true;
    }

    // Another live instance already owns the host — this one is a no-op.
    if (el[OWNER_ATTR]) return;

    const owner = Symbol('ld-a11y-host');
    el[OWNER_ATTR] = owner;
    setHost(el);

    return () => {
      if (el![OWNER_ATTR] !== owner) return;
      delete el![OWNER_ATTR];
      if (created && el?.parentNode) el.parentNode.removeChild(el);
      setHost(null);
    };
  }, []);

  return host;
}

export function A11yDevAssertions(): JSX.Element | null {
  const {violations, newViolations, resolvedCount, showPopover, setShowPopover, requestFix, requestFixAll, pendingFixes, history, sessionViolations, clearSessionLog, demoViolations, scanning} = useA11yScan();
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [hoveredViolation, setHoveredViolation] = React.useState<Violation | null>(null);
  const [hoveredViolationNumber, setHoveredViolationNumber] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isDraggingRef = React.useRef(false);

  // Ctrl/Cmd+Shift+A summons the FAB on an otherwise-clean page (the "is this
  // tool alive" check) and hides it again on a second press. Irrelevant once
  // there are real violations — those keep the FAB up regardless.
  const [forcedVisible, setForcedVisible] = React.useState(false);
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setForcedVisible((prev) => !prev);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const host = useSingletonHost();
  // The FAB just toggles the panel. The agent-actionable fix-request fires
  // automatically at the threshold (see FIX_THRESHOLD in useA11yScan), or
  // manually via the panel's "Copy prompt → paste to AI" button — not on open.
  const togglePanel = React.useCallback(() => setPanelOpen((prev) => !prev), []);

  const handleDragStateChange = React.useCallback((dragging: boolean) => {
    isDraggingRef.current = dragging;
  }, []);

  // Hide popover when the panel is opened (user is already reviewing)
  React.useEffect(() => {
    if (panelOpen) setShowPopover(false);
  }, [panelOpen, setShowPopover]);

  // Clear the on-page highlight when the panel closes — it fades out smoothly.
  React.useEffect(() => {
    if (!panelOpen) {
      setHoveredViolation(null);
      setHoveredViolationNumber(null);
    }
  }, [panelOpen]);

  // Close on Escape
  React.useEffect(() => {
    if (!panelOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPanelOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [panelOpen]);

  // Close on click-outside (skip when panel is being dragged/resized)
  React.useEffect(() => {
    if (!panelOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (isDraggingRef.current) return;
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [panelOpen]);

  // Once the page is clean and the shortcut hasn't summoned it, there's
  // nothing to act on — close the panel it might have been left open with.
  const isClean = violations.length === 0;
  React.useEffect(() => {
    if (isClean && !forcedVisible) setPanelOpen(false);
  }, [isClean, forcedVisible]);

  // No host yet (still mounting) or another instance owns it → render nothing.
  // Headless Playwright/axe scan (scripts/a11y/scan.mjs) appends this flag so
  // our own UI doesn't render into the page during automated runs — it does
  // its own independent axe-core pass and would otherwise get a FAB/panel in
  // every screenshot and DOM snapshot it takes.
  if (typeof document === 'undefined' || !host) return null;
  if (typeof window !== 'undefined' && isReportOnlyMode(window.location.search)) return null;
  // Clean page, shortcut not pressed → stay out of the way entirely.
  if (isClean && !forcedVisible) return null;

  const errorCount = violations.filter((v) => v.severity === 'error').length;
  const warningCount = violations.filter((v) => v.severity === 'warning').length;

  return ReactDOM.createPortal(
    <div ref={containerRef} data-ld-a11y-ignore="true" data-ld-a11y-devtool="true">
      {/* FAB — visible whenever there are violations, or the shortcut summoned it */}
      <A11yFab
        violationCount={violations.length}
        errorCount={errorCount}
        warningCount={warningCount}
        resolvedCount={resolvedCount}
        scanning={scanning}
        panelOpen={panelOpen}
        onTogglePanel={togglePanel}
      />

      {/* Log panel — opens to the left of the FAB */}
      {panelOpen && (
        <A11yLogPanel
          violations={violations}
          demoViolations={demoViolations}
          sessionViolations={sessionViolations}
          onClearSessionLog={clearSessionLog}
          resolvedCount={resolvedCount}
          history={history}
          onClose={() => setPanelOpen(false)}
          onHoverViolation={(v, num) => { setHoveredViolation(v); setHoveredViolationNumber(num); }}
          onRequestFix={requestFix}
          onRequestFixAll={requestFixAll}
          pendingFixes={pendingFixes}
          onDragStateChange={handleDragStateChange}
        />
      )}

      {!panelOpen && showPopover && (
        <A11yViolationPopover
          newViolations={newViolations}
          violations={violations}
          onReview={() => {
            setShowPopover(false);
            setPanelOpen(true);
          }}
          onDismiss={() => setShowPopover(false)}
          onCopyForAI={async () => {
            try { await navigator.clipboard.writeText(formatAllForCopy(violations)); } catch { /* noop */ }
            void requestFixAll();
          }}
        />
      )}

      <A11yHighlighter violation={hoveredViolation} violationNumber={hoveredViolationNumber} />
    </div>,
    host,
  );
}

A11yDevAssertions.displayName = 'A11yDevAssertions';
