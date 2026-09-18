/**
 * axe-scan — pure, React-free accessibility scanning logic.
 *
 * Owns: running axe-core, mapping its results into our `Violation` shape,
 * and reporting a scan's outcome to the Vite dev server. No React, no
 * module-level mutable state — everything here is a pure function or a
 * side-effecting call that takes all its inputs as arguments.
 *
 * Deliberately axe-core only (no supplementary custom rules): a prior
 * version added a hand-rolled "widget role with no tabindex" heuristic, but
 * that made our violation count diverge from axe-core-only tools (e.g. the
 * axe DevTools Chrome extension), which was confusing — a real defect flagged
 * here that a standard axe scan doesn't show at all. axe-core is the single
 * source of truth so results stay comparable across tools.
 *
 * Split out of the old `useA11yScan.ts` god-hook so the scan algorithm can be
 * read, tested, and changed independently of session-log / route-history /
 * fix-request / React-lifecycle concerns.
 */

import type {Result, NodeResult} from 'axe-core';
import type {Violation, ViolationSeverity} from '../violation-messages';
import {resolveSource} from '../fiber-source';

export const AGENT_HINT =
  'HOW TO INSPECT (agent / headless):\n' +
  '  • cat .ld-a11y-report.json                      — latest violation snapshot (project root)\n' +
  '  • curl http://localhost:PORT/__ld_a11y_report   — live violation snapshot (use dev-server port)\n' +
  '  • tail the `npm run dev` stdout                 — violations are logged with a red [LD A11Y] banner\n' +
  'See the `a11y` rules file for the full directive and pre-response checklist.';

const REPORT_ENDPOINT = '/__ld_a11y_report';

// ---------------------------------------------------------------------------
// axe → Violation mapper
// ---------------------------------------------------------------------------

function mapAxeToViolation(axeResult: Result, node: NodeResult): Violation {
  // color-contrast is a real WCAG failure, but it false-positives on gradients,
  // images/overlays behind text, and mid-HMR style swaps — so we surface it as a
  // non-blocking warning (visible, but it won't trip the hard-block gate).
  const severity: ViolationSeverity =
    axeResult.id === 'color-contrast'
      ? 'warning'
      : axeResult.impact === 'critical' || axeResult.impact === 'serious'
        ? 'error'
        : 'warning';

  // axe target is an array of CSS selectors (one per iframe frame).
  // Use the last element which refers to the innermost frame.
  const selectorParts = Array.isArray(node.target) ? node.target : [String(node.target)];
  const selector = selectorParts
    .map((s) => (typeof s === 'string' ? s : JSON.stringify(s)))
    .join(' > ');

  // Resolve the offending element. Prefer axe's real element ref (enabled via
  // `elementRef: true`) — the CSS selector can fail to re-resolve mid-HMR and
  // would fall back to <html>, which silently breaks the data-ld-a11y-demo /
  // -ignore marker checks (closest() on <html> finds nothing), leaking demo
  // defects into the session log. The element ref is exact and never ambiguous.
  let element: Element = document.documentElement;
  const refEl = (node as NodeResult & {element?: Element | null}).element;
  if (refEl instanceof Element) {
    element = refEl;
  } else {
    try {
      const found = document.querySelector(selector);
      if (found) element = found;
    } catch {
      // selector may not be valid querySelector syntax — fall back to root
    }
  }

  const failureSummary = node.failureSummary ?? axeResult.description;
  const source = resolveSource(element);

  return {
    rule: axeResult.id,
    severity,
    element,
    selector,
    simplified: axeResult.description,
    technical: `[axe/${axeResult.impact ?? 'unknown'}] ${axeResult.description} — ${selector}`,
    fix: `${failureSummary}\nSee: ${axeResult.helpUrl}`,
    source,
  };
}

// ---------------------------------------------------------------------------
// Marker-based exclusions
// ---------------------------------------------------------------------------
// `data-ld-a11y-ignore` = genuinely exempt (dev tooling, third-party embeds,
//   explicit opt-out) → dropped from EVERY signal. axe-core doesn't honor the
//   marker on its own, so we enforce it here.
// `data-ld-a11y-demo`   = intentional demo defect → still surfaced in the
//   panel's demo section, but excluded from the live count, FAB badge,
//   session log, route tracker, console banner, dev-server report, and fixes.

function inIgnore(el: Element | undefined): boolean {
  return el instanceof Element && !!el.closest('[data-ld-a11y-ignore]');
}
function inDemo(el: Element | undefined): boolean {
  return el instanceof Element && !!el.closest('[data-ld-a11y-demo]');
}

export interface ScanOutcome {
  /** Real, actionable violations (ignore + demo already excluded). */
  real: Violation[];
  /** Intentional demo defects — display-only. */
  demo: Violation[];
}

/**
 * Run one full axe-core scan pass, then split into `real` vs `demo` per the
 * marker conventions above.
 */
export async function runAxeScan(): Promise<ScanOutcome> {
  // Dynamic import keeps axe out of the production bundle.
  const axe = await import('axe-core');
  const results = await axe.default.run(document.body, {
    runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice']},
    rules: {
      // color-contrast is ENABLED (surfaced as a non-blocking warning via
      // mapAxeToViolation). The scan's debounce lets styles settle so it
      // doesn't fire mid-HMR.
      'color-contrast': {enabled: true},
      // Disable rules that false-positive on Vite / LD dev tooling internals.
      'region': {enabled: false},
      // Disable skip-link: with best-practice enabled, axe treats every
      // in-page hash link (<a href="#route">) in nav/sidebars as a skip link
      // whose target isn't focusable — 100+ noisy false positives on
      // nav-heavy pages. heading-order and other best-practice rules stay on.
      'skip-link': {enabled: false},
    },
    elementRef: true,
  });

  const scanned: Violation[] = results.violations.flatMap((v: Result) =>
    v.nodes.map((n: NodeResult) => mapAxeToViolation(v, n)),
  );

  const considered = scanned.filter((v) => !inIgnore(v.element));
  const demo = considered.filter((v) => inDemo(v.element)).map((v) => ({...v, demo: true}));
  const real = considered.filter((v) => !inDemo(v.element));

  return {real, demo};
}

/** POST a scan's outcome to the Vite dev server (terminal log + JSON snapshot). */
export function reportViolations(
  issues: string[],
  url: string,
  timestamp: string,
  errorCount: number,
): void {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') return;
  // `errorCount` is the structured, authoritative count of error-severity
  // violations. Hooks (e.g. the Stop gate) read this field directly instead of
  // regex-parsing the human `issues` strings.
  const payload = {timestamp, url, count: issues.length, errorCount, issues};
  try {
    fetch(REPORT_ENDPOINT, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    /* no dev server — console.error is the fallback */
  }
}
