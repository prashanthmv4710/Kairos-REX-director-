/**
 * cli/engine/rank.mjs — ranking for the component corpus.
 *
 * Moved out of cli/components.ts so the scoring can be shared by the published
 * `ld-kit` bin AND the copy that ships into generated projects as
 * scripts/ld/rank.mjs. cli/components.ts re-exports these with the real doc
 * reader bound, which is why cli/components.test.ts still passes unchanged —
 * that unchanged test file is the parity proof for this move.
 *
 * Purity note: this module does NO I/O. Doc text arrives via an injected
 * `readDoc(entry) -> string`. Previously `narrativeFor` read the filesystem
 * through a module-level SKILL_ROOT_URL, which made "pure ranking core" untrue
 * and forced the test to pass a file:// href as `docPath`.
 *
 * Ships verbatim into generated projects. Keep it dependency-free.
 */

import {idfMap, lengthNorm, snippetAround, tokenizeQuery, variantsOf, wordMatch} from './text.mjs';

/**
 * Field weights. A name hit must outrank a passing mention buried in usage
 * notes, so the spread is deliberately wide.
 */
export const FIELD_WEIGHTS = {
  name: 10,
  intent: 6,
  props: 4,
  propDesc: 2,
  doc: 1,
  category: 1,
};

export const FIELD_LABELS = {
  name: 'name',
  intent: 'intent',
  props: 'props',
  propDesc: 'prop docs',
  doc: 'usage notes',
  category: 'category',
};

const FIELD_KEYS = Object.keys(FIELD_WEIGHTS);

/**
 * A manifest entry, duck-typed. Deliberately loose: the engine scores
 * components, hooks and utilities without importing any of their types, and it
 * ships into generated projects where those types do not exist.
 *
 * Typed as `any` rather than a Record so it stays assignable in BOTH
 * directions at the TS boundary: cli/components.ts passes its concrete
 * `ComponentEntry` in, and reads a `ComponentEntry[]` back out. An index
 * signature would satisfy neither.
 *
 * @typedef {any} Entry
 * @typedef {(entry: any) => string} DocReader
 */

/** No-op reader — ranking degrades to manifest-only fields, never throws. */
/** @type {DocReader} */
const NO_DOC = () => '';

/**
 * The rendered <Name>.md echoes name/intent/props as boilerplate before the
 * hand-authored "## Usage notes" section. Only that trailing section is unique
 * free text — scoring the whole file would double-count fields already scored
 * (and mislabel a boilerplate hit as a "usage notes" match). Returns '' when a
 * component has no usage notes so its coverage reads honestly.
 */
/**
 * @param {Entry} entry
 * @param {DocReader} [readDoc]
 */
export function usageNotesOf(entry, readDoc = NO_DOC) {
  const doc = readDoc(entry) || '';
  const idx = doc.toLowerCase().indexOf('## usage notes');
  return idx === -1 ? '' : doc.slice(idx);
}

/**
 * @param {Entry} entry
 * @param {DocReader} [readDoc]
 */
export function fieldsFor(entry, readDoc = NO_DOC) {
  return {
    name: entry.name.toLowerCase(),
    intent: (entry.intent ?? '').toLowerCase(),
    category: String(entry.category ?? '').toLowerCase(),
    props: (entry.props ?? []).map((p) => p.name).join(' ').toLowerCase(),
    propDesc: (entry.props ?? []).map((p) => p.description ?? '').join(' ').toLowerCase(),
    doc: usageNotesOf(entry, readDoc).toLowerCase(),
  };
}

/**
 * Filter a component pool to one category. Returns the result; callers decide
 * how to report an empty match.
 */
/**
 * @param {Entry[]} pool
 * @param {string} category
 * @returns {Entry[]}
 */
export function filterByCategory(pool, category) {
  const cat = String(category).toLowerCase();
  return pool.filter((c) => c.category === cat);
}

/**
 * Best-matching variant of `term` present in `text`, or null.
 *
 * Returns a single variant so callers score it ONCE — summing across variants
 * would double-count a plural query against a doc containing both forms.
 */
function matchVariant(text, term, field) {
  const substring = SUBSTRING_FIELDS.has(field);
  for (const v of variantsOf(term)) {
    if (substring ? text.includes(v) : wordMatch(text, v)) return v;
  }
  return null;
}

/**
 * Fields whose content is IDENTIFIERS, where substring matching is what you
 * want: "sku" must reach `getProductBySku`, "butt" must reach `Button`. Every
 * other field is prose and matches whole words only — see wordMatch for the
 * false positives that motivated it ("typo" reaching typography).
 */
const SUBSTRING_FIELDS = new Set(['name', 'props', 'code']);

/**
 * Short "why it matched" snippet, preferring a usage-notes line over a prop.
 * The header/intent/prop-list region is skipped — name and intent already
 * appear on their own lines, so echoing them adds nothing.
 */
/**
 * @param {string[]} terms
 * @param {Entry} entry
 * @param {DocReader} [readDoc]
 * @returns {string}
 */
export function buildSnippet(terms, entry, readDoc = NO_DOC) {
  const region = usageNotesOf(entry, readDoc);
  if (region) {
    const line = snippetAround(region, terms);
    if (line) return `"${line}"`;
  }
  for (const term of terms) {
    const p = (entry.props ?? []).find(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.description ?? '').toLowerCase().includes(term),
    );
    if (p) {
      const desc = p.description ? ` — ${p.description.split('\n')[0]}` : '';
      // A utility's `props` are its exported symbols and a hook's are its
      // options bag — calling either a "prop" misdescribes what matched.
      const label = entry.kind === 'utility' ? 'export' : entry.kind === 'hook' ? 'option' : 'prop';
      return `${label} \`${p.name}\`${desc}`;
    }
  }
  return '';
}

/**
 * Rank a component pool against a query.
 *
 * Scoring: per term, sum the weights of every field the term appears in, apply
 * exact/prefix name bonuses, multiply by the term's IDF, then add a phrase
 * bonus when the whole multi-word query appears verbatim. Sort by term recall
 * first, then score, then name for stable output.
 *
 * @param {Entry[]} pool
 * @param {string} rawQuery
 * @param {{limit?: number, readDoc?: DocReader}} [opts]
 */
export function rankComponents(pool, rawQuery, opts = {}) {
  const readDoc = opts.readDoc ?? NO_DOC;
  const {terms, phrase} = tokenizeQuery(rawQuery);

  const indexed = pool.map((entry) => ({entry, fields: fieldsFor(entry, readDoc)}));
  const idf = idfMap(terms, indexed.length, (term) => {
    let df = 0;
    for (const {fields} of indexed) {
      if (FIELD_KEYS.some((k) => matchVariant(fields[k], term, k))) df += 1;
    }
    return df;
  });

  const hits = [];
  for (const {entry, fields} of indexed) {
    let score = 0;
    let matchedTerms = 0;
    const matchedFields = new Set();

    for (const term of terms) {
      let termScore = 0;
      for (const key of FIELD_KEYS) {
        const hit = matchVariant(fields[key], term, key);
        if (!hit) continue;
        termScore += FIELD_WEIGHTS[key];
        matchedFields.add(key);
        if (key === 'name') {
          // Reward exact / prefix name matches so `search button` floats
          // Button above ButtonGroup and anything that merely mentions it.
          if (fields.name === hit) termScore += 20;
          else if (fields.name.startsWith(hit)) termScore += 6;
        }
      }
      if (termScore > 0) {
        matchedTerms += 1;
        score += termScore * (idf.get(term) ?? 1);
      }
    }

    if (matchedTerms === 0) continue;

    // Phrase bonus: the whole multi-word query appearing verbatim is a much
    // stronger signal than its terms scattered across fields.
    if (terms.length > 1) {
      if (fields.name.includes(phrase)) score += 15;
      else if (fields.intent.includes(phrase)) score += 8;
    }

    hits.push({
      entry,
      score,
      matchedTerms,
      fields: matchedFields,
      snippet: buildSnippet(terms, entry, readDoc),
    });
  }

  hits.sort(
    (a, b) =>
      b.matchedTerms - a.matchedTerms ||
      b.score - a.score ||
      a.entry.name.localeCompare(b.entry.name),
  );

  const limit = opts.limit && opts.limit > 0 ? opts.limit : 10;
  return {hits, top: hits.slice(0, limit)};
}

export function toSearchJson(top) {
  return top.map((h) => ({
    name: h.entry.name,
    category: h.entry.category,
    importPath: h.entry.importPath,
    intent: h.entry.intent ?? null,
    docPath: h.entry.docPath,
    score: Math.round(h.score * 100) / 100,
    matchedTerms: h.matchedTerms,
    matchedFields: [...h.fields].map((f) => FIELD_LABELS[f]),
  }));
}

// ── rule-chunk ranking ───────────────────────────────────────────────────
// A sibling ranker rather than a reuse of rankComponents. Casting chunks into
// component shape would be zero new code but would mislabel every field in the
// output and fire the exact-NAME bonus on heading text.
//
// Rules and components are ranked and reported as TWO lists, never merged. The
// component sort is recall-first (`matchedTerms` before score), and rule chunks
// average ~690 chars against a ~40-char component intent — merged, chunks would
// mechanically sweep the top of every list on term recall alone, regardless of
// relevance. Where a single ordering is genuinely needed (dividing the context
// pack's budget), normalize within each corpus and never compare raw scores.

/**
 * Magnitudes deliberately mirror FIELD_WEIGHTS so the two rankers are
 * intuitively comparable WITHIN their own corpus.
 *
 * `directive` sits high because a MUST/NEVER line matching the query is the
 * single most actionable thing retrieval can surface. `code` beats `body`
 * because API identifiers in an example are precise signal, where prose is
 * diffuse.
 */
export const RULE_FIELD_WEIGHTS = {
  heading: 10,
  directive: 7,
  description: 6,
  ruleTitle: 5,
  path: 3,
  code: 2,
  body: 1,
};

export const RULE_FIELD_LABELS = {
  heading: 'heading',
  directive: 'directives',
  description: 'rule description',
  ruleTitle: 'rule title',
  path: 'section path',
  code: 'code example',
  body: 'body',
};

const RULE_FIELD_KEYS = Object.keys(RULE_FIELD_WEIGHTS);

/**
 * Searchable text per field for one chunk.
 * @param {any} chunk
 * @param {any} [meta] the containing rule's manifest entry
 */
export function chunkFields(chunk, meta) {
  return {
    heading: String(chunk.heading ?? '').toLowerCase(),
    directive: (chunk.directives ?? []).join(' \n').toLowerCase(),
    description: String(meta?.description ?? '').toLowerCase(),
    ruleTitle: String(meta?.title ?? chunk.ruleId ?? '').toLowerCase(),
    // Ancestor headings only — the chunk's own heading is already scored at 10.
    path: (chunk.headingPath ?? []).slice(0, -1).join(' ').toLowerCase(),
    code: String(chunk.code ?? '').toLowerCase(),
    body: String(chunk.body ?? '').toLowerCase(),
  };
}

/**
 * Rank rule chunks against a query.
 *
 * Unlike the component ranker this uses a single continuous score rather than
 * sorting on recall first. Recall still dominates (via the multiplier) but
 * smoothly, and dividing by lengthNorm lets a tight heading-matched section
 * beat a 2.5k section that merely mentions the term once.
 *
 * @param {any[]} chunks
 * @param {string} rawQuery
 * @param {{limit?: number, manifest?: Map<string, any>}} [opts]
 */
export function rankChunks(chunks, rawQuery, opts = {}) {
  const manifest = opts.manifest ?? new Map();
  const {terms, phrase} = tokenizeQuery(rawQuery);

  const indexed = chunks.map((chunk) => ({
    chunk,
    fields: chunkFields(chunk, manifest.get(chunk.ruleId)),
  }));

  const idf = idfMap(terms, indexed.length, (term) => {
    let df = 0;
    for (const {fields} of indexed) {
      if (RULE_FIELD_KEYS.some((k) => matchVariant(fields[k], term, k))) df += 1;
    }
    return df;
  });

  const hits = [];
  for (const {chunk, fields} of indexed) {
    let raw = 0;
    let matchedTerms = 0;
    const matchedFields = new Set();

    for (const term of terms) {
      let termScore = 0;
      for (const key of RULE_FIELD_KEYS) {
        const hit = matchVariant(fields[key], term, key);
        if (!hit) continue;
        termScore += RULE_FIELD_WEIGHTS[key];
        matchedFields.add(key);
        if (key === 'heading') {
          if (fields.heading === hit) termScore += 20;
          else if (fields.heading.startsWith(hit)) termScore += 6;
        }
      }
      if (termScore > 0) {
        matchedTerms += 1;
        raw += termScore * (idf.get(term) ?? 1);
      }
    }

    if (matchedTerms === 0) continue;

    if (terms.length > 1) {
      if (fields.heading.includes(phrase)) raw += 15;
      else if (fields.description.includes(phrase)) raw += 8;
    }

    const score = (raw * (1 + 0.5 * (matchedTerms - 1))) / lengthNorm(chunk.chars ?? 1);

    hits.push({
      chunk,
      score,
      matchedTerms,
      fields: matchedFields,
      snippet: snippetAround(chunk.body || chunk.text, terms),
    });
  }

  hits.sort((a, b) => b.score - a.score || a.chunk.id.localeCompare(b.chunk.id));

  const limit = opts.limit && opts.limit > 0 ? opts.limit : 10;
  return {hits, top: hits.slice(0, limit)};
}

export function toRulesJson(top) {
  return top.map((h) => ({
    id: h.chunk.id,
    ruleId: h.chunk.ruleId,
    anchor: h.chunk.anchor,
    file: h.chunk.file,
    headingPath: h.chunk.headingPath,
    startLine: h.chunk.startLine,
    chars: h.chunk.chars,
    hardRule: h.chunk.hardRule,
    score: Math.round(h.score * 100) / 100,
    matchedTerms: h.matchedTerms,
    matchedFields: [...h.fields].map((f) => RULE_FIELD_LABELS[f]),
    snippet: h.snippet,
  }));
}
