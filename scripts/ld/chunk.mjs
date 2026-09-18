/**
 * cli/engine/chunk.mjs — split a rule file into retrievable sections.
 *
 * Pure: no I/O. Given a rule's text, returns chunks at H2/H3 granularity — the
 * unit the context pack emits and the ranker scores.
 *
 * Why H2+H3 and not H2 alone: measured over src/context/*.mdc, an H2-only split
 * produces a 15,128-char monster (a11y "Hard Rules") that no budget can use.
 * H2+H3 yields 158 chunks, p50 501 chars, p99 2,326, max 3,321 — a granularity
 * that falls out of the authoring style already in use, so no size-based
 * splitting is needed for 157 of 158.
 *
 * Ships verbatim into generated projects as scripts/ld/chunk.mjs.
 */

/**
 * Above this, a leaf chunk is split further — but never inside a fence.
 *
 * Set above the corpus maximum (largest authored section ~3.3k) on purpose, so
 * splitting NEVER fires for content anyone actually wrote. Fragmenting a
 * coherent section is a real cost: the continuation is orphaned prose that
 * reads as a non-sequitur on its own, and the pack's whole-chunk contract means
 * an oversized section is simply dropped with a fetch command rather than cut.
 * This stays as a safety valve for a future outlier, not a routine path.
 */
const DEFAULT_MAX_CHARS = 4000;

/**
 * An H2 that has H3 children also emits a "lead" chunk for the text between
 * the H2 and its first H3 — but only when that lead has real content. Below
 * this threshold you get a chunk that is nothing but a heading, which is pure
 * index noise.
 */
const MIN_LEAD_CHARS = 80;

/** Directive lines — the MUST/NEVER spine of a rule, extracted verbatim. */
const DIRECTIVE_RE = /^\s*[-*]\s+.*?\b(MUST|NEVER|ALWAYS|REQUIRED)\b/;

/** Headings whose content is directive regardless of line shape. */
const HARD_RULE_HEADING_RE = /\b(hard (rules?|constraints?|stops?)|non-negotiable|never|must)\b/i;

/**
 * MUST/NEVER lines as whole LOGICAL list items.
 *
 * Markdown bullets in these rule files are hard-wrapped, so matching a single
 * physical line captured "- **MUST** source every product from `ProductService`
 * — products, categories," and dropped the rest of the sentence. A truncated
 * constraint is worse than no constraint: it reads as complete and instructs
 * incorrectly. So a match absorbs its indented continuation lines, stopping at
 * the next list item, a blank line, or a fence.
 */
function extractDirectives(text) {
  const lines = text.split('\n');
  const inFence = fenceMap(lines);
  const out = [];

  for (let i = 0; i < lines.length; i += 1) {
    if (inFence[i] || !DIRECTIVE_RE.test(lines[i])) continue;
    const parts = [lines[i].trim()];
    for (let j = i + 1; j < lines.length; j += 1) {
      const next = lines[j];
      if (inFence[j] || next.trim() === '') break;
      // A new list item or an unindented line ends the current one.
      if (!/^\s+/.test(next) || /^\s*[-*]\s/.test(next)) break;
      parts.push(next.trim());
      i = j;
    }
    out.push(parts.join(' ').replace(/\s+/g, ' '));
  }
  return out;
}

/** GitHub-style anchor slug. */
export function slugify(heading) {
  return String(heading)
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^\w\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

/** Split leading `---` frontmatter off, if present. */
export function splitFrontmatter(src) {
  const m = String(src).match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  if (!m) return {frontmatter: '', body: String(src), offsetLines: 0};
  return {
    frontmatter: m[0],
    body: String(src).slice(m[0].length),
    offsetLines: m[0].split('\n').length - 1,
  };
}

/** Strip markdown emphasis/backticks from a heading for display + matching. */
function cleanHeading(text) {
  return text.replace(/`/g, '').replace(/\*\*?/g, '').trim();
}

/**
 * Classify every line as inside or outside a fenced code block.
 *
 * Load-bearing: these rule files are dense with ```tsx examples, and a `#`
 * comment or a markdown heading inside a fence must NOT open a new chunk.
 * Tracks the opening fence's length so a nested ``` inside a ~~~~ block (or a
 * longer closing fence) behaves per CommonMark.
 */
function fenceMap(lines) {
  const inFence = new Array(lines.length).fill(false);
  let fence = null;
  for (let i = 0; i < lines.length; i += 1) {
    const m = lines[i].match(/^\s*(`{3,}|~{3,})/);
    if (fence === null) {
      if (m) {
        fence = m[1];
        inFence[i] = true;
      }
    } else {
      inFence[i] = true;
      // A closing fence must be the same char and at least as long.
      if (m && m[1][0] === fence[0] && m[1].length >= fence.length) fence = null;
    }
  }
  return inFence;
}

/** Concatenated fence contents, and the prose with fences removed. */
function partitionCode(text) {
  const lines = text.split('\n');
  const inFence = fenceMap(lines);
  const prose = [];
  const code = [];
  for (let i = 0; i < lines.length; i += 1) {
    (inFence[i] ? code : prose).push(lines[i]);
  }
  return {body: prose.join('\n'), code: code.join('\n')};
}

/** A candidate part's content with its leading heading line removed. */
function bodyWithoutHeading(text) {
  return text.replace(/^#{1,6}\s+.*$/m, '').trim();
}

/**
 * Split a chunk that exceeds maxChars at a blank line outside any fence.
 * Returns [text] unchanged when no safe split point exists — a slightly
 * oversized chunk beats one cut through the middle of a code example.
 */
function splitOversized(text, maxChars) {
  if (text.length <= maxChars) return [text];
  const lines = text.split('\n');
  const inFence = fenceMap(lines);

  const parts = [];
  let start = 0;
  let len = 0;
  let lastSafe = -1;
  for (let i = 0; i < lines.length; i += 1) {
    len += lines[i].length + 1;
    if (!inFence[i] && lines[i].trim() === '') lastSafe = i;
    if (len < maxChars || lastSafe <= start) continue;

    // Only close off a part that actually says something. Without this, a
    // section whose body is one large code fence splits at the blank line
    // right after its heading — orphaning the heading into a content-free
    // chunk and leaving the fence just as oversized as before.
    const candidate = lines.slice(start, lastSafe).join('\n');
    if (bodyWithoutHeading(candidate).length < MIN_LEAD_CHARS) continue;

    parts.push(candidate);
    start = lastSafe + 1;
    len = lines.slice(start, i + 1).join('\n').length;
    lastSafe = -1;
  }
  parts.push(lines.slice(start).join('\n'));
  return parts.filter((p) => p.trim() !== '');
}

/**
 * Chunk one rule file.
 *
 * @param {{ruleId: string, file: string, text: string, maxChars?: number}} opts
 * @returns {any[]} chunks in document order
 */
export function chunkRule({ruleId, file, text, maxChars = DEFAULT_MAX_CHARS}) {
  const {body, offsetLines} = splitFrontmatter(text);
  const lines = body.split('\n');
  const inFence = fenceMap(lines);

  // Collect headings (H2/H3 only, outside fences) with their line numbers.
  const heads = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (inFence[i]) continue;
    const m = lines[i].match(/^(#{2,3})\s+(.+?)\s*$/);
    if (m) heads.push({level: m[1].length, text: cleanHeading(m[2]), line: i});
  }

  if (heads.length === 0) {
    // No sub-headings — the whole file is one chunk (title from the H1).
    const h1 = body.match(/^#\s+(.+)$/m);
    return finalize(
      [
        {
          headingPath: [cleanHeading(h1 ? h1[1] : ruleId)],
          level: 1,
          startLine: offsetLines + 1,
          text: body.trim(),
        },
      ],
      {ruleId, file, maxChars},
    );
  }

  const raw = [];
  let h2 = null;
  for (let hi = 0; hi < heads.length; hi += 1) {
    const head = heads[hi];
    const next = heads[hi + 1];
    const endLine = next ? next.line : lines.length;

    if (head.level === 2) {
      h2 = head.text;
      const isParent = next && next.level === 3;
      if (isParent) {
        // Lead-in text between the H2 and its first H3 — emit only if it says
        // something, otherwise it is a heading-only chunk and pure noise.
        const lead = lines.slice(head.line, endLine).join('\n').trim();
        const leadBody = lines.slice(head.line + 1, endLine).join('\n').trim();
        if (leadBody.length >= MIN_LEAD_CHARS) {
          raw.push({
            headingPath: [head.text],
            level: 2,
            startLine: offsetLines + head.line + 1,
            text: lead,
          });
        }
        continue;
      }
    }

    raw.push({
      headingPath: head.level === 3 && h2 ? [h2, head.text] : [head.text],
      level: head.level,
      startLine: offsetLines + head.line + 1,
      text: lines.slice(head.line, endLine).join('\n').trim(),
    });
  }

  return finalize(raw, {ruleId, file, maxChars});
}

function finalize(raw, {ruleId, file, maxChars}) {
  const seen = new Map();
  const out = [];

  for (const r of raw) {
    const pieces = splitOversized(r.text, maxChars);
    pieces.forEach((piece, idx) => {
      const heading = r.headingPath[r.headingPath.length - 1];
      const base = slugify(heading) || 'section';
      // Two different reasons an anchor can collide, kept distinguishable:
      //   `-2`      a genuinely repeated heading (several rules use
      //             "Hard Constraints" more than once)
      //   `-part2`  a continuation of one oversized section
      // Collapsing them would make `rule <id>` ambiguous about whether the
      // caller is fetching a different section or the rest of the same one.
      let anchor;
      if (pieces.length > 1) {
        anchor = idx === 0 ? base : `${base}-part${idx + 1}`;
        seen.set(base, (seen.get(base) ?? 0) + 1);
      } else {
        const n = (seen.get(base) ?? 0) + 1;
        seen.set(base, n);
        anchor = n === 1 ? base : `${base}-${n}`;
      }

      const {body, code} = partitionCode(piece);
      const directives = extractDirectives(piece);

      out.push({
        ruleId,
        anchor,
        id: `${ruleId}#${anchor}`,
        file,
        headingPath: r.headingPath,
        heading,
        level: r.level,
        startLine: r.startLine,
        text: piece,
        body,
        code,
        directives,
        hardRule: directives.length > 0 || HARD_RULE_HEADING_RE.test(heading),
        chars: piece.length,
        part: pieces.length > 1 ? idx + 1 : undefined,
      });
    });
  }

  return out;
}

/**
 * Chunk many rule files.
 * @param {{id: string, file: string, text: string}[]} files
 */
export function chunkCorpus(files, opts = {}) {
  const chunks = [];
  for (const f of files) {
    chunks.push(...chunkRule({ruleId: f.id, file: f.file, text: f.text, ...opts}));
  }
  return chunks;
}
