/**
 * report-only — headless-scan detection.
 *
 * `scripts/a11y/scan.mjs` drives a headless Playwright + axe-core pass for
 * the agent auto-fix loop and appends `?a11y-report-only=1` to the URL so
 * this component's own UI (FAB, log panel, popover) stays out of the way —
 * it would otherwise render into the page during a headless run and pollute
 * screenshots/DOM snapshots the loop takes. The headless scanner does its
 * own axe-core run independently, so this only gates our React UI.
 */

export const REPORT_ONLY_PARAM = 'a11y-report-only';

export function isReportOnlyMode(search: string): boolean {
  try {
    return new URLSearchParams(search).get(REPORT_ONLY_PARAM) === '1';
  } catch {
    return false;
  }
}
