/**
 * session-log-store — accumulates every distinct violation seen this session.
 *
 * The live `violations` list only reflects what's on the page RIGHT NOW, so
 * navigating away or closing a modal/scrim drops its issues. This store
 * retains them (keyed by rule + selector + page) so the log panel can show
 * everything found across the whole session, not just the current view.
 *
 * Deliberately module-scoped (not component state): the scanner host can be
 * torn down and recreated by Vite Fast Refresh mid-session, and the session
 * log must survive that. Rather than leak a raw mutable Map through manual
 * `useState` synchronization (the pre-refactor approach), it's wrapped as a
 * proper `useSyncExternalStore`-compatible external store — subscribe/
 * getSnapshot/mutate are the only ways in or out, so the mutable state stays
 * encapsulated and the React-facing hook is a thin, testable subscriber.
 */

import * as React from 'react';
import type {Violation} from '../violation-messages';
import {violationKeyForUrl} from './violation-key';

export interface LoggedViolation extends Violation {
  url: string;
}

const sessionLog = new Map<string, LoggedViolation>();
const listeners = new Set<() => void>();
let snapshot: LoggedViolation[] = [];

function notify(): void {
  snapshot = Array.from(sessionLog.values());
  for (const l of listeners) l();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): LoggedViolation[] {
  return snapshot;
}

/** Read-only snapshot of the session log, for tests / non-React callers. */
export function getSessionSnapshot(): LoggedViolation[] {
  return getSnapshot();
}

/**
 * Upsert this scan's violations into the log. Never removes. Returns true if
 * anything changed. Exported directly (not just via the `useSessionLog`
 * hook) so this — the actual dedup/retention logic — is testable without a
 * React renderer.
 */
export function record(scanned: Violation[], url: string): boolean {
  let changed = false;
  for (const v of scanned) {
    const key = violationKeyForUrl(v, url);
    if (!sessionLog.has(key)) {
      // Session entries outlive their page, and this Map never evicts — so
      // holding `element` (a live DOM node) would pin its entire detached
      // subtree in memory for the rest of the tab's life. The highlighter
      // already treats session items' elements as unreliable and re-resolves
      // by selector (A11yHighlighter.resolveTarget), so it isn't needed here.
      const {element: _element, ...rest} = v;
      sessionLog.set(key, {...rest, url});
      changed = true;
    }
  }
  if (changed) notify();
  return changed;
}

function clear(): void {
  sessionLog.clear();
  notify();
}

/**
 * Wipe the accumulated session log directly (outside a component). The
 * in-panel "Clear" button goes through `clearSessionLog` from the hook
 * below; this named export exists so a test suite can reset the module
 * between scenarios — otherwise there is no way back to empty once this
 * module-level store has been populated.
 */
export function resetSessionLog(): void {
  clear();
}

export interface SessionLog {
  sessionViolations: LoggedViolation[];
  recordSession: (scanned: Violation[], url: string) => boolean;
  clearSessionLog: () => void;
}

export function useSessionLog(): SessionLog {
  const sessionViolations = React.useSyncExternalStore(subscribe, getSnapshot);
  return {sessionViolations, recordSession: record, clearSessionLog: clear};
}
