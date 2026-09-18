#!/usr/bin/env node
/**
 * cli/engine/cli.mjs — the engine's own entry point.
 *
 * Ships into generated projects as scripts/ld/cli.mjs, where it is THE thing
 * rule files tell an agent to run. Two invariants matter more than any feature
 * here:
 *
 *   1. A bare invocation prints usage and exits 0. It NEVER opens the menu.
 *      Dropping an agent into an interactive prompt hangs its turn with no
 *      diagnostic, which is the worst failure this file could have.
 *   2. Nothing here reaches the network, spawns a process, or touches a browser.
 *      `context` sits on the interactive path (the advisory hook runs it every
 *      turn), so it must stay in the tens of milliseconds.
 *
 * Dependency-free on purpose: a scaffolded project has react, react-dom and a
 * couple of chart libs, and adding @walmart/ld-kit as a dependency just to read
 * its own rules would be absurd. It is also what makes the documented
 * `npm run ld-kit -- search` — which exited 127 in every real project because
 * nothing installed that binary — unnecessary rather than merely fixed.
 */

import {parseArgs, usage} from './args.mjs';
import {
  loadComponents,
  loadHookTelemetry,
  loadIconManifest,
  loadIllustrationManifest,
  loadMediaManifest,
  loadProductManifest,
  loadRules,
  loadSpine,
  loadThemeIconMap,
  makeDocReader,
  resolveCorpusRoot,
} from './corpus.mjs';
import {rankChunks, rankComponents, toRulesJson, toSearchJson} from './rank.mjs';
import {buildOrientation, buildPack} from './pack.mjs';
import {INVOKE, renderPackJson, renderPackText, renderSearchText} from './render.mjs';
import {
  listIconFonts,
  listIcons,
  listIllustrationTypes,
  listIllustrations,
  listMedia,
  listMediaTenants,
  listProductCategories,
  listProducts,
  resolveIconFontForTheme,
  searchIcons,
  searchIconsAllFonts,
  searchIllustrations,
  searchIllustrationsAllTypes,
  searchMedia,
  searchMediaAllTenants,
  searchProducts,
  searchProductsAllCategories,
} from './assets.mjs';

const out = (s) => process.stdout.write(s.endsWith('\n') ? s : `${s}\n`);
const err = (s) => process.stderr.write(s.endsWith('\n') ? s : `${s}\n`);

/** Resolve the corpus or explain why not. Never throws. */
function openCorpus(flags) {
  const {root, tried, warnings, ambiguous} = resolveCorpusRoot({
    selfUrl: import.meta.url,
    flagRoot: flags.root,
  });

  if (!root) {
    err('Could not find a Living Design project (a directory with rules/*.md).');
    for (const w of warnings) err(`  ${w}`);
    if (ambiguous) for (const a of ambiguous) err(`    ${a}`);
    err('  Looked at:');
    for (const t of tried) err(`    ${t}`);
    err('  Pass --root <dir> to say which project you mean.');
    return null;
  }

  for (const w of warnings) err(`note: ${w}`);

  const rules = loadRules(root);
  const comps = loadComponents(root);
  for (const w of [...rules.warnings, ...comps.warnings]) err(`note: ${w}`);

  return {
    root,
    chunks: rules.chunks,
    manifest: rules.manifest,
    components: comps.components,
    spine: loadSpine(root),
    readDoc: makeDocReader(root),
  };
}

function cmdContext(c, rest, flags) {
  const query = rest.join(' ');
  const pack = buildPack({
    query,
    chunks: c.chunks,
    components: c.components,
    manifest: c.manifest,
    spine: c.spine,
    root: c.root,
    budgetTokens: flags.budget,
    readDoc: c.readDoc,
  });
  // No ask means "orient me" — a real request, answered with what exists.
  if (!query) pack.orientation = buildOrientation(c);
  out(flags.json ? renderPackJson(pack) : renderPackText(pack));
  return 0;
}

function cmdSearch(c, rest, flags) {
  const query = rest.join(' ');
  if (!query) {
    err('Give me something to search for, e.g. `search bottom drawer`.');
    return 1;
  }
  const limit = flags.limit ?? 6;
  const wantRules = flags.only !== 'components';
  const wantCatalog = flags.only !== 'rules';

  const rules = wantRules
    ? rankChunks(c.chunks, query, {limit, manifest: c.manifest})
    : {hits: [], top: []};
  const catalog = wantCatalog
    ? rankComponents(c.components, query, {limit, readDoc: c.readDoc})
    : {hits: [], top: []};

  if (flags.json) {
    out(
      JSON.stringify(
        {
          query,
          root: {path: c.root.path, source: c.root.source},
          rules: {total: rules.hits.length, results: toRulesJson(rules.top)},
          components: {total: catalog.hits.length, results: toSearchJson(catalog.top)},
        },
        null,
        2,
      ) + '\n',
    );
    return 0;
  }

  out(
    renderSearchText({
      query,
      root: c.root,
      rules: {total: rules.hits.length, top: rules.top},
      catalog: {total: catalog.hits.length, top: catalog.top},
    }),
  );
  return 0;
}

/** Wrap a bare-string item (icons) as {name, snippet} so JSON output always has a home for the snippet. */
function withSnippet(item, snippet) {
  return typeof item === 'string' ? {name: item, snippet} : {...item, snippet};
}

/**
 * Shared shape for `icons`/`illustrations`/`media`/`products`: each is "search
 * or list within a named bucket (font / type / tenant / category), or across
 * all of them when no bucket is given." One implementation, four thin configs
 * below, rather than the same branching written four times with four item
 * shapes. `cfg.snippet(bucketKey, item)` turns a hit into the actual code that
 * uses it — the reason this exists is that a bare name still leaves the
 * caller guessing the right component/function call.
 */
function assetCommand(name, cfg) {
  function run(c, rest, flags) {
    const manifest = cfg.loadManifest(c.root);
    if (!manifest) {
      err(`No ${name} manifest in this project — not shipped, or an older kit version.`);
      err(`Try \`${INVOKE} doctor\` to see what this project's corpus actually has.`);
      return 1;
    }

    if (rest.length === 0) {
      const buckets = cfg.listBuckets(manifest);
      if (flags.json) {
        out(JSON.stringify(buckets, null, 2) + '\n');
        return 0;
      }
      out(`\n${name} — by ${cfg.bucketNoun}:\n`);
      const w = Math.max(...buckets.map((b) => b.key.length), cfg.bucketNoun.length);
      for (const b of buckets) out(`  ${b.key.padEnd(w)}  ${String(b.count).padStart(4)}  ${b.label}`);
      out(`\n${INVOKE} ${name} <${cfg.bucketNoun}>            list everything in one ${cfg.bucketNoun}`);
      out(`${INVOKE} ${name} <${cfg.bucketNoun}> <query>    search within one ${cfg.bucketNoun}`);
      out(`${INVOKE} ${name} <query>              search every ${cfg.bucketNoun}\n`);
      return 0;
    }

    const first = rest[0];
    const bucketKey = cfg.resolveBucket ? cfg.resolveBucket(c, manifest, first) : (manifest[first] ? first : null);

    if (bucketKey) {
      const query = rest.slice(1).join(' ');
      const items = query
        ? cfg.searchInBucket(manifest, bucketKey, query)
        : cfg.listInBucket(manifest, bucketKey);
      if (flags.json) {
        const results = items.map((item) => withSnippet(item, cfg.snippet(bucketKey, item)));
        out(JSON.stringify({[cfg.bucketNoun]: bucketKey, query: query || null, results}, null, 2) + '\n');
        return 0;
      }
      out(`\n${cfg.bucketNoun}: ${bucketKey}${query ? `  matching "${query}"` : ''}  —  ${items.length} result(s)\n`);
      for (const item of items) {
        out(`  ${typeof item === 'string' ? item : item.name}`);
        out(`    ${cfg.snippet(bucketKey, item)}`);
      }
      out('');
      return 0;
    }

    const query = rest.join(' ');
    const hits = cfg.searchAllBuckets(manifest, query);
    if (flags.json) {
      const results = hits.map((h) => withSnippet(h, cfg.snippet(h[cfg.tagKey], h)));
      out(JSON.stringify({query, results}, null, 2) + '\n');
      return 0;
    }
    out(`\n"${query}" across every ${cfg.bucketNoun} — ${hits.length} result(s)\n`);
    if (hits.length === 0) {
      out(`  (no match — run \`${INVOKE} ${name}\` to see the ${cfg.bucketNoun}s)`);
    }
    const tagWidth = Math.max(...hits.map((h) => String(h[cfg.tagKey]).length), 4);
    for (const h of hits) {
      out(`  ${String(h[cfg.tagKey]).padEnd(tagWidth)}  ${h.name}`);
      out(`  ${' '.repeat(tagWidth)}  ${cfg.snippet(h[cfg.tagKey], h)}`);
    }
    out('');
    return 0;
  }

  // Exposed so the menu can prompt "<bucketNoun>: " without hardcoding
  // "font"/"type"/"tenant"/"category" per command.
  run.bucketNoun = cfg.bucketNoun;
  return run;
}

const cmdIcons = assetCommand('icons', {
  loadManifest: (root) => loadIconManifest(root),
  listBuckets: listIconFonts,
  listInBucket: listIcons,
  searchInBucket: searchIcons,
  searchAllBuckets: searchIconsAllFonts,
  // A theme name (e.g. "Walmart") resolves to its primary font via
  // theme-icon-map.json, so `ld icons Walmart cart` works without the caller
  // needing to know the font key underneath.
  resolveBucket: (c, manifest, first) => {
    if (manifest[first]) return first;
    return resolveIconFontForTheme(loadThemeIconMap(c.root), first);
  },
  bucketNoun: 'font',
  tagKey: 'font',
  snippet: (font, item) => {
    // Bucket-scoped list/search hands back a bare icon name; the
    // cross-font search branch hands back {font, name} instead.
    const name = typeof item === 'string' ? item : item.name;
    return `<Icon name="${name}" a11yLabel="${name}" />`;
  },
});

const cmdIllustrations = assetCommand('illustrations', {
  loadManifest: loadIllustrationManifest,
  listBuckets: listIllustrationTypes,
  listInBucket: listIllustrations,
  searchInBucket: searchIllustrations,
  searchAllBuckets: searchIllustrationsAllTypes,
  bucketNoun: 'type',
  tagKey: 'type',
  snippet: (type, item) => {
    const name = typeof item === 'string' ? item : item.name;
    return `<Illustration type="${type}" name="${name}" title="${name}" />`;
  },
});

const cmdMedia = assetCommand('media', {
  loadManifest: loadMediaManifest,
  listBuckets: listMediaTenants,
  listInBucket: listMedia,
  searchInBucket: searchMedia,
  searchAllBuckets: searchMediaAllTenants,
  bucketNoun: 'tenant',
  tagKey: 'tenant',
  snippet: (tenant, item) => `getMedia("${tenant}", "${item.name}")`,
});

const cmdProducts = assetCommand('products', {
  loadManifest: loadProductManifest,
  listBuckets: listProductCategories,
  listInBucket: listProducts,
  searchInBucket: searchProducts,
  searchAllBuckets: searchProductsAllCategories,
  bucketNoun: 'category',
  tagKey: 'category',
  snippet: (_category, item) => `getProductBySku("${item.sku}")`,
});

function cmdRule(c, rest) {
  const target = rest[0];
  if (!target) {
    const ids = [...new Set(c.chunks.map((k) => k.ruleId))].sort();
    out(`\nRules in this project:\n${ids.map((i) => `  ${i}`).join('\n')}\n`);
    out(`Fetch one:  ${INVOKE} rule <id>          (whole rule)`);
    out(`            ${INVOKE} rule <id>#<anchor> (one section)\n`);
    return 0;
  }

  const [ruleId, anchor] = target.split('#');
  const inRule = c.chunks.filter((k) => k.ruleId === ruleId);
  if (inRule.length === 0) {
    err(`No rule "${ruleId}". Run \`${INVOKE} rule\` to list them.`);
    return 1;
  }

  const picked = anchor ? inRule.filter((k) => k.anchor === anchor) : inRule;
  if (picked.length === 0) {
    err(`Rule "${ruleId}" has no section "#${anchor}". Sections:`);
    for (const k of inRule) err(`  ${k.id}`);
    return 1;
  }

  for (const k of picked) {
    out(`\n${k.file}#${k.anchor}  (L${k.startLine})\n`);
    out(k.text);
  }
  out('');
  return 0;
}

function cmdShow(c, rest, flags) {
  const name = rest[0];
  if (!name) {
    err(`Which one? e.g. \`${INVOKE} show ProductService\``);
    return 1;
  }
  const lower = name.toLowerCase();
  const target =
    c.components.find((e) => e.name === name) ??
    c.components.find((e) => e.name.toLowerCase() === lower);

  if (!target) {
    const near = c.components.filter((e) => e.name.toLowerCase().includes(lower)).slice(0, 5);
    err(`Nothing named "${name}".`);
    if (near.length > 0) err(`Did you mean: ${near.map((e) => e.name).join(', ')}?`);
    else err(`Try \`${INVOKE} search ${name}\`.`);
    return 1;
  }

  if (flags.json) {
    out(JSON.stringify(target, null, 2) + '\n');
    return 0;
  }

  const doc = c.readDoc(target);
  if (doc) {
    out(doc);
    return 0;
  }

  // Manifest-only fallback, for a tree whose docs were not written.
  const isUtil = target.kind === 'utility';
  out(`\n# ${target.name}`);
  out(
    isUtil
      ? `import { ... } from "${target.importPath}"`
      : `import { ${target.name} } from "${target.importPath}"`,
  );
  if (target.intent) out(target.intent);
  if (target.signature) out(target.signature);
  out(isUtil ? '\nexports:' : '\nprops:');
  for (const p of target.props ?? []) {
    out(`  ${p.name}${p.required ? ' (required)' : ''}: ${p.type}`);
  }
  out('');
  return 0;
}

function cmdUtils(c, _rest, flags) {
  const utils = c.components.filter((e) => e.kind === 'utility');
  if (flags.json) {
    out(JSON.stringify(utils, null, 2) + '\n');
    return 0;
  }
  if (utils.length === 0) {
    err('No utilities in this project’s manifest.');
    return 1;
  }
  const w = Math.max(...utils.map((u) => u.name.length));
  out('\nRuntime utilities — import and call these; do not reimplement them.\n');
  for (const u of utils) {
    out(`  ${u.name.padEnd(w)}  ${u.importPath}`);
    if (u.intent) out(`  ${' '.repeat(w)}  ${u.intent}`);
  }
  out(`\nFull API:  ${INVOKE} show <Name>\n`);
  return 0;
}

function cmdList(c, _rest, flags) {
  if (flags.json) {
    out(JSON.stringify(c.components, null, 2) + '\n');
    return 0;
  }
  const groups = new Map();
  for (const e of c.components) {
    const key = e.category ?? 'other';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(e);
  }
  for (const [cat, entries] of [...groups].sort((a, b) => a[0].localeCompare(b[0]))) {
    out(`\n${cat} (${entries.length})`);
    const w = Math.max(...entries.map((e) => e.name.length));
    for (const e of entries) {
      const tag = e.kind && e.kind !== 'component' ? ` (${e.kind})` : '';
      out(`  ${e.name.padEnd(w)}  ${e.importPath}${tag}`);
    }
  }
  out('');
  return 0;
}

function cmdExplain(c, rest, flags) {
  const query = rest.join(' ');
  if (!query) {
    err(`Give me an ask to dry-run, e.g. \`${INVOKE} explain "build a cart page"\``);
    return 1;
  }
  const pack = buildPack({
    query,
    chunks: c.chunks,
    components: c.components,
    manifest: c.manifest,
    spine: c.spine,
    root: c.root,
    budgetTokens: flags.budget,
    readDoc: c.readDoc,
  });

  if (flags.json) {
    out(JSON.stringify({query, relevance: pack.relevance, budget: pack.budget, sections: pack.sections.map((s) => ({id: s.id, score: s.score, chars: s.chars})), catalog: pack.catalog.map((e) => ({name: e.name, score: e.score})), omitted: pack.omitted}, null, 2) + '\n');
    return 0;
  }

  out(`\nDry run: "${query}"`);
  out(`project:   ${c.root.path}  (resolved by: ${c.root.source})`);
  out(
    `top score: ${pack.relevance.best}  (a weak match sits near ` +
      `${pack.relevance.noiseReference}; this is informational, nothing is gated on it)`,
  );
  out(
    `budget:    ~${pack.budget.usedTokensEst} / ${pack.budget.tokens} tokens ` +
      `(${pack.budget.usedChars} / ${pack.budget.chars} chars)`,
  );
  out(`matched:   ${pack.counts.rulesMatched} rule sections, ${pack.counts.catalogMatched} catalog entries`);

  out('\nIncluded rule sections:');
  for (const s of pack.sections) {
    out(`  ${String(s.score).padStart(7)}  ${String(s.chars).padStart(5)}c  ${s.id}  [${s.matchedFields.join(',')}]`);
  }
  out(`\nIncluded constraints: ${pack.directives.length}`);
  out('\nIncluded catalog entries:');
  for (const e of pack.catalog) {
    out(`  ${String(e.score).padStart(7)}  ${e.name}  (${e.kind})`);
  }
  if (pack.omitted.sections.length > 0) {
    out('\nDropped for budget:');
    for (const s of pack.omitted.sections) out(`  ${s.id}  (${s.chars}c)`);
  }
  out('');
  return 0;
}

function cmdDoctor(c) {
  const checks = [];
  const t0 = process.hrtime.bigint();
  const pack = buildPack({
    query: 'build a product page with a header and a cart',
    chunks: c.chunks,
    components: c.components,
    manifest: c.manifest,
    spine: c.spine,
    root: c.root,
    readDoc: c.readDoc,
  });
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;

  checks.push(['project root', true, `${c.root.path} (via ${c.root.source})`]);
  checks.push(['rule corpus', c.chunks.length > 0, `${c.chunks.length} sections from ${c.manifest.size || '?'} rules`]);
  checks.push(['rules manifest', c.manifest.size > 0, c.manifest.size > 0 ? 'present' : 'MISSING — ranking loses rule descriptions']);
  checks.push(['catalog', c.components.length > 0, `${c.components.length} entries`]);
  checks.push([
    'utilities',
    c.components.some((e) => e.kind === 'utility'),
    `${c.components.filter((e) => e.kind === 'utility').length} documented`,
  ]);
  checks.push(['hard-rules spine', Boolean(c.spine), c.spine ? `${c.spine.chars} chars` : 'MISSING from AGENTS.md']);
  checks.push(['pack within budget', pack.budget.usedChars <= pack.budget.chars, `${pack.budget.usedChars}/${pack.budget.chars} chars`]);
  checks.push(['pack latency', ms < 500, `${ms.toFixed(1)}ms`]);

  // Informational only — an older or trimmed project may legitimately lack
  // one of these, and that is not an engine failure the way a missing rule
  // corpus or catalog is.
  const icons = loadIconManifest(c.root);
  const illustrations = loadIllustrationManifest(c.root);
  const media = loadMediaManifest(c.root);
  const products = loadProductManifest(c.root);
  checks.push(['icons manifest', true, icons ? `${listIconFonts(icons).length} fonts` : 'not shipped']);
  checks.push(['illustrations manifest', true, illustrations ? `${listIllustrationTypes(illustrations).length} types` : 'not shipped']);
  checks.push(['media manifest', true, media ? `${listMediaTenants(media).length} tenants` : 'not shipped']);
  checks.push(['product catalog', true, products ? `${listProductCategories(products).length} categories` : 'not shipped']);

  // The advisory hook writes .ld/metrics.jsonl every turn. Reading it back here
  // answers the first question anyone asks when the kit "doesn't work": is the
  // hook firing at all? Unknowable otherwise — it is silent on every path.
  checks.push(...hookChecks(c.root));

  out('');
  let failed = 0;
  const w = Math.max(...checks.map((c2) => c2[0].length));
  for (const [name, ok, detail] of checks) {
    if (!ok) failed += 1;
    out(`  ${ok ? 'ok  ' : 'FAIL'}  ${name.padEnd(w)}  ${detail}`);
  }
  out('');
  return failed === 0 ? 0 : 1;
}

/**
 * Hook health, read back from its own local telemetry.
 *
 * Mostly informational — a project whose agent has not taken a turn yet has no
 * metrics, and that is normal, not broken. The one hard failure is dedupe not
 * engaging, because that silently makes every turn re-pay full cost.
 */
function hookChecks(root) {
  const {records: rec, errors: errs} = loadHookTelemetry(root);
  if (!rec) return [['hook telemetry', true, 'no turns recorded yet (.ld/metrics.jsonl absent)']];
  if (!rec.length) return [['hook telemetry', true, 'no turns recorded yet']];

  const rows = [];
  const injected = rec.filter((r) => r.chars > 0).length;
  const avgMs = Math.round(rec.reduce((a, r) => a + (r.ms || 0), 0) / rec.length);
  const chars = rec.reduce((a, r) => a + (r.chars || 0), 0);
  rows.push(['hook activity', true, `${rec.length} turn(s) · ${injected} injected · avg ${avgMs}ms · ${chars} chars`]);

  const skipped = rec.filter((r) => r.skipped);
  if (skipped.length) {
    rows.push(['hook skips', true, `${skipped.length} produced nothing — ${[...new Set(skipped.map((r) => r.skipped))].join(', ')}`]);
  }

  const deduped = rec.reduce(
    (a, r) => a + (r.deduped ? Object.values(r.deduped).reduce((x, y) => x + y, 0) : 0),
    0,
  );
  if (rec.length >= 3) {
    rows.push([
      'hook dedupe',
      deduped > 0,
      deduped > 0
        ? `${deduped} unit(s) suppressed as already-served`
        : 'NOT engaging — every turn is re-paying full cost',
    ]);
  }
  if (rec.some((r) => r.auto_session)) {
    rows.push(['hook session id', true, 'runtime sends no session_id — using the sticky auto-session']);
  }

  rows.push([
    'hook errors',
    errs.length === 0,
    errs.length ? `${errs.length} — last: ${errs[errs.length - 1].slice(0, 90)}` : 'none',
  ]);
  return rows;
}

// Minimal ANSI — no chalk/etc, this file stays dependency-free. NO_COLOR
// (https://no-color.org) and non-TTY output both fall back to plain text.
const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code) => (s) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : s);
const bold = paint('1');
const dim = paint('2');
const cyan = paint('36');

/**
 * Interactive browser — humans only.
 *
 * The TTY check is the real gate. Env markers for agent runtimes are
 * version-dependent and unreliable, so they are an extra denial layer, never
 * the primary one: no TTY means no prompt, full stop.
 */
async function cmdMenu(c) {
  const interactive =
    process.stdin.isTTY &&
    process.stdout.isTTY &&
    !process.env.CI &&
    !process.env.LD_NON_INTERACTIVE;

  if (!interactive) {
    out('\nmenu needs a terminal. Non-interactive summary:\n');
    cmdDoctor(c);
    out(`  ${INVOKE} explain "<ask>"     see what a given ask would retrieve`);
    out(`  ${INVOKE} rule                list rules`);
    out(`  ${INVOKE} icons|illustrations|media|products <query>   search assets, with a usage snippet\n`);
    return 0;
  }

  const readline = await import('node:readline');
  const {createInterface} = await import('node:readline/promises');

  // A one-line prompt for the two actions that need free-text input. Raw
  // mode has to drop while this runs — readline's line editing (backspace,
  // history-free but still needs the terminal in cooked mode) conflicts with
  // it — then come back up for the arrow-key loop.
  async function promptLine(label) {
    process.stdin.setRawMode(false);
    const rl = createInterface({input: process.stdin, output: process.stdout});
    try {
      return (await rl.question(label)).trim();
    } finally {
      rl.close();
      process.stdin.setRawMode(true);
    }
  }

  // Browsing an asset command does NOT require a search term: it always
  // shows the bucket list first (so you can see what exists), then an empty
  // answer at each following prompt means "everything" rather than a dead
  // end — bucket blank -> search across all of them, query blank -> list the
  // whole bucket instead of filtering it. A search term is optional, not a
  // precondition, at every step.
  async function browseAsset(cmd) {
    cmd(c, [], {}); // bare invocation: prints the bucket list
    const bucket = (await promptLine(`  ${cmd.bucketNoun} (blank = every ${cmd.bucketNoun}): `)).trim();
    const query = (await promptLine('  query (blank = list all): ')).trim();
    return cmd(c, [bucket, query].filter(Boolean), {});
  }

  const items = [
    {label: 'List rules', run: () => cmdRule(c, [])},
    {label: 'Search', run: async () => cmdSearch(c, (await promptLine('  search: ')).split(/\s+/), {})},
    {label: 'Dry-run an ask', run: async () => cmdExplain(c, [await promptLine('  ask: ')], {})},
    {label: 'Icons', run: () => browseAsset(cmdIcons)},
    {label: 'Illustrations', run: () => browseAsset(cmdIllustrations)},
    {label: 'Media', run: () => browseAsset(cmdMedia)},
    {label: 'Products', run: () => browseAsset(cmdProducts)},
    {label: 'Doctor', run: () => cmdDoctor(c)},
    {label: 'Quit', quit: true},
  ];

  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdout.write('\x1b[?25l'); // hide cursor

  let selected = 0;
  let menuLines = 0;

  function draw() {
    if (menuLines > 0) process.stdout.write(`\x1b[${menuLines}A\x1b[0J`);
    const lines = [
      '',
      `${bold('Living Design — context engine')}`,
      dim('  ↑/↓ move    enter select    q quit'),
      '',
      ...items.map((item, i) => {
        const on = i === selected;
        const marker = on ? cyan('❯') : ' ';
        return `  ${marker} ${on ? bold(item.label) : item.label}`;
      }),
      '',
    ];
    process.stdout.write(lines.join('\n') + '\n');
    menuLines = lines.length;
  }

  function nextKey() {
    return new Promise((resolve) => process.stdin.once('keypress', (str, key) => resolve({str, key})));
  }

  try {
    draw();
    for (;;) {
      const {str, key} = await nextKey();
      if (key?.ctrl && key.name === 'c') break;
      if (str === 'q') break;
      if (key?.name === 'up') {
        selected = (selected - 1 + items.length) % items.length;
        draw();
      } else if (key?.name === 'down') {
        selected = (selected + 1) % items.length;
        draw();
      } else if (key?.name === 'return') {
        const item = items[selected];
        if (item.quit) break;
        menuLines = 0; // the action prints its own output; redraw fresh after it
        await item.run();
        draw();
      }
    }
  } finally {
    process.stdout.write('\x1b[?25h'); // restore cursor
    if (process.stdin.setRawMode) process.stdin.setRawMode(false);
    process.stdin.pause();
  }
  return 0;
}

const HANDLERS = {
  context: cmdContext,
  search: cmdSearch,
  show: cmdShow,
  rule: cmdRule,
  utils: cmdUtils,
  icons: cmdIcons,
  illustrations: cmdIllustrations,
  media: cmdMedia,
  products: cmdProducts,
  list: cmdList,
  explain: cmdExplain,
  doctor: cmdDoctor,
  menu: cmdMenu,
};

async function main() {
  const {command, rest, flags, errors} = parseArgs(process.argv.slice(2));

  for (const e of errors) err(e);
  if (errors.length > 0) {
    err(usage());
    return 1;
  }

  // Bare invocation and `help` both print usage and exit 0. Never a prompt.
  if (!command || command === 'help' || flags.help) {
    out(usage());
    return 0;
  }

  const handler = HANDLERS[command];
  if (!handler) {
    err(`Unknown command: ${command}`);
    err(usage());
    return 1;
  }

  const corpus = openCorpus(flags);
  if (!corpus) return 1;

  return (await handler(corpus, rest, flags)) ?? 0;
}

main()
  .then((code) => {
    // exitCode, not exit(): process.exit() does not wait for a pending stdout
    // write to a PIPE to flush, and it truncated real output deterministically
    // once a response exceeded the pipe buffer (~8KB) — `search --json` with
    // enough results, a full `list --json`, `icons`/`illustrations`/`media`
    // with no filter. Setting exitCode and letting the event loop drain
    // naturally waits for the write to complete before the process exits.
    process.exitCode = code;
  })
  .catch((e) => {
    // A retrieval tool must not take down the caller's turn with a stack trace.
    err(`context engine error: ${e?.message ?? e}`);
    process.exitCode = 1;
  });
