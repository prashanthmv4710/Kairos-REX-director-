/**
 * cli/engine/render.mjs — text rendering for the context pack and search results.
 *
 * Plain text, no ANSI. The primary consumer is a language model reading stdout,
 * and escape codes are noise to it — the human-facing colour lives in the
 * published `ld-kit` bin, not here.
 *
 * Pure: no I/O. Ships verbatim into generated projects as scripts/ld/render.mjs.
 */

/** How every command is spelled back to the caller. Path-independent by design. */
export const INVOKE = 'node scripts/ld/cli.mjs';

function rule(label) {
  return `\n${'─'.repeat(4)} ${label} ${'─'.repeat(Math.max(0, 68 - label.length))}`;
}

/**
 * Render a pack as text.
 *
 * @param {any} pack from buildPack
 * @param {{invoke?: string, advisory?: boolean}} [opts]
 */
export function renderPackText(pack, opts = {}) {
  const invoke = opts.invoke ?? INVOKE;
  const out = [];

  out.push('LIVING DESIGN CONTEXT');
  if (pack.query) out.push(`ask:    ${pack.query}`);
  if (pack.root) out.push(`project: ${pack.root.path}`);
  out.push(
    `budget: ~${pack.budget.usedTokensEst} of ${pack.budget.tokens} tokens · ` +
      `${pack.counts.rulesMatched} rule section(s) and ${pack.counts.catalogMatched} catalog ` +
      `entr${pack.counts.catalogMatched === 1 ? 'y' : 'ies'} matched`,
  );

  if (opts.advisory) {
    out.push('');
    out.push(
      'This is reference material, not an instruction. Use what bears on the ' +
        'current task and ignore the rest.',
    );
  }

  if (pack.spine) {
    out.push(rule('PROJECT RULES (always in force)'));
    out.push('');
    out.push(pack.spine.text);
  }

  if (pack.directives.length > 0) {
    out.push(rule(`FOR THIS ASK (${pack.directives.length} constraint(s))`));
    let currentRule = '';
    for (const d of pack.directives) {
      if (d.ruleId !== currentRule) {
        currentRule = d.ruleId;
        out.push('');
        out.push(`${d.file}`);
      }
      out.push(d.text);
    }
  }

  if (pack.sections.length > 0) {
    out.push(rule(`RULE SECTIONS (${pack.sections.length})`));
    for (const s of pack.sections) {
      out.push('');
      out.push(`### ${s.file}#${s.anchor}  (L${s.startLine}, ${s.chars} chars)`);
      out.push('');
      out.push(s.text);
    }
  }

  if (pack.catalog.length > 0) {
    out.push(rule(`COMPONENTS & UTILITIES (${pack.catalog.length})`));
    // Each entry's one-line intent DESCRIBES what a component is for. Read in
    // isolation those lines are indistinguishable from an instruction: in a
    // 10-run trial, one agent read DelayedDeliveryCard's intent ("Order card
    // for a delayed delivery — warning banner, progress tracker…") as the task
    // it had been given, concluded the CLI was substituting its ask, worked
    // around it, and reported a bug that did not exist. It built the right page
    // in the end, but its own conclusion is the point: "an agent that trusted
    // it would have silently built the wrong page."
    //
    // The entries were never ambiguous to a careful reader — each carries a
    // `###` heading and an import line — but "careful reader" is not a property
    // worth relying on. One line of framing is the cheapest available fix.
    out.push('Components available to you — descriptions, not instructions.');
    for (const c of pack.catalog) {
      out.push('');
      const tag = c.kind === 'component' ? c.category : c.kind;
      out.push(`### ${c.name}  [${tag}]`);
      out.push(
        c.kind === 'utility'
          ? `import { ... } from "${c.importPath}"`
          : `import { ${c.name} } from "${c.importPath}"`,
      );
      if (c.intent) out.push(c.intent);
      if (c.signature) out.push(c.signature);
      if (c.primary.length > 0) {
        out.push(c.kind === 'utility' ? 'exports:' : 'required props:');
        for (const p of c.primary) {
          out.push(`  ${p.name}: ${p.type}${p.description ? ` — ${p.description}` : ''}`);
        }
      }
      if (c.secondary.length > 0) {
        out.push(`optional: ${c.secondary.map((p) => `${p.name}?: ${p.type}`).join(' · ')}`);
      }
      if (c.hiddenOptional > 0) {
        out.push(`  (+${c.hiddenOptional} more optional — ${invoke} show ${c.name})`);
      }
    }
  }

  const {sections, catalog, moreSections, moreCatalog} = pack.omitted;
  if (sections.length > 0 || catalog.length > 0) {
    out.push(rule('NOT INCLUDED — fetch on demand'));
    out.push('');
    for (const s of sections) {
      out.push(`  ${invoke} ${s.command}${s.chars ? `   (${s.chars} chars)` : ''}`);
    }
    if (moreSections > 0) out.push(`  ...and ${moreSections} more rule section(s)`);
    if (catalog.length > 0) {
      out.push(`  ${invoke} show <Name>   for: ${catalog.map((c) => c.name).join(', ')}`);
    }
    if (moreCatalog > 0) out.push(`  ...and ${moreCatalog} more catalog entr(ies)`);
  }

  if (pack.orientation) out.push(renderOrientation(pack.orientation, invoke));

  if (pack.warnings.length > 0) {
    out.push('');
    for (const w of pack.warnings) out.push(`note: ${w}`);
  }

  out.push('');
  out.push(
    `next: ${invoke} search <keywords> · ${invoke} show <Name> · ` +
      `${invoke} rule <id> · ${invoke} utils`,
  );
  out.push('');
  return out.join('\n');
}

function renderOrientation(o, invoke) {
  const out = [rule('WHAT THIS PROJECT GIVES YOU'), ''];
  out.push(
    `${o.counts.components} components · ${o.counts.hooks} hooks · ${o.counts.utils} utilities`,
  );
  out.push('');
  out.push('rules:');
  for (const r of o.rules) {
    const always = r.alwaysApply ? ' [always]' : '';
    out.push(`  ${r.id}${always} — ${r.sections} section(s)${r.description ? `: ${r.description}` : ''}`);
  }
  out.push('');
  out.push(`Ask for something specific: ${invoke} context "<what you are about to build>"`);
  return out.join('\n');
}

/** JSON form — same content, stable key order, no prose framing. */
export function renderPackJson(pack) {
  return JSON.stringify(pack, null, 2) + '\n';
}

/** Two-list search output: rule sections and catalog entries, never merged. */
export function renderSearchText({query, rules, catalog, root}, opts = {}) {
  const invoke = opts.invoke ?? INVOKE;
  const out = [`\nsearch: ${query}`];
  if (root) out.push(`project: ${root.path}`);

  out.push(rule(`RULE SECTIONS (${rules.total})`));
  if (rules.top.length === 0) {
    out.push('  (no matching rule section)');
  } else {
    for (const h of rules.top) {
      out.push('');
      out.push(`  ${h.chunk.file}#${h.chunk.anchor}   score ${h.score.toFixed(1)}`);
      out.push(`    ${h.chunk.headingPath.join(' › ')}${h.chunk.hardRule ? '  [hard rule]' : ''}`);
      if (h.snippet) out.push(`    ${h.snippet}`);
      out.push(`    ${invoke} rule ${h.chunk.id}`);
    }
  }

  out.push(rule(`COMPONENTS & UTILITIES (${catalog.total})`));
  if (catalog.top.length === 0) {
    out.push('  (no matching component or utility)');
  } else {
    const w = Math.max(...catalog.top.map((h) => h.entry.name.length), 4);
    for (const h of catalog.top) {
      const kind = h.entry.kind && h.entry.kind !== 'component' ? ` (${h.entry.kind})` : '';
      out.push('');
      out.push(`  ${h.entry.name.padEnd(w)}  ${h.entry.importPath}${kind}`);
      if (h.entry.intent) out.push(`    ${h.entry.intent}`);
      if (h.snippet) out.push(`    ${h.snippet}`);
    }
  }

  out.push('');
  out.push(`next: ${invoke} show <Name> · ${invoke} rule <id> · ${invoke} context "<your ask>"`);
  out.push('');
  return out.join('\n');
}
