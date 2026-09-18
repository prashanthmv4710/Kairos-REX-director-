/**
 * cli/engine/text.mjs — query tokenization, IDF, and size heuristics.
 *
 * Pure: no imports, no I/O, no process access. Shared by the component ranker
 * and the rule-chunk ranker so both tokenize a query identically.
 *
 * This module ships verbatim into generated projects as scripts/ld/text.mjs
 * (see scripts/ld/scaffold.mjs). Keep it dependency-free.
 */

/**
 * Words carrying no retrieval signal, dropped from every query.
 *
 * This is a correctness fix, not a nicety. The ranker's primary sort key is
 * `matchedTerms` (term recall), and `ld context` explicitly invites whole
 * sentences — "build a PDP page with product cards". Left in, `a` and `with`
 * award free recall credit to any document long enough to contain them, so the
 * longest document wins regardless of relevance. Rule sections average ~690
 * chars against a ~40-char component intent, which makes the distortion
 * systematic rather than occasional.
 */
export const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'been', 'but', 'by', 'can', 'do',
  'does', 'for', 'from', 'had', 'has', 'have', 'how', 'i', 'if', 'in', 'into',
  'is', 'it', 'its', 'me', 'my', 'need', 'of', 'on', 'or', 'our', 'out', 'over',
  'should', 'so', 'that', 'the', 'their', 'them', 'then', 'there', 'these',
  'they', 'this', 'to', 'up', 'use', 'want', 'was', 'we', 'were', 'what', 'when',
  'where', 'which', 'while', 'who', 'why', 'will', 'with', 'would', 'you', 'your',
]);

/** Shortest term worth indexing — single characters match everything. */
const MIN_TERM_LENGTH = 2;

/**
 * Split a raw query into scoreable terms plus the verbatim phrase.
 *
 * Terms are lowercased, stopword-filtered, length-filtered, and de-duplicated
 * while preserving first-seen order. `phrase` is the whole lowercased query,
 * used for the exact-phrase bonus.
 */
export function tokenizeQuery(raw) {
  const phrase = String(raw ?? '').trim().toLowerCase();
  const seen = new Set();
  const terms = [];
  for (const tok of phrase.split(/[^a-z0-9#._-]+/)) {
    if (!tok) continue;
    if (tok.length < MIN_TERM_LENGTH) continue;
    if (STOPWORDS.has(tok)) continue;
    if (seen.has(tok)) continue;
    seen.add(tok);
    terms.push(tok);
  }
  return {terms, phrase};
}

/**
 * Naive singular/plural variants of a term, most-specific first.
 *
 * Callers must score the BEST-matching variant once, never sum across variants,
 * or a plural query double-counts against a document containing both forms.
 *
 * Deliberately conservative — no stemmer, no irregulars. "cards"→"card" and
 * "utilities"→"utility" are the cases that actually come up in these corpora;
 * "class"→"clas" is the failure this guards against by refusing to strip an
 * `s` that follows another `s`.
 */
export function variantsOf(term) {
  const out = [term];
  if (term.length >= 5 && term.endsWith('ies')) {
    out.push(`${term.slice(0, -3)}y`);
  } else if (term.length >= 5 && /(?:ch|sh|ss|x|z)es$/.test(term)) {
    out.push(term.slice(0, -2));
  } else if (term.length >= 4 && term.endsWith('s') && !/ss$/.test(term)) {
    out.push(term.slice(0, -1));
  } else if (term.length >= 3 && /y$/.test(term)) {
    // Bidirectional on purpose: prose fields match whole words (see wordMatch),
    // so a singular query must still reach plural text. "utility" → "utilities".
    out.push(`${term.slice(0, -1)}ies`);
  } else if (term.length >= 3) {
    out.push(/(?:ch|sh|s|x|z)$/.test(term) ? `${term}es` : `${term}s`);
  }
  return out;
}

const _wordRe = new Map();

/** Escape a term for literal use inside a RegExp. */
function escapeRe(t) {
  return t.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');
}

/**
 * Whole-word match, for PROSE fields.
 *
 * Plain substring matching produced confident nonsense: the ask "fix a typo in
 * the readme" surfaced `spacing#micro-spacing-for-typography-alignment` because
 * "typo" is a prefix of "typography", and "explain how this function works" hit
 * `useCanvasWorkspace` on "works" inside "workspace". Those crowd out real
 * results and burn budget on guidance nobody asked for.
 *
 * Identifier-bearing fields (a component's name, a utility's export list, code
 * examples) deliberately keep substring matching — "sku" SHOULD reach
 * `getProductBySku`, and a prefix like "butt" SHOULD reach `Button`.
 */
export function wordMatch(text, term) {
  if (!text) return false;
  let re = _wordRe.get(term);
  if (!re) {
    re = new RegExp(`(?:^|[^a-z0-9])${escapeRe(term)}(?:[^a-z0-9]|$)`);
    _wordRe.set(term, re);
  }
  return re.test(text);
}

/**
 * Inverse document frequency per term: log(1 + N/(1+df)).
 *
 * ~0 for a term present in every document, growing as the term gets rarer — so
 * "searchable" outweighs "select" when both appear in a query. `dfOf` is
 * injected so the same formula serves any corpus.
 *
 * The formula is pinned by test: `cli/components.test.ts` asserts a specific
 * ranking that depends on these exact magnitudes.
 */
export function idfMap(terms, docCount, dfOf) {
  const n = docCount || 1;
  const idf = new Map();
  for (const term of terms) {
    idf.set(term, Math.log(1 + n / (1 + dfOf(term))));
  }
  return idf;
}

/** Rough token count from character count. Documented as an estimate only. */
export function estimateTokens(chars) {
  return Math.ceil(chars / 4);
}

/**
 * Length normalizer that damps long documents without burying them.
 *
 * 512 chars → 1.00, 1435 → ~1.37, 3321 → ~1.68. Applied as a divisor so a
 * short heading-matched section can outrank a 3.3k section that merely
 * mentions the term, while a genuinely richer long section still wins on
 * accumulated field hits.
 */
export function lengthNorm(chars, pivot = 512) {
  return 1 + 0.25 * Math.max(0, Math.log2(Math.max(chars, 1) / pivot));
}

/**
 * A single-line excerpt around the first matching term, ellipsized to ~110
 * chars when the containing line is long. Returns '' when nothing matches.
 */
export function snippetAround(text, terms, {max = 120, window = 110, lead = 45} = {}) {
  if (!text) return '';
  const lower = text.toLowerCase();
  for (const term of terms) {
    const idx = lower.indexOf(term);
    if (idx === -1) continue;
    const start = lower.lastIndexOf('\n', idx) + 1;
    let end = lower.indexOf('\n', idx);
    if (end === -1) end = text.length;
    let line = text.slice(start, end).trim().replace(/^#+\s*/, '').replace(/^[-*]\s*/, '');
    if (!line) continue;
    if (line.length > max) {
      const rel = idx - start;
      const from = Math.max(0, rel - lead);
      line = (from > 0 ? '…' : '') + text.slice(start + from, start + from + window).trim() + '…';
    }
    return line;
  }
  return '';
}
