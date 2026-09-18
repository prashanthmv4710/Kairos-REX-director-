/**
 * cli/engine/corpus.mjs — the ONLY module in the engine that touches the
 * filesystem. Everything else takes data in and returns data out.
 *
 * Its central job is answering "which project am I serving?" WITHOUT consulting
 * process.cwd() first. That ordering is the whole point: the reported failure
 * was an agent whose working directory is the PARENT of the scaffolded project,
 * where every cwd-relative path resolves to nothing. When this file has been
 * scaffolded to <project>/scripts/ld/, its own module URL identifies the
 * project unambiguously, so an absolute-path invocation works from anywhere on
 * disk.
 *
 * Ships verbatim into generated projects as scripts/ld/corpus.mjs.
 */

import {existsSync, readdirSync, readFileSync, statSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

import {chunkCorpus} from './chunk.mjs';
import {toProductManifest} from './assets.mjs';

/** How far up to walk from cwd looking for a project root. */
const MAX_ASCEND = 12;
/** Dirs never worth probing downward. */
const PROBE_SKIP = new Set(['node_modules', 'dist', 'build', 'coverage', '.git']);
/** Cap on the depth-1 downward probe so a huge home dir cannot stall us. */
const PROBE_LIMIT = 60;

function isDir(p) {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

/** Rule `.md` files in <dir>/rules, or [] when there is no such dir. */
function ruleFilesIn(dir) {
  const rulesDir = path.join(dir, 'rules');
  if (!isDir(rulesDir)) return [];
  try {
    return readdirSync(rulesDir)
      .filter((f) => f.endsWith('.md'))
      .sort();
  } catch {
    return [];
  }
}

/**
 * Does `dir` look like a corpus root?
 *
 * `rules/*.md` is the requirement; `components.json` is reported but optional
 * so an older or partial tree still yields rule retrieval.
 */
export function inspectRoot(dir) {
  const rules = ruleFilesIn(dir);
  return {
    ok: rules.length > 0,
    ruleFiles: rules,
    hasComponents: existsSync(path.join(dir, 'components.json')),
  };
}

function makeRoot(dir, source, info) {
  return {
    path: dir,
    // Trailing slash matters: `new URL('src/x.md', baseUrl)` must resolve
    // INSIDE the root, not as its sibling.
    baseUrl: pathToFileURL(`${dir}${path.sep}`),
    source,
    ruleFiles: info.ruleFiles,
    hasComponents: info.hasComponents,
  };
}

/**
 * Locate the corpus root. First valid candidate wins.
 *
 * @param {{cwd?: string, flagRoot?: string, selfUrl: string, env?: object}} opts
 * @returns {{root: object|null, tried: string[], warnings: string[], ambiguous?: string[]}}
 */
export function resolveCorpusRoot({cwd = process.cwd(), flagRoot, selfUrl, env = process.env} = {}) {
  const tried = [];
  const warnings = [];

  const consider = (dir, source) => {
    if (!dir) return null;
    const abs = path.resolve(dir);
    tried.push(`${source}: ${abs}`);
    const info = inspectRoot(abs);
    return info.ok ? makeRoot(abs, source, info) : null;
  };

  // 1. Explicit override — an outright error if it is wrong, never a silent
  //    fallback: the user told us where to look.
  const explicit = flagRoot ?? env.LD_PROJECT_DIR;
  if (explicit) {
    const found = consider(explicit, 'flag');
    if (found) return {root: found, tried, warnings};
    return {
      root: null,
      tried,
      warnings: [`--root "${explicit}" has no rules/*.md — refusing to guess elsewhere.`],
    };
  }

  const selfDir = path.dirname(fileURLToPath(selfUrl));

  // 2. Self-location. When this file is <project>/scripts/ld/corpus.mjs, two
  //    levels up IS the project. Path-based, so cwd is irrelevant — this is
  //    what makes the absolute-path invocation work from a parent directory.
  const selfProject = consider(path.resolve(selfDir, '..', '..'), 'self');
  if (selfProject) return {root: selfProject, tried, warnings};

  // 3. Walk up from cwd, so `node .../cli.mjs` run anywhere inside a project
  //    finds that project's own pinned rules.
  let dir = path.resolve(cwd);
  for (let i = 0; i < MAX_ASCEND; i += 1) {
    const info = inspectRoot(dir);
    if (info.ok && info.hasComponents) {
      tried.push(`ancestor: ${dir}`);
      return {root: makeRoot(dir, 'ancestor', info), tried, warnings};
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  tried.push(`ancestor: none above ${path.resolve(cwd)}`);

  // 4. Probe one level DOWN. This is the parent-of-project case: the agent is
  //    sitting in the folder that contains the scaffolded app.
  const children = [];
  try {
    for (const e of readdirSync(path.resolve(cwd), {withFileTypes: true}).slice(0, PROBE_LIMIT)) {
      if (!e.isDirectory() || e.name.startsWith('.') || PROBE_SKIP.has(e.name)) continue;
      const child = path.join(path.resolve(cwd), e.name);
      const info = inspectRoot(child);
      if (info.ok) children.push({child, info});
    }
  } catch {
    // Unreadable cwd — nothing to probe.
  }
  if (children.length === 1) {
    const {child, info} = children[0];
    tried.push(`probe: ${child}`);
    warnings.push(`Resolved project root by looking one level down: ${child}`);
    return {root: makeRoot(child, 'probe', info), tried, warnings};
  }
  if (children.length > 1) {
    return {
      root: null,
      tried,
      warnings: ['Several projects below the working directory — pass --root to choose one.'],
      ambiguous: children.map((c) => c.child),
    };
  }

  // 5. The package's own bundled payload. Correct for `npx ld-kit …` outside
  //    any project. Same base as step 2 — dist/engine/ and cli/engine/ both
  //    sit two levels under the package root.
  const payload = consider(path.resolve(selfDir, '..', '..', 'living-design'), 'package');
  if (payload) return {root: payload, tried, warnings};

  return {root: null, tried, warnings};
}

/**
 * Read + chunk the rule corpus for a root.
 *
 * Chunking happens at runtime rather than from a shipped index. Measured: ~145
 * chunks from ~110KB parses in single-digit milliseconds against ~40-80ms of
 * Node startup. A shipped index would be a FIFTH copy of a corpus that already
 * exists in four places, and every copy is a staleness surface.
 */
export function loadRules(root) {
  const warnings = [];
  const files = [];

  for (const filename of root.ruleFiles) {
    const abs = path.join(root.path, 'rules', filename);
    try {
      files.push({
        id: filename.replace(/\.md$/, ''),
        file: `rules/${filename}`,
        text: readFileSync(abs, 'utf-8'),
      });
    } catch {
      warnings.push(`Could not read rules/${filename}`);
    }
  }

  return {files, chunks: chunkCorpus(files), manifest: loadRulesManifest(root, warnings), warnings};
}

/**
 * Per-rule metadata (description / alwaysApply / globs).
 *
 * Needed because the build strips frontmatter from rules/*.md, making this
 * unrecoverable from the rule files themselves — and `description` is the
 * highest-signal ranking field while `alwaysApply` selects the always-in-force
 * spine. Absent manifest degrades to empty metadata, never an error.
 */
function loadRulesManifest(root, warnings) {
  const abs = path.join(root.path, 'rules', 'rules-manifest.json');
  const byId = new Map();
  if (!existsSync(abs)) {
    warnings.push('rules/rules-manifest.json missing — ranking without rule descriptions.');
    return byId;
  }
  try {
    const parsed = JSON.parse(readFileSync(abs, 'utf-8'));
    for (const r of parsed.rules ?? []) byId.set(r.id, r);
  } catch {
    warnings.push('rules/rules-manifest.json is unreadable — ranking without rule descriptions.');
  }
  return byId;
}

/**
 * The project-wide hard rules, read from the entry file.
 *
 * `agents.mdc` is rendered as AGENTS.md / .claude/CLAUDE.md rather than into
 * rules/, so it is deliberately absent from the searchable corpus — it is a
 * router, not a rule. But its `## Hard Rules` section is already authored as
 * "the short version, full detail in the rule files", which is exactly the
 * always-include spine a context pack needs. Reusing it verbatim means zero new
 * authoring and no second copy to drift.
 */
export function loadSpine(root) {
  for (const rel of ['AGENTS.md', path.join('.claude', 'CLAUDE.md')]) {
    const abs = path.join(root.path, rel);
    if (!existsSync(abs)) continue;
    let text;
    try {
      text = readFileSync(abs, 'utf-8');
    } catch {
      continue;
    }
    // Prefix match, not equality: the authored heading carries a parenthetical
    // ("Hard Rules (full detail in the rule files)"), and the spine must not
    // silently vanish the next time someone rewords it.
    const found = chunkCorpus([{id: 'agents', file: rel, text}]).find((c) =>
      /^hard-rules/.test(c.anchor),
    );
    if (found) return found;
  }
  return null;
}

/**
 * Load the component/hook/utility manifest.
 *
 * Deliberately does NOT fall back to the package's own components.json when the
 * project has none: the project's rules are pinned to its kit version, and
 * pairing them with a different version's prop APIs produces confidently wrong
 * answers — the worst failure available to a tool whose whole job is accuracy.
 */
export function loadComponents(root) {
  const warnings = [];
  if (!root.hasComponents) {
    warnings.push(
      'No components.json at the project root — component and utility results are unavailable. ' +
        'Rule retrieval still works.',
    );
    return {components: [], counts: null, warnings};
  }
  try {
    const parsed = JSON.parse(readFileSync(path.join(root.path, 'components.json'), 'utf-8'));
    return {components: parsed.components ?? [], counts: parsed.counts ?? null, warnings};
  } catch {
    warnings.push('components.json is unreadable — component and utility results are unavailable.');
    return {components: [], counts: null, warnings};
  }
}

/**
 * Reader for a manifest entry's co-located markdown, memoized per root.
 *
 * `new URL(docPath, baseUrl)` keeps the historical semantics: a root-relative
 * docPath resolves inside the project, and an absolute file:// href resolves
 * as-is (which is how the snippet test supplies a fixture).
 */
export function makeDocReader(root) {
  const cache = new Map();
  return function readDoc(entry) {
    const key = entry?.name ?? '';
    if (cache.has(key)) return cache.get(key);
    let text = '';
    if (entry?.docPath) {
      try {
        const abs = fileURLToPath(new URL(entry.docPath, root.baseUrl));
        if (existsSync(abs)) text = readFileSync(abs, 'utf-8');
      } catch {
        // Unresolvable doc path — manifest-only fields still rank.
      }
    }
    cache.set(key, text);
    return text;
  };
}

/**
 * Icon/illustration/media manifests, read from the resolved project root.
 *
 * These are the SAME JSON files iconManager/illustrationManager/mediaManager
 * read at runtime — src/fonts/icon-manifest.json, src/illustrations/manifest.json,
 * src/media/manifest.json, plus src/fonts/theme-icon-map.json for theme->font
 * resolution. Returns null (never throws) when a manifest is absent, e.g. an
 * older generated project or a project missing the optional data dirs — the
 * corresponding `ld icons`/`illustrations`/`media` command degrades to a clear
 * "not shipped" message rather than a crash.
 */
function readJsonRelative(root, relParts) {
  try {
    return JSON.parse(readFileSync(path.join(root.path, ...relParts), 'utf-8'));
  } catch {
    return null;
  }
}

export function loadIconManifest(root) {
  return readJsonRelative(root, ['src', 'fonts', 'icon-manifest.json']);
}

export function loadThemeIconMap(root) {
  return readJsonRelative(root, ['src', 'fonts', 'theme-icon-map.json']);
}

export function loadIllustrationManifest(root) {
  return readJsonRelative(root, ['src', 'illustrations', 'manifest.json']);
}

/**
 * Product catalog, reshaped to the icons/illustrations/media bucket shape.
 * Same "read the shipped source, or return null" contract — an older project
 * or one that dropped ProductService legitimately has no productCatalog.json.
 */
export function loadProductManifest(root) {
  const catalog = readJsonRelative(root, ['src', 'data', 'productCatalog.json']);
  return catalog ? toProductManifest(catalog) : null;
}

export function loadMediaManifest(root) {
  return readJsonRelative(root, ['src', 'media', 'manifest.json']);
}

/**
 * Read back the advisory hook's own local telemetry.
 *
 * Lives here because corpus.mjs is the only module that touches the
 * filesystem; cli.mjs formats what this returns. Both files are optional — a
 * project whose agent has not taken a turn yet has neither, and that is
 * normal, not an error.
 *
 * Returns `records: null` when there is no metrics file at all, so the caller
 * can distinguish "never ran" from "ran and recorded nothing".
 */
export function loadHookTelemetry(root) {
  const read = (name) => {
    try {
      return readFileSync(path.join(root.path, '.ld', name), 'utf-8').split('\n').filter(Boolean);
    } catch {
      return null;
    }
  };
  const lines = read('metrics.jsonl');
  const records = lines
    ? lines
        .map((l) => {
          try {
            return JSON.parse(l);
          } catch {
            return null;
          }
        })
        .filter(Boolean)
    : null;
  return {records, errors: read('errors.log') ?? []};
}
