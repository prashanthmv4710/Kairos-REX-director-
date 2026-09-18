#!/usr/bin/env node
/**
 * cli/engine/hook.mjs — advisory per-turn context injection.
 *
 * Ships into generated projects as scripts/ld/hook.mjs and runs on the agent
 * runtime's prompt-submit event. Every turn it looks at what the user just
 * asked, works out which rules and APIs bear on it, and prints the part the
 * session has not already been shown. That output lands in the agent's context.
 *
 * Why a hook at all: the rule files were `alwaysApply: true`, which puts them in
 * the window once, at session start, after which they decay — and puts them
 * nowhere at all when the agent is rooted above the project. Re-deriving the
 * relevant slice per ask is the only mechanism that survives both.
 *
 * ADVISORY, not a gate. The payload says so in its own framing, nothing blocks,
 * and no tool call is ever refused. The agent is told what exists and decides
 * whether it applies.
 *
 * NEVER-WEDGE CONTRACT — this file runs on the interactive path, so a stall is
 * felt on every keystroke-to-response:
 *   - every failure path prints nothing and exits 0
 *   - exit code is ALWAYS 0; a non-zero exit from a prompt hook can block the
 *     user's own prompt, which is the worst outcome available here
 *   - stdin reads are bounded by size and by a deadline
 *   - an internal deadline races the whole run
 *   - LD_CONTEXT_OFF=1 disables it outright
 *   - no network, no child processes, no browser
 */

import {existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync} from 'node:fs';
import path from 'node:path';

import {
  loadComponents,
  loadRules,
  loadSpine,
  makeDocReader,
  resolveCorpusRoot,
} from './corpus.mjs';
import {buildPack} from './pack.mjs';
import {INVOKE} from './render.mjs';

/** Hard ceiling on injected output. ~1.5k tokens. */
const MAX_CHARS = 6000;
/** Sub-budgets so no single tier can crowd out the others. */
const TIER = {spine: 900, sections: 1800, catalog: 900, directives: 1200};
/**
 * Per-turn unit caps — a COST bound, not a relevance judgment.
 *
 * The automatic hook is deliberately stingier than the `context` command an
 * agent runs on purpose. A query-only relevance test proved unreliable (see
 * NOISE_REFERENCE in pack.mjs), so instead of guessing whether an ask is
 * on-topic, the hook just refuses to spend much on any single turn: an
 * off-topic turn costs a few hundred chars, and a real task accumulates the
 * material it needs across its first few turns as dedupe retires what it has
 * already been shown.
 */
const PER_TURN = {sections: 2, catalog: 3, directives: 6};
/** A unit becomes eligible again after this many turns — the decay window. */
const REARM_TURNS = 12;
/** The spine re-emits this often regardless; it is the cheapest thing to keep. */
const HARDRULES_EVERY = 8;
/** Stop injecting past this much cumulative output in one session. */
const SESSION_CHARS = 120_000;
/** Whole-run internal deadline, under the runtime's own timeout. */
const DEADLINE_MS = 2500;
/** Bounded stdin read. */
const STDIN_DEADLINE_MS = 500;
const STDIN_MAX_BYTES = 1_000_000;
/** State files older than this are swept on the next run. */
const STATE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
/** A no-session_id auto-session rolls over after this much idle time. */
const AUTO_SESSION_IDLE_MS = 4 * 60 * 60 * 1000;
/** Metrics file is trimmed to this many lines on write. */
const METRICS_MAX_LINES = 2000;

/**
 * Per-turn telemetry — local only, never leaves the machine.
 *
 * Six of this file's error paths are bare `catch {}`. That is right for the
 * agent (a prompt hook must never wedge a turn) and wrong for the human: if
 * the corpus moves or the disk fills, the designer gets no context, no
 * warning, and quietly worse code, indefinitely. Silence toward the agent,
 * visibility toward the human.
 *
 * PRIVACY: no prompt text, ever. A rough token count and nothing else. These
 * are designers' prompts and this file is written into their project.
 */
const M = {
  ts: Date.now(),
  agent: null,
  turn: null,
  chars: 0,
  served: null,
  deduped: null,
  budget_used: null,
  corpus: null,
  prompt_tokens: 0,
  skipped: null,
  err: null,
};
/** Set once the corpus resolves, so the flush knows where to write. */
let METRICS_ROOT = null;

function appendCapped(file, line, maxLines) {
  let prior = [];
  try {
    prior = readFileSync(file, 'utf-8').split('\n').filter(Boolean);
  } catch {
    // First write.
  }
  prior.push(line);
  writeFileSync(file, `${prior.slice(-maxLines).join('\n')}\n`, 'utf-8');
}

function flushMetrics() {
  if (!METRICS_ROOT) return;
  try {
    mkdirSync(stateDir(METRICS_ROOT), {recursive: true});
    M.ms = Date.now() - M.ts;
    appendCapped(path.join(stateDir(METRICS_ROOT), 'metrics.jsonl'), JSON.stringify(M), METRICS_MAX_LINES);
  } catch {
    // Telemetry must never be the reason a turn behaves differently.
  }
}

/** Record a swallowed failure where a human can find it. Never printed. */
function errlog(where, e) {
  M.err = `${where}: ${String(e && e.message ? e.message : e).slice(0, 200)}`;
  if (!METRICS_ROOT) return;
  try {
    mkdirSync(stateDir(METRICS_ROOT), {recursive: true});
    appendCapped(
      path.join(stateDir(METRICS_ROOT), 'errors.log'),
      `${new Date().toISOString()} ${M.err}`,
      500,
    );
  } catch {
    // Nothing further to do — this is already the failure path.
  }
}

/**
 * Read the runtime's JSON payload from stdin.
 *
 * Both bounds matter. A runtime that spawns the hook with an inherited but
 * never-closed stdin pipe (not a TTY, never EOF) would otherwise hang until the
 * runtime's own timeout — on a per-turn hook that is a visible stall on every
 * single turn.
 */
async function readPayload() {
  if (process.stdin.isTTY) return {};
  return new Promise((resolve) => {
    let data = '';
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      process.stdin.pause();
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    };
    const timer = setTimeout(finish, STDIN_DEADLINE_MS);
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
      if (data.length > STDIN_MAX_BYTES) finish();
    });
    process.stdin.on('end', finish);
    process.stdin.on('error', finish);
  });
}

/**
 * Which runtime are we really talking to?
 *
 * Cursor executes hooks from `.claude/settings.json` as well as its own config,
 * so a Claude-shaped prompt hook can fire under Cursor. Its prompt-event
 * contract is unverified, so we emit nothing there rather than send a payload
 * whose transport we are guessing at. Mirrors the same detection in
 * scripts/a11y/run-endhook.mjs.
 */
function effectiveAgent(cliAgent, payload) {
  if (payload && payload.cursor_version) return 'cursor';
  return cliAgent || 'claude';
}

function sessionId(payload, root) {
  if (payload?.session_id) return String(payload.session_id).replace(/[^\w.-]/g, '_');
  if (payload?.transcript_path) return path.basename(String(payload.transcript_path)).replace(/[^\w.-]/g, '_');
  return autoSessionId(root);
}

/**
 * Session key for runtimes that send no session_id.
 *
 * This used to be `process.ppid`, which cannot work here. The wired command is
 * a shell compound —
 *
 *   test -f scripts/ld/hook.mjs && node scripts/ld/hook.mjs --agent claude || true
 *
 * — so node's parent is a fresh `sh` on every turn, not the long-lived agent.
 * Keying on it produced a NEW ledger per turn: dedupe never engaged and every
 * turn re-paid the full ~3.5k chars, silently and forever. Measured before the
 * fix: 3 turns, 3 ledger files, 3531 chars each.
 *
 * A sticky per-project id fixes that. It rolls over after an idle gap so two
 * sessions a day apart do not share a dedupe ledger (which would make the
 * second one wrongly believe it had already been shown everything).
 *
 * Claude Code and the Wibey SDK both send session_id, so this is the fallback
 * path — but a silent, permanent cost regression is exactly the kind of thing
 * that should not depend on every runtime getting the payload right.
 */
function autoSessionId(root) {
  const pointer = path.join(stateDir(root), 'auto-session');
  try {
    const [id, ts] = readFileSync(pointer, 'utf-8').trim().split(' ');
    if (id && Date.now() - Number(ts) < AUTO_SESSION_IDLE_MS) {
      touchAutoSession(root, id);
      return id;
    }
  } catch {
    // No pointer yet, or unreadable — fall through and start a new one.
  }
  const id = `auto-${Date.now().toString(36)}`;
  touchAutoSession(root, id);
  return id;
}

function touchAutoSession(root, id) {
  try {
    mkdirSync(stateDir(root), {recursive: true});
    writeFileSync(path.join(stateDir(root), 'auto-session'), `${id} ${Date.now()}`, 'utf-8');
  } catch {
    // Read-only checkout: dedupe degrades to always-fresh. Same contract as
    // writeState — noisier, still correct, never a failed turn.
  }
}

function promptOf(payload) {
  return String(payload?.prompt ?? payload?.user_prompt ?? payload?.message ?? '').trim();
}

const stateDir = (root) => path.join(root.path, '.ld');

/**
 * Stable short key for a directive line, so the dedupe ledger does not grow to
 * hold the full text of every constraint ever served. Whitespace-insensitive so
 * a reflow of the source markdown is not treated as new content.
 */
function hashLine(text) {
  const norm = text.replace(/\s+/g, ' ').trim().toLowerCase();
  let h = 5381;
  for (let i = 0; i < norm.length; i += 1) h = ((h * 33) ^ norm.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

function readState(root, sid) {
  try {
    const raw = readFileSync(path.join(stateDir(root), `session-${sid}.json`), 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      turn: Number(parsed.turn) || 0,
      chars: Number(parsed.chars) || 0,
      served: parsed.served ?? {},
      mtimes: parsed.mtimes ?? {},
    };
  } catch {
    // Corrupt or absent state starts a fresh session. Never a hard failure.
    return {turn: 0, chars: 0, served: {}, mtimes: {}};
  }
}

/** Atomic write, so a concurrent reader never sees a half-written file. */
function writeState(root, sid, state) {
  try {
    const dir = stateDir(root);
    mkdirSync(dir, {recursive: true});
    const target = path.join(dir, `session-${sid}.json`);
    const tmp = `${target}.tmp`;
    writeFileSync(tmp, JSON.stringify(state), 'utf-8');
    renameSync(tmp, target);
  } catch (e) {
    // Read-only checkout or a full disk: dedupe degrades to "always fresh",
    // which is noisier but still correct. Not worth failing a turn over —
    // but it IS worth recording, because "always fresh" means every turn pays
    // full price and nothing on the agent side would ever say so.
    errlog('writeState', e);
  }
}

/** Bounded, cheap sweep of abandoned sessions. No cron, no daemon. */
function pruneState(root) {
  try {
    const dir = stateDir(root);
    if (!existsSync(dir)) return;
    const now = Date.now();
    for (const f of readdirSync(dir)) {
      if (!f.startsWith('session-')) continue;
      const p = path.join(dir, f);
      if (now - statSync(p).mtimeMs > STATE_TTL_MS) rmSync(p, {force: true});
    }
  } catch {
    // Best effort.
  }
}

function mtimeOf(root, relFile) {
  try {
    return statSync(path.join(root.path, relFile)).mtimeMs;
  } catch {
    return 0;
  }
}

/**
 * Select the units this turn has not already been shown.
 *
 * Dedupe is per CONTENT UNIT, not per pack: after twenty turns most of what
 * scores highly has already been served, so the delta is small and a repeat
 * turn costs almost nothing. That is what keeps a per-turn hook affordable
 * without needing to guess whether an ask is "relevant".
 */
function selectDelta(pack, state, root) {
  const turn = state.turn + 1;
  const served = {...state.served};
  const mtimes = {...state.mtimes};

  const fresh = (unit, file) => {
    const last = served[unit];
    const changed = file && mtimes[unit] !== undefined && mtimes[unit] !== mtimeOf(root, file);
    // A rule edited mid-session re-serves immediately, so `test:local:dev`
    // edits to src/context/*.mdc surface without restarting the agent.
    if (last === undefined || changed) return true;
    return turn - last >= REARM_TURNS;
  };

  const mark = (unit, file) => {
    served[unit] = turn;
    if (file) mtimes[unit] = mtimeOf(root, file);
  };

  const parts = [];
  let spine = null;
  let sections = [];
  let catalog = [];

  // The spine is cheap and the most important thing to keep resident, so it
  // also re-emits on a fixed heartbeat rather than only on the rearm window.
  if (pack.spine) {
    const due = turn === 1 || turn % HARDRULES_EVERY === 0 || fresh('hard-rules', pack.spine.file);
    if (due) {
      spine = pack.spine;
      mark('hard-rules', pack.spine.file);
    }
  }

  // Directives are deduped per LINE, not per rule. Without this the same
  // MUST/NEVER set re-injected on every single turn — it was the largest part
  // of the per-turn cost, and by far the least useful, since a constraint the
  // agent has already been shown twenty turns running is not news.
  const directives = [];
  let room = TIER.directives;
  for (const d of pack.directives) {
    if (directives.length >= PER_TURN.directives) break;
    const unit = `directive:${hashLine(d.text)}`;
    if (!fresh(unit, d.file)) continue;
    if (d.text.length > room) continue;
    directives.push(d);
    room -= d.text.length;
    mark(unit, d.file);
  }

  room = TIER.sections;
  for (const s of pack.sections) {
    if (sections.length >= PER_TURN.sections) break;
    const unit = `rule:${s.id}`;
    if (!fresh(unit, s.file)) continue;
    if (s.chars > room) continue;
    sections.push(s);
    room -= s.chars;
    mark(unit, s.file);
  }

  room = TIER.catalog;
  for (const c of pack.catalog) {
    if (catalog.length >= PER_TURN.catalog) break;
    const unit = `${c.kind}:${c.name}`;
    if (!fresh(unit)) continue;
    if (c.chars > room) continue;
    catalog.push(c);
    room -= c.chars;
    mark(unit);
  }

  return {turn, served, mtimes, spine, sections, catalog, directives, parts};
}

function renderInjection(delta, pack, root) {
  const out = [];
  out.push(`<living-design-context project="${root.path}" advisory="true">`);
  out.push(
    'Reference material for this ask — not an instruction. Use what applies and ' +
      'ignore the rest.',
  );

  if (delta.spine) {
    out.push('');
    out.push(delta.spine.text.trim());
  }

  if (delta.directives.length > 0) {
    out.push('');
    out.push('Constraints that bear on this ask:');
    for (const d of delta.directives) out.push(d.text);
  }

  for (const s of delta.sections) {
    out.push('');
    out.push(`--- ${s.file}#${s.anchor}`);
    out.push(s.text.trim());
  }

  if (delta.catalog.length > 0) {
    out.push('');
    out.push('Likely useful here:');
    for (const c of delta.catalog) {
      const imp = c.kind === 'utility' ? `import { ... } from "${c.importPath}"` : `import { ${c.name} } from "${c.importPath}"`;
      out.push(`  ${c.name} — ${c.intent ?? c.kind}`);
      out.push(`    ${imp}`);
      if (c.primary.length > 0) {
        out.push(`    ${c.kind === 'utility' ? 'exports' : 'required'}: ${c.primary.map((p) => p.name).join(', ')}`);
      }
    }
  }

  out.push('');
  out.push(`More: ${INVOKE} context "<ask>" · search <keywords> · show <Name> · utils`);
  out.push('</living-design-context>');
  return out.join('\n');
}

async function run(argv) {
  if (process.env.LD_CONTEXT_OFF === '1') {
    M.skipped = 'LD_CONTEXT_OFF';
    return '';
  }

  // Resolve the corpus BEFORE the early exits. Telemetry can only be written
  // once we know where .ld/ lives, and the turns most worth diagnosing are
  // exactly the ones that bail early — an empty payload, a silenced runtime.
  // Recording those after the fact is impossible, so pay the (cheap, local)
  // resolve first. A missing corpus is the one case that stays unrecordable,
  // because there is nowhere to record it.
  const {root} = resolveCorpusRoot({selfUrl: import.meta.url});
  if (!root) return '';
  METRICS_ROOT = root;
  M.corpus = root.source ?? null;

  const agentFlag = argv.includes('--agent') ? argv[argv.indexOf('--agent') + 1] : 'claude';
  const payload = await readPayload();
  M.agent = effectiveAgent(agentFlag, payload);

  if (M.agent === 'cursor' && process.env.LD_CURSOR_PROMPT_HOOK !== '1') {
    M.skipped = 'cursor-silenced';
    return '';
  }

  const prompt = promptOf(payload);
  if (!prompt) {
    M.skipped = 'empty-prompt';
    return '';
  }
  // Count only — the prompt text itself is never recorded.
  M.prompt_tokens = prompt.split(/\s+/).filter(Boolean).length;

  const sid = sessionId(payload, root);
  M.auto_session = sid.startsWith('auto-');
  const state = readState(root, sid);
  if (state.chars >= SESSION_CHARS) {
    M.skipped = 'session-budget-exhausted';
    return '';
  }

  const rules = loadRules(root);
  const comps = loadComponents(root);
  const pack = buildPack({
    query: prompt,
    chunks: rules.chunks,
    components: comps.components,
    manifest: rules.manifest,
    spine: loadSpine(root),
    root,
    budgetTokens: Math.floor(MAX_CHARS / 4),
    readDoc: makeDocReader(root),
  });

  const delta = selectDelta(pack, state, root);
  M.turn = delta.turn;
  // Fraction of the pack budget the retrieval actually filled — a persistently
  // low number means the corpus is not matching real asks.
  if (pack.budget?.chars) {
    M.budget_used = Math.round((pack.budget.usedChars / pack.budget.chars) * 100) / 100;
  }
  const n = (x) => (Array.isArray(x) ? x.length : 0);
  M.served = {
    spine: delta.spine ? 1 : 0,
    sections: n(delta.sections),
    catalog: n(delta.catalog),
    directives: n(delta.directives),
  };
  // What the pack offered minus what survived dedupe — the number that says
  // whether dedupe is actually earning its keep.
  M.deduped = {
    sections: Math.max(0, n(pack.sections) - n(delta.sections)),
    catalog: Math.max(0, n(pack.catalog) - n(delta.catalog)),
    directives: Math.max(0, n(pack.directives) - n(delta.directives)),
  };

  const nothingNew =
    !delta.spine &&
    delta.sections.length === 0 &&
    delta.catalog.length === 0 &&
    delta.directives.length === 0;

  if (nothingNew) {
    // Deliberately not silence: one line keeps the focal point discoverable at
    // ~30 tokens, which is the whole cost of a turn that needed nothing new.
    writeState(root, sid, {turn: delta.turn, chars: state.chars, served: delta.served, mtimes: delta.mtimes});
    return (
      `<living-design-context advisory="true">Living Design guidance is already in ` +
      `this session's context. Re-pull anything specific with \`${INVOKE} context "<ask>"\`.` +
      `</living-design-context>`
    );
  }

  let text = renderInjection(delta, pack, root);
  if (text.length > MAX_CHARS) {
    text = `${text.slice(0, MAX_CHARS - 80)}\n… (truncated — ${INVOKE} context "<ask>")\n</living-design-context>`;
  }

  writeState(root, sid, {
    turn: delta.turn,
    chars: state.chars + text.length,
    served: delta.served,
    mtimes: delta.mtimes,
  });
  pruneState(root);
  return text;
}

async function main() {
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve(''), DEADLINE_MS);
  });
  let text = '';
  try {
    text = await Promise.race([run(process.argv.slice(2)), timeout]);
    if (text === '' && !M.skipped && !M.err) M.skipped = 'deadline-or-empty';
  } catch (e) {
    text = '';
    errlog('run', e);
  } finally {
    // Whichever side of the race won, the timer must not survive it — a
    // dangling setTimeout keeps the event loop (and this process) alive for
    // the rest of DEADLINE_MS, which would turn "always 0 quickly" into
    // "always 0 after a 2.5s stall" on every normal turn.
    clearTimeout(timer);
  }
  M.chars = text.length;
  flushMetrics();
  if (text) process.stdout.write(`${text}\n`);
  // ALWAYS 0 — a prompt hook that exits non-zero can block the user's prompt.
  // exitCode, not exit(): process.exit() does not wait for a pending stdout
  // write to a pipe to flush, which truncates output once it is large enough
  // (confirmed elsewhere in this engine at ~8KB). The timer is already
  // cleared above, so nothing else keeps the process alive — it exits as soon
  // as the write drains, not up to DEADLINE_MS later.
  process.exitCode = 0;
}

main();
