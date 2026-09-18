/**
 * useA11yScan — axe-core powered a11y dev assertions hook.
 *
 * This is a thin composition layer, not the implementation. Each concern
 * lives in its own focused hook under `./scan/`:
 *   - useAxeScan            — MutationObserver lifecycle + axe-core scan loop
 *   - useSessionLog         — cross-navigation accumulated violation log
 *   - useRouteHistory       — per-route violation summary / running tally
 *   - usePopoverThreshold   — when the proactive violation popover shows
 *   - useFixRequest         — per-violation / bulk "request a fix" pipeline
 *
 * (Previously this was a single ~600-line hook mixing all five concerns plus
 * two bare module-level `Map`s mutated ad hoc from inside effects. Splitting
 * it keeps each concern independently readable/testable and moves the
 * module-level state behind proper external-store hooks instead of manual
 * `useState` synchronization scattered through one giant effect.)
 *
 * Production no-op: returns empty violations and never installs the observer
 * (enforced inside useAxeScan).
 */

import * as React from 'react';
import type {Violation} from './violation-messages';
import {useAxeScan} from './scan/useAxeScan';
import {useSessionLog, type LoggedViolation} from './scan/session-log-store';
import {useRouteHistory, currentRouteKey, type ScanHistory} from './scan/route-history-store';
import {usePopoverThreshold} from './scan/usePopoverThreshold';
import {useFixRequest, type FixStatus} from './scan/useFixRequest';

export type {FixStatus};

export interface UseA11yScanResult {
  violations: Violation[];
  newViolations: Violation[];
  resolvedCount: number;
  showPopover: boolean;
  setShowPopover: React.Dispatch<React.SetStateAction<boolean>>;
  requestFix: (violation: Violation) => Promise<FixStatus>;
  requestFixAll: () => Promise<FixStatus>;
  pendingFixes: Set<string>;
  /** Cross-route running tally (pages scanned / total issues). */
  history: ScanHistory;
  /** Every distinct violation seen this session, accumulated across pages. */
  sessionViolations: LoggedViolation[];
  /** Clear the accumulated session log. */
  clearSessionLog: () => void;
  /**
   * Intentional demo defects (inside `data-ld-a11y-demo`). Display-only —
   * excluded from `violations`, the FAB badge, session log, tracker, and
   * fixes. Surfaced separately so demo pages can still show detection.
   */
  demoViolations: Violation[];
  /** True while an axe-core pass is in flight — drives the FAB's scanning indicator. */
  scanning: boolean;
}

export function useA11yScan(): UseA11yScanResult {
  const {sessionViolations, recordSession, clearSessionLog} = useSessionLog();
  const {history, recordRoute} = useRouteHistory();

  const onScan = React.useCallback(
    (real: Violation[], url: string, timestamp: string) => {
      recordSession(real, url);
      const errorCount = real.filter((v) => v.severity === 'error').length;
      recordRoute(currentRouteKey(), {
        count: real.length,
        errorCount,
        warningCount: real.length - errorCount,
        timestamp,
      });
    },
    [recordSession, recordRoute],
  );

  const {violations, demoViolations, newViolations, resolvedCount, scanning} = useAxeScan({onScan});
  const {showPopover, setShowPopover} = usePopoverThreshold(violations.length, newViolations);
  const {pendingFixes, requestFix, requestFixAll} = useFixRequest(violations);

  return {
    violations,
    newViolations,
    resolvedCount,
    showPopover,
    setShowPopover,
    requestFix,
    requestFixAll,
    pendingFixes,
    history,
    sessionViolations,
    clearSessionLog,
    demoViolations,
    scanning,
  };
}
