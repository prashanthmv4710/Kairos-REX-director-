/**
 * useFixRequest — owns the agent-facing "fix this" pipeline: per-violation
 * and bulk fix requests, the pending-request UI state, and the auto-fire
 * bulk request once a page accumulates enough violations.
 *
 * Split out of the old `useA11yScan.ts` god-hook: scanning produces
 * violations, this hook reacts to them. It doesn't know how violations were
 * found, only what to do once there are some.
 */

import * as React from 'react';
import type {Violation, FixRequestPayload} from '../violation-messages';
import {buildFixRequest, buildFixAllRequest, formatAllForCopy} from '../violation-messages';
import {violationKey} from './violation-key';

const FIX_ENDPOINT = '/__ld_a11y_fix';

// Auto bulk fix-request threshold. Detection + the `.ld-a11y-report.json`
// snapshot are ALWAYS written (passive, see axe-scan.ts). The agent-actionable
// fix-request only auto-fires once the TOTAL violation count on a page
// (errors AND warnings) reaches this many — then re-arms after the count
// drops back below (or on route change). Manual "Copy prompt → paste to AI"
// still works for smaller batches. Override via VITE_LD_A11Y_FIX_THRESHOLD.
const FIX_THRESHOLD = (() => {
  // Optional chaining: import.meta.env only exists under Vite. A plain
  // Node/tsx import (e.g. this module's own test file) would otherwise throw
  // at module-load time trying to read a property off `undefined`.
  const raw = Number(import.meta.env?.VITE_LD_A11Y_FIX_THRESHOLD);
  return Number.isFinite(raw) && raw > 0 ? raw : 10;
})();

export type FixStatus = 'idle' | 'pending' | 'sent' | 'clipboard';

/**
 * Pure decision: should the bulk auto-fix-request fire for this violation
 * count? Fires at most once per "climb above threshold" crossing — `armed`
 * is true once it has already fired for the current crossing. Takes
 * `threshold` as a parameter (rather than closing over the module constant)
 * so it's unit-testable without depending on import.meta.env.
 */
export function shouldAutoFireFixRequest(violationCount: number, threshold: number, armed: boolean): boolean {
  return violationCount >= threshold && !armed;
}

/** Pure decision: has the count dropped low enough to re-arm? */
export function shouldRearmFixRequest(violationCount: number, threshold: number): boolean {
  return violationCount < threshold;
}

/**
 * Pure: which pending-fix signatures are still present in the current
 * violation list? Returns the same Set reference when nothing changed (so a
 * caller can skip a redundant setState), or a new Set with resolved
 * violations' signatures dropped.
 */
export function prunePendingFixes(pendingFixes: Set<string>, currentViolations: Violation[]): Set<string> {
  if (pendingFixes.size === 0) return pendingFixes;
  const currentSigs = new Set(currentViolations.map(violationKey));
  const stillPending = new Set<string>();
  for (const sig of pendingFixes) {
    if (currentSigs.has(sig)) stillPending.add(sig);
  }
  return stillPending.size === pendingFixes.size ? pendingFixes : stillPending;
}

async function sendFixRequest(payload: FixRequestPayload): Promise<boolean> {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') return false;
  try {
    const res = await fetch(FIX_ENDPOINT, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    });
    return res.status === 204;
  } catch {
    return false;
  }
}

export interface FixRequest {
  pendingFixes: Set<string>;
  requestFix: (violation: Violation) => Promise<FixStatus>;
  requestFixAll: () => Promise<FixStatus>;
}

/** `violations` is the live, current-page violation list from useAxeScan. */
export function useFixRequest(violations: Violation[]): FixRequest {
  const [pendingFixes, setPendingFixes] = React.useState<Set<string>>(new Set());
  const autoFixSentRef = React.useRef(false);

  // Auto-fire a bulk fix-request once the page crosses FIX_THRESHOLD; re-arm
  // once it drops back below.
  React.useEffect(() => {
    if (shouldAutoFireFixRequest(violations.length, FIX_THRESHOLD, autoFixSentRef.current)) {
      autoFixSentRef.current = true;
      void sendFixRequest(buildFixAllRequest(violations));
    } else if (shouldRearmFixRequest(violations.length, FIX_THRESHOLD)) {
      autoFixSentRef.current = false;
    }
  }, [violations]);

  // Drop pending-fix markers for violations that are no longer present
  // (resolved, or the page navigated away).
  React.useEffect(() => {
    const pruned = prunePendingFixes(pendingFixes, violations);
    if (pruned !== pendingFixes) setPendingFixes(pruned);
  }, [violations, pendingFixes]);

  const requestFix = React.useCallback(async (violation: Violation): Promise<FixStatus> => {
    const sig = violationKey(violation);
    setPendingFixes((prev) => new Set(prev).add(sig));

    const payload = buildFixRequest(violation);
    const sent = await sendFixRequest(payload);
    if (sent) return 'sent';

    const text = `[${violation.severity.toUpperCase()}] ${violation.technical}\nFix: ${violation.fix}`;
    try {
      await navigator.clipboard.writeText(text);
      return 'clipboard';
    } catch {
      return 'idle';
    }
  }, []);

  const requestFixAll = React.useCallback(async (): Promise<FixStatus> => {
    const current = violations;
    if (current.length === 0) return 'idle';

    const sigs = new Set(current.map(violationKey));
    setPendingFixes((prev) => {
      const next = new Set(prev);
      for (const s of sigs) next.add(s);
      return next;
    });

    const payload = buildFixAllRequest(current);
    const sent = await sendFixRequest(payload);
    if (sent) return 'sent';

    try {
      await navigator.clipboard.writeText(formatAllForCopy(current));
      return 'clipboard';
    } catch {
      return 'idle';
    }
  }, [violations]);

  return {pendingFixes, requestFix, requestFixAll};
}
