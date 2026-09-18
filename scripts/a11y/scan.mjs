/**
 * scripts/a11y/scan.mjs
 *
 * The ONLY browser-touching module. Headless Playwright + axe-core.
 *
 * Hard contract (spec A3): scan() must NEVER throw. Any failure — Playwright
 * not installed, no browser binary, dev server down/unreachable, navigation
 * timeout, app root never rendered — returns `null`. The orchestrator treats
 * null as "can't scan -> exit 0 silent", so an end-hook can never wedge the agent.
 *
 * Overlay guard (spec D3): the kit's runtime scanner (A11yDevAssertions) throws
 * a full-screen Vite overlay on regressions; if it were up, Playwright would
 * scan the overlay, not the app. We (a) navigate with the report-only flag so
 * the app suppresses the overlay, and (b) assert the app root actually rendered
 * content BEFORE running axe. If it didn't, we bail with null rather than scan junk.
 */

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

import { DISABLED_RULES } from './util.mjs';

const require = createRequire(import.meta.url);

/** URL flag the app reads (Task 7) to put A11yDevAssertions in report-only mode. */
export const REPORT_ONLY_PARAM = 'a11y-report-only';

/** Resolve + read axe-core's bundled source so we can inject it into the page. */
function axeSource() {
  const axePath = require.resolve('axe-core/axe.min.js');
  return readFileSync(axePath, 'utf8');
}

/** Append the report-only flag without clobbering existing query params. */
function withReportOnly(url) {
  try {
    const u = new URL(url);
    u.searchParams.set(REPORT_ONLY_PARAM, '1');
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * scan({ url, rootSelector, reportOnly, timeoutMs }) -> axe violations[] | null
 *
 * Returns the array of violations (already filtered by DISABLED_RULES) on
 * success, or null on ANY failure. NEVER throws and — critically — NEVER
 * hangs: the whole operation races a hard deadline so even a wedged browser
 * binary can't stall the end-hook (which would wedge the agent).
 */
export async function scan(opts = {}) {
  const { timeoutMs = 15000 } = opts;
  // Hard ceiling for the ENTIRE scan (launch can hang with no timeout of its
  // own). deadline includes launch + nav + guard + axe, plus slack.
  const deadlineMs = (opts.deadlineMs ?? timeoutMs * 3) + 5000;

  let timer;
  const deadline = new Promise((resolve) => {
    timer = setTimeout(() => resolve(null), deadlineMs);
  });

  try {
    return await Promise.race([runScan(opts), deadline]);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Retry wrapper. Chromium intermittently crashes on launch in constrained
 * VMs/containers ("Target page ... has been closed"). A crash is retryable; a
 * genuinely blank/unrendered page (guard tripped) is NOT (retrying won't help),
 * so attemptScan() THROWS on infra crashes and RETURNS null for a blank page.
 */
async function runScan(opts = {}) {
  const maxAttempts = opts.maxAttempts ?? 3;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await attemptScan(opts); // violations[] on success, null if blank
    } catch (e) {
      // A missing browser dep (playwright/axe not installed) is DETERMINISTIC:
      // retrying can't fix it, so bail immediately instead of burning backoff.
      if (isMissingDep(e)) return null;
      await sleep(200); // transient crash -> brief backoff, then retry
    }
  }
  return null; // exhausted retries -> silent null (never wedge)
}

/** True when the error is a missing-module failure (playwright/axe-core absent). */
function isMissingDep(e) {
  if (!e) return false;
  if (e.code === 'ERR_MODULE_NOT_FOUND' || e.code === 'MODULE_NOT_FOUND') return true;
  return /Cannot find (module|package) '(playwright|axe-core)'/.test(String(e.message ?? ''));
}

async function attemptScan({
  url = 'http://localhost:5173/',
  rootSelector = '#root',
  reportOnly = true,
  timeoutMs = 15000,
} = {}) {
  let browser = null;
  try {
    const { chromium } = await import('playwright'); // missing dep -> throws -> retry -> null
    browser = await chromium.launch({
      headless: true,
      timeout: timeoutMs,
      // VMs/containers often lack the user-namespace sandbox, a session dbus,
      // and udev; Chromium's multi-process startup (zygote/gpu/utility) then
      // crashes or hangs intermittently. --single-process collapses those into
      // one process and is stable here. Safe: we only scan trusted local content.
      args: ['--no-sandbox', '--single-process', '--disable-gpu', '--disable-dev-shm-usage'],
    });
    const page = await browser.newPage();

    const target = reportOnly ? withReportOnly(url) : url;
    await page.goto(target, { waitUntil: 'domcontentloaded', timeout: timeoutMs });

    // Overlay/rendered-root guard: the app root must exist AND have rendered
    // content before axe runs. A blank/overlay-only page => null (don't scan junk).
    const rendered = await page
      .waitForFunction(
        (sel) => {
          const el = document.querySelector(sel);
          return !!el && el.childElementCount > 0;
        },
        rootSelector,
        { timeout: timeoutMs },
      )
      .then(() => true)
      .catch(() => false);

    if (!rendered) return null; // genuinely blank -> resolved null, no retry

    await page.addScriptTag({ content: axeSource() });
    const results = await page.evaluate(async (disabled) => {
      const rules = Object.fromEntries(disabled.map((id) => [id, { enabled: false }]));
      // eslint-disable-next-line no-undef
      return await window.axe.run(document, { rules });
    }, DISABLED_RULES);

    return results.violations ?? [];
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {
        /* best effort */
      }
    }
  }
}

// ── Thin CLI (npm run a11y:scan): scan a URL, print the terse report ─────────
if (import.meta.url === `file://${process.argv[1]}`) {
  const urlArg = process.argv.find((a) => a.startsWith('http')) ?? 'http://localhost:5173/';
  const { parseAxeResults } = await import('./parse.mjs');
  const violations = await scan({ url: urlArg, reportOnly: true });
  if (violations === null) {
    process.stderr.write(`[a11y:scan] could not scan ${urlArg} (browser/server unavailable)\n`);
    process.exit(0);
  }
  const parsed = parseAxeResults(violations);
  process.stdout.write(parsed.clean ? '[a11y:scan] no violations \u2713\n' : parsed.markdown);
  process.exit(0);
}
