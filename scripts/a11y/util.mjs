/**
 * scripts/a11y/util.mjs
 *
 * Shared, side-effect-light helpers for the a11y end-hook loop:
 *   - project-root + path resolution
 *   - the files-changed fingerprint gate (watches src/components + src/patterns)
 *   - the single shared DISABLED_RULES list
 *
 * Everything here is dependency-free (Node builtins only) so the pure core
 * (parse/decide) and the thin IO shell (run-endhook) can share it without
 * dragging in a browser or axe.
 */

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * axe rules we intentionally do NOT block on. Defined ONCE, imported
 * everywhere (scan filters them out; docs reference this list).
 *   - color-contrast: token/theme concern, noisy in dev
 *   - region:         layout scaffolding, not a component defect
 *   - skip-link:      page-shell concern, owned by the app, not the kit
 */
export const DISABLED_RULES = ['color-contrast', 'region', 'skip-link'];

/**
 * Directories (relative to project root) whose changes arm the scan.
 *
 * Intentionally scoped to component/pattern source: this is a component kit and
 * the loop enforces a11y at the component boundary. Edits that touch ONLY
 * `src/pages`/app-shell won't arm a first-pass scan; a `stop_hook_active`
 * re-entry always re-scans regardless. Widen this list if page-level a11y ever
 * needs first-pass coverage.
 */
export const WATCHED_DIRS = ['src/components', 'src/patterns'];

/** Where transient loop state lives. Gitignored. */
export const STATE_DIRNAME = '.a11y';

/**
 * Candidate dev-server base URLs, in priority order. The hook must not
 * hard-default to one port: ld-kit's own dev server is :3099, scaffolded
 * end-user projects run on :8080, and a bare Vite default is :5173. When no
 * A11Y_URL is given we probe these in order and use the first that responds;
 * the last entry is also the ultimate fallback. Override entirely with the
 * A11Y_URL env var (may include a path + query, e.g. a demo route).
 */
export const SCAN_URL_CANDIDATES = [
  'http://localhost:3099/', // ld-kit repo (dogfood / demo)
  'http://localhost:8080/', // scaffolded end-user projects
  'http://localhost:5173/', // bare Vite default / final fallback
];

/** Default per-candidate reachability probe: a short-timeout GET. */
async function defaultProbe(url, timeoutMs = 1000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    await fetch(url, { signal: ctrl.signal });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Resolve the URL the scan should hit. Precedence:
 *   1. explicit A11Y_URL env (used verbatim -- may carry a path/query),
 *   2. the first reachable SCAN_URL_CANDIDATE,
 *   3. the last candidate as a fallback (so we always return a string).
 * `env` and `probe` are injectable for tests.
 */
export async function resolveScanUrl({ env = process.env, probe = defaultProbe } = {}) {
  if (env.A11Y_URL) return env.A11Y_URL;
  for (const url of SCAN_URL_CANDIDATES) {
    if (await probe(url)) return url;
  }
  return SCAN_URL_CANDIDATES[SCAN_URL_CANDIDATES.length - 1];
}

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * Resolve the project root. Defaults to two levels up from scripts/a11y/,
 * which is the ld-kit repo root. Callers (and tests) can pass an explicit
 * root to point the gate at a throwaway fixture project.
 */
export function projectRoot(root) {
  return root ? resolve(root) : resolve(HERE, '..', '..');
}

/** Absolute path to the gitignored state dir, created on demand. */
export function stateDir(root) {
  const dir = join(projectRoot(root), STATE_DIRNAME);
  mkdirSync(dir, { recursive: true });
  return dir;
}

/** Convenience path helpers into the state dir. */
export function statePath(name, root) {
  return join(stateDir(root), name);
}

/** Recursively yield every file path under `dir` (skips nothing — mtimes are cheap). */
function* walkFiles(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return; // dir missing -> contributes nothing to the fingerprint
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkFiles(full);
    } else if (entry.isFile()) {
      yield full;
    }
  }
}

/**
 * Compute a content-independent fingerprint of the watched dirs using each
 * file's relative path + mtime + size. Cheap (no reads), and sensitive to
 * touches/edits/adds/deletes — exactly the "did this turn change source?" signal.
 */
export function computeFingerprint(root) {
  const base = projectRoot(root);
  const parts = [];
  for (const rel of WATCHED_DIRS) {
    const dir = join(base, rel);
    for (const file of walkFiles(dir)) {
      const st = statSync(file);
      parts.push(`${relative(base, file)}:${st.mtimeMs}:${st.size}`);
    }
  }
  parts.sort(); // stable regardless of fs traversal order
  return createHash('sha1').update(parts.join('\n')).digest('hex');
}

/**
 * The gate. Returns true when the watched source changed since the last run
 * (or when there is no prior run), and persists the new fingerprint as the
 * baseline for next time. First run is always "changed".
 */
export function componentsChangedSinceLastRun({ root } = {}) {
  const current = computeFingerprint(root);
  const fpFile = statePath('fingerprint.json', root);

  let previous = null;
  if (existsSync(fpFile)) {
    try {
      previous = JSON.parse(readFileSync(fpFile, 'utf8')).fingerprint ?? null;
    } catch {
      previous = null; // corrupt state -> treat as changed, self-heals below
    }
  }

  const changed = previous !== current;
  if (changed) {
    writeFileSync(fpFile, JSON.stringify({ fingerprint: current, at: Date.now() }, null, 2));
  }
  return changed;
}
