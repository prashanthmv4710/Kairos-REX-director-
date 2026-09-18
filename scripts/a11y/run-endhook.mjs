/**
 * scripts/a11y/run-endhook.mjs
 *
 * The orchestrator (thin IO shell). Wires the pure core (parse + decide) and
 * the browser (scan) around the gate/lock/attempts state. Contains NO decision
 * logic of its own — that lives in decide.mjs — so this file stays a boring,
 * readable sequence of steps.
 *
 * Contract: runEndhook() NEVER throws. Every failure path resolves to a silent
 * { action: 'skip' } so the caller can always exit 0 and never wedge the agent.
 *
 * `scan` is injected (defaults to the real headless scan) so the whole
 * orchestration is unit-testable with stubbed reports and no browser.
 */

import { existsSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';

import { componentsChangedSinceLastRun, statePath, resolveScanUrl } from './util.mjs';
import { parseAxeResults, writeReport } from './parse.mjs';
import { decide } from './decide.mjs';
import { scan as realScan } from './scan.mjs';

function readAttempts(root) {
  const f = statePath('attempts', root);
  if (!existsSync(f)) return 0;
  const n = Number.parseInt(readFileSync(f, 'utf8').trim(), 10);
  return Number.isFinite(n) ? n : 0;
}

function writeAttempts(root, n) {
  writeFileSync(statePath('attempts', root), String(n));
}

function skip(reason) {
  return { action: 'skip', reason, output: null };
}

/** A lock older than this (ms) is assumed abandoned and reclaimable. */
const LOCK_STALE_MS = 60_000;

/** True when pid is a live process (EPERM means it exists but isn't ours). */
function isProcessAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (e) {
    return e.code === 'EPERM';
  }
}

/**
 * A scan.lock is stale (safe to reclaim) when it is older than LOCK_STALE_MS
 * OR the pid that wrote it is no longer alive. This prevents a SIGKILL/sleep
 * mid-scan from leaving a lock that silently disables the hook forever.
 * An unreadable/absent lock is treated as reclaimable.
 */
function lockIsStale(lockFile) {
  try {
    const st = statSync(lockFile);
    if (Date.now() - st.mtimeMs > LOCK_STALE_MS) return true;
    const pid = Number.parseInt(readFileSync(lockFile, 'utf8').trim(), 10);
    return !isProcessAlive(pid);
  } catch {
    return true;
  }
}

/**
 * Atomically acquire scan.lock. Returns true on success, false when a live
 * lock is already held. The happy path is an O_EXCL create ('wx'), so two
 * hooks racing an empty gate can never both acquire.
 *
 * Stale-lock reclaim is also single-winner: instead of a blind rmSync+create
 * (where two racers could each delete the other's fresh lock and both proceed),
 * each racer tries to renameSync the stale lock path to a private name. Renaming
 * a given path can succeed for exactly ONE process — every other racer gets
 * ENOENT because the file is already gone. The winner then re-creates the lock
 * exclusively.
 */
function acquireLock(lockFile) {
  try {
    writeFileSync(lockFile, String(process.pid), { flag: 'wx' });
    return true;
  } catch (e) {
    if (!e || e.code !== 'EEXIST') return false; // unexpected fs error -> stay out
    if (!lockIsStale(lockFile)) return false; // a live lock is held -> back off
    // Atomically claim the stale lock: only one racer's rename of this exact
    // path can succeed; the rest get ENOENT and back off.
    const claim = `${lockFile}.reclaim.${process.pid}`;
    try {
      renameSync(lockFile, claim);
    } catch {
      return false; // another process already reclaimed the stale lock
    }
    try {
      rmSync(claim, { force: true });
      writeFileSync(lockFile, String(process.pid), { flag: 'wx' });
      return true;
    } catch {
      return false; // lost a subsequent race -> treat as locked
    }
  }
}

/**
 * runEndhook({ agent, root, stopHookActive, scan, url, timeoutMs }) ->
 *   { action: 'skip'|'block'|'handoff'|'done', output, ... }
 *
 * `url` is resolved via resolveScanUrl() when omitted, so EVERY caller (CLI or
 * programmatic) gets the port-probe behaviour — there is no hard :5173 default
 * hiding one layer down. Tests pass an explicit url to stay hermetic.
 */
export async function runEndhook({
  agent = 'wibey',
  root,
  stopHookActive = false,
  scan = realScan,
  url,
  timeoutMs = 15000,
} = {}) {
  try {
    // Gate — scan only when watched source changed. On a stop_hook_active
    // re-entry we ALWAYS re-scan to verify the fix (never a bail).
    const changed = componentsChangedSinceLastRun({ root });
    if (!changed && !stopHookActive) return skip('no-watched-change');

    // Lock — a concurrent scan already owns the page; stay out of its way.
    // Acquired ATOMICALLY via O_EXCL ('wx') so two hooks racing can't both win.
    // A stale lock (dead pid / too old) is reclaimed so a crashed run can't
    // wedge the hook permanently.
    const lockFile = statePath('scan.lock', root);
    if (!acquireLock(lockFile)) return skip('locked');

    try {
      const scanUrl = url ?? (await resolveScanUrl());
      const violations = await scan({ url: scanUrl, timeoutMs, reportOnly: true });
      if (violations === null) return skip('scan-unavailable'); // can't scan -> silent

      const parsed = parseAxeResults(violations);
      writeReport(parsed, { root });

      // NOTE: `attempts` is persisted per dirty streak, not per logical change.
      // If change A blocks (attempts=1) and an unrelated change B lands before
      // A is fixed, B hands off immediately rather than getting its own attempt.
      // Acceptable: the 1-attempt ceiling is a floor on agent effort, not a
      // per-change guarantee.
      const attempts = readAttempts(root);
      const verdict = decide({ ruleCount: parsed.ruleCount, attempts, agent });
      writeAttempts(root, verdict.attempts);

      return { action: verdict.action, output: verdict.output, reason: verdict.reason, ruleCount: parsed.ruleCount };
    } finally {
      if (existsSync(lockFile)) rmSync(lockFile, { force: true }); // always release
    }
  } catch {
    return skip('error'); // A3: any failure -> silent, non-blocking
  }
}

// ── CLI transport: map a verdict to the agent-native Stop-hook protocol ─────
//
// This is the ONE place that knows HOW each agent's Stop hook is signalled —
// deliberately split from decide.mjs (WHAT the verdict is) so the pure core
// stays transport-agnostic and this stays trivially unit-testable.
//
// Empirically verified (Wibey CLI spike + Wibey's own docs, Jul 2026):
//   * Claude / Wibey Stop hooks honour the BLOCK signal via **exit code 2 with
//     the reason on stderr** — the stderr text is injected as a fresh turn and
//     the agent re-engages. A Stop hook's stdout `{decision:"block"}` JSON is
//     IGNORED (that schema is PostToolUse-only). This was the original bug:
//     we printed the JSON and exited 0, so the fix loop never fired.
//   * Cursor's `stop` hook re-engages the agent via a stdout JSON
//     `{followup_message: <string>}` (exit 0). Verified against Cursor 3.12.30
//     (hook log + bundle schema `agent.v1.StopRequestResponse`, whose sole
//     field is `followup_message`). A `{continue:false, reason}` payload is
//     accepted as "valid" but silently ignored — the agent stops anyway.
//   * Every NON-block action (skip/done/handoff) exits 0 — the "never wedge the
//     agent" contract. Only `block` exits 2, and decide()'s MAX_ATTEMPTS=1
//     ceiling guarantees that happens at most once per dirty streak.
//
// PostToolUse (Wibey VS Code path): the Wibey VS Code extension does NOT execute
// Stop hooks, but it DOES run a manifested-plugin `PostToolUse` hook, and there
// a block is signalled by `{decision:"block", reason}` on **stdout + exit 0**
// (NOT exit 2). That is exactly the payload emitDecision already produces for
// wibey/claude — so for `event==='posttooluse'` we just print the payload and
// exit 0 for every agent. Same decide() core, different wire protocol.
//
// GOTCHA: the SDK parses PostToolUse **stdout as JSON** to detect the block. The
// hook command MUST therefore emit CLEAN JSON — invoke this script via `node`
// directly, NOT `npm run` (npm prints a `> pkg@ver script` banner to stdout that
// corrupts the JSON, so the SDK downgrades it to informational `hook_success`
// and the block is never enforced). The engine itself writes nothing else to
// stdout (no console.log) to keep the channel clean.
export function transportFor(result, agent, event = 'stop') {
  if (event === 'posttooluse') {
    const hasPayload = result.output && Object.keys(result.output).length > 0;
    return { code: 0, stdout: hasPayload ? JSON.stringify(result.output) : '', stderr: '' };
  }
  const usesExitCodeProtocol = agent === 'claude' || agent === 'wibey';
  if (result.action === 'block' && usesExitCodeProtocol) {
    return { code: 2, stdout: '', stderr: result.reason ?? '' };
  }
  const hasPayload = result.output && Object.keys(result.output).length > 0;
  return { code: 0, stdout: hasPayload ? JSON.stringify(result.output) : '', stderr: '' };
}

// ── Thin CLI entry: parse --agent, read the hook payload, apply transport ───

function parseAgent(argv) {
  const i = argv.indexOf('--agent');
  return i >= 0 && argv[i + 1] ? argv[i + 1] : 'wibey';
}

/** Which hook event fired: 'stop' (default) or 'posttooluse' (Wibey VS Code). */
function parseEvent(argv) {
  const i = argv.indexOf('--event');
  return i >= 0 && argv[i + 1] ? String(argv[i + 1]).toLowerCase() : 'stop';
}

/**
 * effectiveAgent(cliAgent, payload) -> the agent whose wire protocol to use.
 *
 * Cursor executes BOTH `.cursor/hooks.json` AND `.claude/settings.json` hooks
 * (its log: "Executing hook 1/1 from claude-project config"). So an instance
 * that ships both configs (as the starter does, to support every agent) would,
 * under Cursor, fire the `.claude` Stop hook too — which is wired `--agent
 * claude` and would emit exit-2/stderr, a protocol Cursor can't parse -> no
 * re-engage. Cursor injects `cursor_version` into the hook stdin payload, so
 * when we see it we FORCE the Cursor schema/transport regardless of --agent.
 * Combined with the `.claude` hook being node-direct (clean stdout), this makes
 * the outcome order-independent: whichever hook wins the fingerprint race emits
 * a clean `{followup_message}` and the other skips.
 */
export function effectiveAgent(cliAgent, payload = {}) {
  if (payload && payload.cursor_version) return 'cursor';
  return cliAgent;
}

/** Read the agent's Stop payload from stdin (best effort) for stop_hook_active. */
async function readStdinJson() {
  // No piped payload (interactive TTY) -> don't block waiting on stdin.
  if (process.stdin.isTTY) return {};
  try {
    const chunks = [];
    for await (const c of process.stdin) chunks.push(c);
    const raw = Buffer.concat(chunks).toString('utf8').trim();
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function main() {
  const cliAgent = parseAgent(process.argv);
  const event = parseEvent(process.argv);
  const payload = await readStdinJson();
  const stopHookActive = Boolean(payload.stop_hook_active);

  // Cursor also runs .claude/settings.json hooks; if the payload shows we're
  // under Cursor, use the Cursor schema/transport no matter what --agent says.
  const agent = effectiveAgent(cliAgent, payload);

  // url is intentionally omitted -> runEndhook resolves it via resolveScanUrl
  // (A11Y_URL env, else probe :3099/:8080/:5173). Single source of truth.
  const result = await runEndhook({ agent, stopHookActive });
  const { code, stdout, stderr } = transportFor(result, agent, event);
  if (stdout) process.stdout.write(stdout);
  if (stderr) process.stderr.write(stderr);
  // Only a `block` exits non-zero (2 = re-engage). Everything else exits 0 so
  // the agent is never wedged; the 1-attempt ceiling bounds the block.
  process.exit(code);
}

// Only run as a CLI, not when imported by tests.
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
