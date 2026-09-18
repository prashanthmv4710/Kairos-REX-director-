/**
 * useAxeScan — owns the MutationObserver lifecycle and the axe-core scan
 * loop. Given the pure scanning logic in `axe-scan.ts`, this hook is
 * responsible only for *when* to scan (debounced DOM mutations + route
 * changes) and turning each scan's outcome into reactive state: the current
 * violations, which ones are newly-appeared, and how many just resolved.
 *
 * Session-log and route-history bookkeeping are delegated to their own
 * hooks (passed in as callbacks) rather than inlined here — this hook only
 * decides *that* a scan happened and reports the result outward.
 *
 * Production no-op: returns empty violations and never installs the observer.
 */

import * as React from 'react';
import type {Violation} from '../violation-messages';
import {runAxeScan, reportViolations, AGENT_HINT} from './axe-scan';
import {violationKey} from './violation-key';

// Long enough for axe to see a settled DOM after HMR/render churn. axe-core
// runs synchronously over the whole document on every fire, so a page with a
// spinner, polling fetch, or transitioning aria-* attribute re-scans on this
// cadence indefinitely — override upward (e.g. on a known-heavy page) via
// VITE_LD_A11Y_SCAN_DEBOUNCE_MS, same override pattern as FIX_THRESHOLD.
const SCAN_DEBOUNCE_MS = (() => {
  // Optional chaining: import.meta.env only exists under Vite.
  const raw = Number(import.meta.env?.VITE_LD_A11Y_SCAN_DEBOUNCE_MS);
  return Number.isFinite(raw) && raw > 0 ? raw : 600;
})();

export interface AxeScanCallbacks {
  onScan: (real: Violation[], url: string, timestamp: string) => void;
}

export interface AxeScanResult {
  violations: Violation[];
  demoViolations: Violation[];
  newViolations: Violation[];
  resolvedCount: number;
  /** True while an axe-core pass is in flight — drives the FAB's scanning indicator. */
  scanning: boolean;
}

export function useAxeScan({onScan}: AxeScanCallbacks): AxeScanResult {
  const [violations, setViolations] = React.useState<Violation[]>([]);
  const [demoViolations, setDemoViolations] = React.useState<Violation[]>([]);
  const [newViolations, setNewViolations] = React.useState<Violation[]>([]);
  const [resolvedCount, setResolvedCount] = React.useState(0);
  const [scanning, setScanning] = React.useState(false);
  const prevSigsRef = React.useRef<Set<string>>(new Set());
  // Tracks the previous violation count purely (read, never mutated, inside
  // a state updater) so resolvedCount can be derived without an impure
  // setState updater that calls other setters / mutates refs.
  const violationsRef = React.useRef<Violation[]>([]);
  const onScanRef = React.useRef(onScan);
  onScanRef.current = onScan;

  React.useEffect(() => {
    if (import.meta.env?.MODE === 'production') return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    let running = false;
    // A mutation can be observed while a scan is still awaiting axe-core.
    // Rather than drop it (leaving violations/reporting stale until the next
    // unrelated mutation), remember that a rescan was requested and run one
    // more pass immediately after the current one finishes.
    let rescanRequested = false;
    let lastReportedSig = '';

    const runScan = async () => {
      if (running) {
        rescanRequested = true;
        return;
      }
      running = true;
      timer = null;
      setScanning(true);

      try {
        const {real, demo} = await runAxeScan();
        const url = window.location?.href ?? '';
        const timestamp = new Date().toISOString();

        setDemoViolations((prev) => {
          const sigOf = (vs: Violation[]) => JSON.stringify(vs.map(violationKey));
          return sigOf(prev) === sigOf(demo) ? prev : demo;
        });

        if (real.length > 0) {
          const issueStrings = real.map((v) => v.technical);
          const sig = JSON.stringify(issueStrings);

          // Only log/report when the violation set actually changed — the
          // scanner re-runs on every qualifying DOM mutation (roughly every
          // 600ms on a busy page), so logging unconditionally would flood
          // the console with identical output on every tick.
          if (sig !== lastReportedSig) {
            lastReportedSig = sig;
            const message = issueStrings.map((v, i) => `  ${i + 1}. ${v}`).join('\n');
            const formatted = `LD a11y (axe): ${real.length} violation(s) at ${url} — ${timestamp}\n${message}\n\n${AGENT_HINT}`;
            // eslint-disable-next-line no-console
            console.error(formatted);
            const errorCount = real.filter((v) => v.severity === 'error').length;
            reportViolations(issueStrings, url, timestamp, errorCount);
          }
        } else if (lastReportedSig !== '') {
          lastReportedSig = '';
          reportViolations([], url, timestamp, 0);
        }

        // Pure computation first — no setters, no ref mutations — so this
        // stays StrictMode-safe even if React ever re-invokes this pass.
        const prevSigs = prevSigsRef.current;
        const currentSigs = new Set(real.map(violationKey));
        const fresh = real.filter((v) => !prevSigs.has(violationKey(v)));
        const prevCount = violationsRef.current.length;

        // Mutations, outside any updater.
        prevSigsRef.current = currentSigs;
        violationsRef.current = real;

        // Flat, pure state updates — React batches these automatically.
        setViolations(real);
        // Always reflect this scan's freshly-appeared violations, including
        // clearing to [] when there are none — otherwise a stale non-empty
        // `newViolations` from an earlier scan can keep the popover showing
        // violations that no longer exist.
        setNewViolations(fresh);
        if (prevCount > 0 && real.length < prevCount) {
          setResolvedCount(prevCount - real.length);
        } else if (real.length === 0 && prevCount > 0) {
          setResolvedCount(prevCount);
        }

        // Downstream bookkeeping (session log, route history, fix-request
        // threshold) is owned by whoever passed in `onScan` — this hook's
        // job ends at "here's what's on the page right now".
        onScanRef.current(real, url, timestamp);
      } catch (err) {
        // axe unavailable or threw — degrade gracefully, don't crash the app.
        // eslint-disable-next-line no-console
        console.warn('[LD a11y] axe-core scan failed:', err);
      } finally {
        running = false;
        if (rescanRequested) {
          rescanRequested = false;
          // A rescan is queued immediately — stay in the scanning state
          // rather than flickering false/true between passes.
          void runScan();
        } else {
          setScanning(false);
        }
      }
    };

    /**
     * True if every node in a mutation batch originated from our own scanner
     * UI (FAB badge updates, panel re-renders, etc). Filtering these prevents
     * an infinite scan → render → mutation loop.
     */
    const isDevToolMutation = (m: MutationRecord): boolean => {
      let node: Node | null = m.target;
      while (node instanceof Element) {
        if (node.hasAttribute('data-ld-a11y-devtool')) return true;
        node = node.parentElement;
      }
      return false;
    };

    const schedule = (mutations?: MutationRecord[]) => {
      if (mutations && mutations.length > 0 && mutations.every(isDevToolMutation)) return;
      if (timer != null) clearTimeout(timer);
      timer = setTimeout(() => { void runScan(); }, SCAN_DEBOUNCE_MS);
    };

    schedule();

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [
        'alt', 'aria-label', 'aria-labelledby', 'aria-hidden',
        'aria-pressed', 'aria-checked', 'role', 'href', 'id', 'tabindex',
      ],
    });

    // Route change — rescan the new page, reset "new violation" tracking.
    // The element refs from the previous route are stale once it unmounts.
    const onRouteChange = () => {
      prevSigsRef.current = new Set();
      lastReportedSig = '';
      schedule();
    };
    window.addEventListener('hashchange', onRouteChange);
    window.addEventListener('popstate', onRouteChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', onRouteChange);
      window.removeEventListener('popstate', onRouteChange);
      if (timer != null) clearTimeout(timer);
    };
  }, []);

  // Auto-clear the "just resolved N issues" banner after a few seconds.
  React.useEffect(() => {
    if (resolvedCount > 0) {
      const t = setTimeout(() => setResolvedCount(0), 3000);
      return () => clearTimeout(t);
    }
  }, [resolvedCount]);

  return {violations, demoViolations, newViolations, resolvedCount, scanning};
}
