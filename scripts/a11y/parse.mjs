/**
 * scripts/a11y/parse.mjs
 *
 * PURE transform: raw axe-core violations -> a terse, plain-English report.
 * No browser, no axe import — just data in, markdown/json out. Fully unit-testable.
 *
 * Design goals (from the spec):
 *   - group by rule, dedupe repeated elements
 *   - one actionable fix hint per rule
 *   - a HARD context cap (both rule sections AND element bullets) so a
 *     catastrophically broken page can't dump hundreds of lines into the
 *     agent's context window
 *
 * writeReport()/clearing IS the only IO here (fs, still browser-free): it
 * persists .a11y/a11y-errors.{md,json} when errors exist and removes stale
 * copies when the page is clean.
 */

import { existsSync, rmSync, writeFileSync } from 'node:fs';
import { statePath } from './util.mjs';

/** Default max number of element bullets across the WHOLE report. */
export const DEFAULT_CONTEXT_CAP = 25;

/** Default max number of rule SECTIONS rendered (headers + fix lines). */
export const DEFAULT_RULE_CAP = 10;

/**
 * Plain-English, copy-pasteable fixes keyed by axe rule id. Anything not in
 * here falls back to axe's own `help` text so we never emit an empty hint.
 * NOTE: this is the natural integration point for a shared accessibility rule
 * bank (see follow-up) — replace/augment this map from a single source later.
 */
const FIX_HINTS = {
  'button-name': 'Give the button an accessible name — visible text, or an aria-label / a11yLabel.',
  'image-alt': 'Add a meaningful alt attribute (use alt="" only for purely decorative images).',
  'link-name': 'Give the link discernible text or an aria-label describing its destination.',
  label: 'Associate the control with a <label> (for/id) or an aria-label.',
  'aria-required-attr': 'Add the ARIA attributes this role requires.',
  'document-title': 'Add a non-empty <title> to the document.',
  'html-has-lang': 'Add a lang attribute to the <html> element.',
};

function fixHint(v) {
  return FIX_HINTS[v.id] ?? v.help ?? 'Resolve the accessibility violation.';
}

/** Stable selector string for a node (dedupe key + display). */
function selectorOf(node) {
  const target = Array.isArray(node.target) ? node.target : [node.target];
  return target.map((t) => (Array.isArray(t) ? t.join(' ') : t)).join(' ');
}

/**
 * parseAxeResults(violations, { cap, ruleCap }) -> { ruleCount, markdown, json, clean }
 * PURE. `ruleCount` is the number of failing RULES (not elements/errors).
 */
export function parseAxeResults(
  violations = [],
  { cap = DEFAULT_CONTEXT_CAP, ruleCap = DEFAULT_RULE_CAP } = {},
) {
  const rules = (violations || []).map((v) => {
    const seen = new Set();
    const elements = [];
    for (const n of v.nodes || []) {
      const sel = selectorOf(n);
      if (seen.has(sel)) continue; // dedupe repeated elements within a rule
      seen.add(sel);
      elements.push(sel);
    }
    return { id: v.id, help: v.help, helpUrl: v.helpUrl, fix: fixHint(v), elements };
  });

  const ruleCount = rules.length;
  const clean = ruleCount === 0;

  const json = { ruleCount, generatedAt: new Date().toISOString(), rules };
  const markdown = clean ? '' : renderMarkdown(rules, cap, ruleCap);

  return { ruleCount, markdown, json, clean };
}

/**
 * Render the capped markdown report. Two independent caps:
 *   - ruleCap: max number of rule sections rendered
 *   - cap:     max number of element bullets across those sections
 */
function renderMarkdown(rules, cap, ruleCap) {
  const lines = [`# Accessibility issues (${rules.length})`, ''];
  let budget = cap;

  const shown = rules.slice(0, ruleCap);
  const omittedRules = rules.length - shown.length;

  for (const rule of shown) {
    lines.push(`## ${rule.id} — ${rule.help}`);
    lines.push(`Fix: ${rule.fix}`);
    let omittedEls = 0;
    for (const sel of rule.elements) {
      if (budget > 0) {
        lines.push(`- \`${sel}\``);
        budget -= 1;
      } else {
        omittedEls += 1;
      }
    }
    if (omittedEls > 0) lines.push(`  (…and ${omittedEls} more element(s).)`);
    lines.push('');
  }

  if (omittedRules > 0) {
    lines.push(`…and ${omittedRules} more rule(s) — fix the ones above first, then re-run.`);
  }
  return lines.join('\n').trimEnd() + '\n';
}

/**
 * writeReport(parsed, { root }): the only IO. Writes .a11y/a11y-errors.{md,json}
 * when there are errors; clears both when the page is clean.
 */
export function writeReport(parsed, { root } = {}) {
  const mdFile = statePath('a11y-errors.md', root);
  const jsonFile = statePath('a11y-errors.json', root);

  if (parsed.clean) {
    for (const f of [mdFile, jsonFile]) if (existsSync(f)) rmSync(f, { force: true });
    return;
  }
  writeFileSync(mdFile, parsed.markdown);
  writeFileSync(jsonFile, JSON.stringify(parsed.json, null, 2));
}
