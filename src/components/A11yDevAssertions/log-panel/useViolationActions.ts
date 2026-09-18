import * as React from 'react';
import type {Violation} from '../violation-messages';
import {formatViolationForCopy, formatAllForCopy} from '../violation-messages';
import type {FixStatus} from '../useA11yScan';

export interface ViolationActions {
  // Keyed by a caller-supplied row key, not array position and not just
  // violationKey(v) — the violations array is rebuilt on every scan (issues
  // appear/resolve/reorder), so a position-based index would silently point
  // at the wrong violation after a rescan (see scan/violation-key.ts). But
  // rule+selector alone isn't always unique either: axe-core can legitimately
  // report two distinct nodes with identical rule+selector text (e.g.
  // structurally identical sibling landmarks), and without disambiguation
  // those two cards would share expand/select/copy state — clicking one
  // would visibly select/border both. ViolationList computes a locally-
  // unique key (violationKey(v), with an occurrence suffix on duplicates
  // within the current render) and passes it into copyOne/fixOne explicitly
  // rather than this hook recomputing violationKey(v) itself, so it can't
  // silently re-introduce the collision.
  copiedKey: string | null;
  copiedAll: boolean;
  expandedKey: string | null;
  selectedKey: string | null;
  setExpandedKey: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedKey: React.Dispatch<React.SetStateAction<string | null>>;
  fixFeedback: Record<string, FixStatus>;
  fixAllFeedback: FixStatus;
  copyOne: (violation: Violation, key: string) => Promise<void>;
  fixOne: (violation: Violation, key: string) => Promise<void>;
  copyForAI: (sorted: Violation[]) => Promise<void>;
  locate: (v: Violation, num: number | null) => void;
}

/**
 * Owns per-violation UI state (copy/expand/select feedback) and the
 * copy/fix/locate handlers. Extracted from A11yLogPanel to keep the panel
 * component focused on layout.
 */
export function useViolationActions(opts: {
  onHoverViolation: (violation: Violation | null, violationNumber: number | null) => void;
  onRequestFix?: (violation: Violation) => Promise<FixStatus>;
  onRequestFixAll?: () => Promise<FixStatus>;
}): ViolationActions {
  const {onHoverViolation, onRequestFix, onRequestFixAll} = opts;
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const [copiedAll, setCopiedAll] = React.useState(false);
  const [expandedKey, setExpandedKey] = React.useState<string | null>(null);
  const [selectedKey, setSelectedKey] = React.useState<string | null>(null);
  const [fixFeedback, setFixFeedback] = React.useState<Record<string, FixStatus>>({});
  const [fixAllFeedback, setFixAllFeedback] = React.useState<FixStatus>('idle');

  const copyOne = React.useCallback(async (violation: Violation, key: string) => {
    try {
      await navigator.clipboard.writeText(formatViolationForCopy(violation));
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch { /* clipboard not available */ }
  }, []);

  const fixOne = React.useCallback(async (violation: Violation, key: string) => {
    try { await navigator.clipboard.writeText(formatViolationForCopy(violation)); } catch { /* noop */ }
    if (!onRequestFix) return;
    setFixFeedback((prev) => ({...prev, [key]: 'pending'}));
    const result = await onRequestFix(violation);
    setFixFeedback((prev) => ({...prev, [key]: result}));
    setTimeout(() => {
      setFixFeedback((prev) => {
        const next = {...prev};
        delete next[key];
        return next;
      });
    }, 3000);
  }, [onRequestFix]);

  const fixAll = React.useCallback(async () => {
    if (!onRequestFixAll) return;
    setFixAllFeedback('pending');
    const result = await onRequestFixAll();
    setFixAllFeedback(result);
    setTimeout(() => setFixAllFeedback('idle'), 3000);
  }, [onRequestFixAll]);

  // Generalized "Copy prompt → paste to AI": always copies the prompt to the clipboard
  // (works with any agent), and — when wired — also drops the agent-agnostic
  // fix-request file so hook/obligation-based agents pick it up automatically.
  const copyForAI = React.useCallback(async (sorted: Violation[]) => {
    try {
      await navigator.clipboard.writeText(formatAllForCopy(sorted));
    } catch { /* clipboard unavailable — the fix-request file is still the fallback */ }
    if (onRequestFixAll) {
      await fixAll();
    } else {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 3000);
    }
  }, [onRequestFixAll, fixAll]);

  // Locate a violation on the page. Session items can belong to another route;
  // navigate there first (the highlighter re-resolves by selector once the
  // destination page mounts). `num === null` clears the current highlight.
  const locate = React.useCallback((v: Violation, num: number | null) => {
    if (num !== null) {
      const url = (v as Violation & {url?: string}).url;
      if (url) {
        const hashIdx = url.indexOf('#');
        const hash = hashIdx >= 0 ? url.slice(hashIdx) : '';
        if (hash && hash !== window.location.hash) window.location.hash = hash;
      }
    }
    onHoverViolation(num !== null ? v : null, num);
  }, [onHoverViolation]);

  return {
    copiedKey, copiedAll, expandedKey, selectedKey,
    setExpandedKey, setSelectedKey, fixFeedback, fixAllFeedback,
    copyOne, fixOne, copyForAI, locate,
  };
}
