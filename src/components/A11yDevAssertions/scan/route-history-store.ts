/**
 * route-history-store — per-route violation summary, keyed by route.
 *
 * Navigating between pages shouldn't wipe the running tally, so each route's
 * summary is retained (keyed by location hash — the app uses hash routing).
 * Same rationale and same external-store pattern as `session-log-store`:
 * module-scoped so it survives Fast Refresh remounts, but encapsulated
 * behind subscribe/getSnapshot instead of a bare Map threaded through
 * `useState` calls.
 */

import * as React from 'react';

export interface RouteSummary {
  count: number;
  errorCount: number;
  warningCount: number;
  timestamp: string;
}

export interface ScanHistory {
  /** Number of distinct routes scanned this session. */
  pagesScanned: number;
  /** Sum of violations across all scanned routes. */
  totalIssues: number;
}

const routeHistory = new Map<string, RouteSummary>();
const listeners = new Set<() => void>();
let snapshot: ScanHistory = {pagesScanned: 0, totalIssues: 0};

function computeSnapshot(): ScanHistory {
  let totalIssues = 0;
  for (const summary of routeHistory.values()) totalIssues += summary.count;
  return {pagesScanned: routeHistory.size, totalIssues};
}

function notify(): void {
  snapshot = computeSnapshot();
  for (const l of listeners) l();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): ScanHistory {
  return snapshot;
}

/** Read-only snapshot of the route history, for tests / non-React callers. */
export function getRouteHistorySnapshot(): ScanHistory {
  return getSnapshot();
}

export function currentRouteKey(): string {
  if (typeof window === 'undefined') return '';
  return window.location.hash || '#';
}

/**
 * Record a route's summary. Exported directly (not just via the
 * `useRouteHistory` hook) so the accumulation logic is testable without a
 * React renderer.
 */
export function record(routeKey: string, summary: RouteSummary): void {
  routeHistory.set(routeKey, summary);
  notify();
}

/**
 * Wipe all accumulated route history. Exists mainly so a test suite (or a
 * future "reset scanner" affordance) can start from a clean slate — this
 * module-level store has no other way back to empty once populated.
 */
export function resetRouteHistory(): void {
  routeHistory.clear();
  notify();
}

export interface RouteHistory {
  history: ScanHistory;
  recordRoute: (routeKey: string, summary: RouteSummary) => void;
}

export function useRouteHistory(): RouteHistory {
  const history = React.useSyncExternalStore(subscribe, getSnapshot);
  return {history, recordRoute: record};
}
