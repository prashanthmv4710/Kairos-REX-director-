/**
 * cli/engine/pack.mjs — assemble a token-bounded context pack for one ask.
 *
 * This is the focal point the rule files point at. The design premise: an agent
 * given a list of files to read will skip most of them, and anything front-
 * loaded at session start decays out of the window. So instead of pointing at
 * guidance, `context` RETURNS it — the project's hard rules, the rule sections
 * that bear on THIS ask, and the APIs of the components and utilities it will
 * probably need, already assembled, in one call.
 *
 * Two contracts the rest of the design leans on:
 *
 *   1. Whole chunks only. A section is emitted in full or dropped and listed
 *      with its exact fetch command. An agent handed a section cut off mid-
 *      sentence cannot tell that anything is missing; one told "dropped, run
 *      this" can go get it.
 *   2. Never fails. Empty query, no matches, missing manifest — all exit 0 with
 *      something useful. A retrieval call that breaks the agent's turn is worse
 *      than one that returns little.
 *
 * Pure: no I/O. Ships verbatim into generated projects as scripts/ld/pack.mjs.
 */

import {rankChunks, rankComponents} from './rank.mjs';
import {estimateTokens} from './text.mjs';

/**
 * 6,000 tokens ≈ 24,000 chars.
 *
 * Calibrated against what it replaces: seven `alwaysApply: true` rule files,
 * ~2,400 lines, roughly 24k TOKENS, blasted once at session start and decaying
 * from there. A 6k pack is ~4x cheaper and arrives fresh on the ask it applies
 * to. It is also small enough (1-3% of a modern window) that an agent will call
 * it every time rather than rationing it — that behavioural property is the
 * point. Much larger and it gets skimmed; much smaller and it cannot hold a
 * component's API alongside the rules constraining its use.
 */
export const DEFAULT_BUDGET_TOKENS = 6000;
const CHARS_PER_TOKEN = 4;

/**
 * Per-tier char allowances. Enforced in chars because that is deterministic and
 * testable; `--budget` is expressed in tokens because that is how callers think.
 *
 * Unused allowance flows FORWARD only, in this order, so the result is a pure
 * function of (query, corpus).
 */
export const TIER_CHARS = {
  spine: 900,
  sections: 11000,
  directives: 5000,
  catalog: 6000,
  omitted: 1100,
};

/**
 * Reported so callers can see how strongly an ask matched. NOT a classifier.
 *
 * A query-only "is this ask about the design system?" test was tried and
 * abandoned: on a corpus this dense almost any English sentence hits something,
 * and no threshold separated the classes. Measured, "add a date picker" scored
 * 124 and "explain how this function works" 42 — but "make a bottom drawer", a
 * genuine UI ask, scored 36, BELOW the noise. Field-shape signals fared no
 * better; a rule matching `directives` fired for "update the changelog".
 *
 * So there is deliberately no silence gate. The advisory hook keeps injection
 * cheap a different way — by de-duplicating against what the session has
 * already been shown, which makes a repeat or off-topic turn nearly free
 * without ever wrongly withholding guidance on a real one. A gate that
 * silences on a real UI ask is a worse failure than 1.5k tokens spent on an
 * unrelated one.
 */
export const NOISE_REFERENCE = 40;

/**
 * Breadth over depth in the directives tier.
 *
 * At 10-per-file the top-ranked rule ate the whole tier: an ask about product
 * cards came back with ten a11y constraints and nothing about product data,
 * because a11y has the most MUST/NEVER lines in the corpus and won the first
 * slot. Five from each of four rules covers the same budget and actually spans
 * the rules that bear on the ask.
 */
const DEFAULT_LIMITS = {sections: 6, catalog: 8, directiveFiles: 4, directivesPerFile: 5};

function scale(budgetChars) {
  const total = Object.values(TIER_CHARS).reduce((a, b) => a + b, 0);
  const factor = budgetChars / total;
  return Object.fromEntries(
    Object.entries(TIER_CHARS).map(([k, v]) => [k, Math.floor(v * factor)]),
  );
}

/**
 * Build the pack.
 *
 * @param {object} opts
 * @param {string} opts.query        the user's ask, verbatim
 * @param {any[]} opts.chunks        rule chunks (see chunk.mjs)
 * @param {any[]} opts.components    manifest entries: components, hooks, utilities
 * @param {Map} [opts.manifest]      per-rule metadata
 * @param {any} [opts.spine]         the always-include hard-rules chunk
 * @param {any} [opts.root]          resolved corpus root, for reporting
 * @param {number} [opts.budgetTokens]
 * @param {(entry:any)=>string} [opts.readDoc]
 */
export function buildPack(opts) {
  const {
    query = '',
    chunks = [],
    components = [],
    manifest = new Map(),
    spine = null,
    root = null,
    readDoc,
  } = opts;

  const budgetTokens = opts.budgetTokens && opts.budgetTokens > 0
    ? opts.budgetTokens
    : DEFAULT_BUDGET_TOKENS;
  const budgetChars = budgetTokens * CHARS_PER_TOKEN;
  const limits = {...DEFAULT_LIMITS, ...(opts.limits ?? {})};
  const caps = scale(budgetChars);
  const warnings = [];

  const trimmedQuery = String(query).trim();
  const ruleRanked = trimmedQuery ? rankChunks(chunks, trimmedQuery, {limit: 200, manifest}) : {hits: []};
  const compRanked = trimmedQuery
    ? rankComponents(components, trimmedQuery, {limit: 200, readDoc})
    : {hits: []};

  // ── tier 0: spine (always, never trimmed) ──────────────────────────────
  const spineOut = spine ? {file: spine.file, anchor: spine.anchor, text: spine.text.trim()} : null;
  if (!spineOut) {
    warnings.push('No hard-rules section found in AGENTS.md — the pack has no always-on spine.');
  }
  let used = spineOut ? Math.min(spineOut.text.length, caps.spine) : 0;
  let carry = Math.max(0, caps.spine - used);

  // ── tier 1: rule sections, whole chunks only ───────────────────────────
  // Selected BEFORE directives even though it renders after, because a
  // directive line already visible inside a selected section must not be
  // printed twice in the same pack.
  const sections = [];
  const omittedSections = [];
  let sectionRoom = caps.sections + carry;
  for (const hit of ruleRanked.hits) {
    if (sections.length >= limits.sections) {
      omittedSections.push(hit);
      continue;
    }
    if (hit.chunk.chars <= sectionRoom) {
      sections.push(hit);
      sectionRoom -= hit.chunk.chars;
    } else {
      omittedSections.push(hit);
    }
  }
  used += caps.sections + carry - sectionRoom;
  carry = Math.max(0, sectionRoom);

  // ── tier 2: the MUST/NEVER lines for this ask ──────────────────────────
  const emittedChunkIds = new Set(sections.map((h) => h.chunk.id));
  const seenDirectives = new Set();
  const directives = [];
  let directiveRoom = caps.directives + carry;

  // Top rule FILES by their best-scoring chunk — directives are a per-rule
  // spine, so ranking by file keeps a single rule from monopolising the tier.
  const fileOrder = [];
  for (const hit of ruleRanked.hits) {
    if (!fileOrder.includes(hit.chunk.ruleId)) fileOrder.push(hit.chunk.ruleId);
  }

  for (const ruleId of fileOrder.slice(0, limits.directiveFiles)) {
    let perFile = 0;
    // Query-matched chunks first, then the rule's remaining hard-rule chunks:
    // a MUST that answers the ask outranks one that merely lives nearby.
    const ranked = ruleRanked.hits.filter((h) => h.chunk.ruleId === ruleId);
    const rest = chunks.filter(
      (c) => c.ruleId === ruleId && c.hardRule && !ranked.some((h) => h.chunk.id === c.id),
    );
    for (const chunk of [...ranked.map((h) => h.chunk), ...rest]) {
      if (emittedChunkIds.has(chunk.id)) continue;
      for (const line of chunk.directives) {
        if (perFile >= limits.directivesPerFile) break;
        const key = line.replace(/\s+/g, ' ').toLowerCase();
        if (seenDirectives.has(key)) continue;
        if (line.length > directiveRoom) continue;
        seenDirectives.add(key);
        directives.push({ruleId, anchor: chunk.anchor, file: chunk.file, text: line});
        directiveRoom -= line.length;
        perFile += 1;
      }
    }
  }
  used += caps.directives + carry - directiveRoom;
  carry = Math.max(0, directiveRoom);

  // ── tier 3: components + utilities ─────────────────────────────────────
  const catalog = [];
  const omittedCatalog = [];
  let catalogRoom = caps.catalog + carry;
  for (const hit of compRanked.hits) {
    if (catalog.length >= limits.catalog) {
      omittedCatalog.push(hit);
      continue;
    }
    const rendered = renderEntry(hit);
    if (rendered.chars <= catalogRoom) {
      catalog.push(rendered);
      catalogRoom -= rendered.chars;
    } else {
      omittedCatalog.push(hit);
    }
  }
  used += caps.catalog + carry - catalogRoom;

  // ── tier 4: what got left out, and how to get it ───────────────────────
  const omitted = {
    sections: omittedSections.slice(0, 6).map((h) => ({
      id: h.chunk.id,
      chars: h.chunk.chars,
      command: `rule ${h.chunk.id}`,
    })),
    catalog: omittedCatalog.slice(0, 12).map((h) => ({
      name: h.entry.name,
      kind: h.entry.kind ?? 'component',
      command: `show ${h.entry.name}`,
    })),
    moreSections: Math.max(0, omittedSections.length - 6),
    moreCatalog: Math.max(0, omittedCatalog.length - 12),
  };

  const bestScore = Math.max(ruleRanked.hits[0]?.score ?? 0, compRanked.hits[0]?.score ?? 0);

  if (!trimmedQuery) {
    warnings.push('No ask given — showing orientation only. Pass your ask to get a targeted pack.');
  } else if (ruleRanked.hits.length === 0 && compRanked.hits.length === 0) {
    warnings.push(
      `Nothing matched "${trimmedQuery}". The project hard rules still apply; ` +
        'try `search <keywords>` with different terms.',
    );
  }

  return {
    schema: 1,
    query: trimmedQuery,
    root: root ? {path: root.path, source: root.source} : null,
    budget: {
      tokens: budgetTokens,
      chars: budgetChars,
      usedChars: used,
      usedTokensEst: estimateTokens(used),
    },
    // Informational only — see NOISE_REFERENCE. Nothing branches on this.
    relevance: {
      best: Math.round(bestScore * 100) / 100,
      noiseReference: NOISE_REFERENCE,
    },
    counts: {
      rulesMatched: ruleRanked.hits.length,
      catalogMatched: compRanked.hits.length,
      chunksIndexed: chunks.length,
      catalogIndexed: components.length,
    },
    spine: spineOut,
    directives,
    sections: sections.map((h) => ({
      id: h.chunk.id,
      ruleId: h.chunk.ruleId,
      anchor: h.chunk.anchor,
      file: h.chunk.file,
      headingPath: h.chunk.headingPath,
      startLine: h.chunk.startLine,
      chars: h.chunk.chars,
      score: Math.round(h.score * 100) / 100,
      matchedFields: [...h.fields],
      text: h.chunk.text,
    })),
    catalog,
    omitted,
    warnings,
  };
}

/** One catalog line-item: import, intent, and the API a caller needs. */
function renderEntry(hit) {
  const e = hit.entry;
  const kind = e.kind ?? 'component';
  const props = e.props ?? [];
  const isUtil = kind === 'utility';

  // A utility's whole export surface is the point of it; a component's required
  // props are mandatory and its optional ones are a long tail worth capping.
  const primary = isUtil ? props.filter((p) => !p.isType) : props.filter((p) => p.required);
  const secondary = isUtil ? [] : props.filter((p) => !p.required).slice(0, 8);
  const hiddenOptional = isUtil ? 0 : Math.max(0, props.filter((p) => !p.required).length - 8);

  const item = {
    name: e.name,
    kind,
    category: e.category,
    importPath: e.importPath,
    intent: e.intent ?? null,
    signature: e.signature ?? null,
    primary: primary.map((p) => ({name: p.name, type: p.type, description: p.description})),
    secondary: secondary.map((p) => ({name: p.name, type: p.type})),
    hiddenOptional,
    score: Math.round(hit.score * 100) / 100,
    snippet: hit.snippet,
  };
  item.chars = JSON.stringify(item).length;
  return item;
}

/**
 * Orientation body for an empty query: what exists, and the commands to reach
 * it. `context` with no ask means "orient me", which is a real request.
 */
export function buildOrientation({chunks = [], components = [], manifest = new Map()}) {
  const byRule = new Map();
  for (const c of chunks) byRule.set(c.ruleId, (byRule.get(c.ruleId) ?? 0) + 1);
  return {
    rules: [...byRule.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([id, sections]) => ({
        id,
        sections,
        description: manifest.get(id)?.description ?? '',
        alwaysApply: Boolean(manifest.get(id)?.alwaysApply),
      })),
    counts: {
      components: components.filter((c) => (c.kind ?? 'component') === 'component').length,
      hooks: components.filter((c) => c.kind === 'hook').length,
      utils: components.filter((c) => c.kind === 'utility').length,
    },
  };
}
