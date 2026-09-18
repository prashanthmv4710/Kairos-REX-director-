/**
 * violation-key — canonical identity string for a violation.
 *
 * `rule` (an axe-core rule id) and `selector` are both arbitrary, unbounded
 * strings, so naively concatenating them (`${rule}${selector}`) can collide
 * across distinct violations — e.g. rule "ab" + selector "cd" produces the
 * same string as rule "a" + selector "bcd". `JSON.stringify` on the tuple
 * quotes and escapes each field, so two different tuples can never produce
 * the same key. Used everywhere a violation identity is needed so
 * session-log dedup and pending-fix tracking stay correct.
 */

import type {Violation} from '../violation-messages';

/** Identity for a violation on the current page (rule + selector). */
export function violationKey(v: Pick<Violation, 'rule' | 'selector'>): string {
  return JSON.stringify([v.rule, v.selector]);
}

/** Identity for a violation scoped to a specific page (adds the URL). */
export function violationKeyForUrl(v: Pick<Violation, 'rule' | 'selector'>, url: string): string {
  return JSON.stringify([v.rule, v.selector, url]);
}

/**
 * Locally-unique keys for a list of violations being rendered together (one
 * key per input item, same order).
 *
 * `violationKey` (rule + selector) usually is unique, but axe-core can
 * legitimately report two distinct DOM nodes under the same rule with
 * identical selector text — e.g. structurally identical sibling landmarks
 * both failing "landmark-unique". Two list rows sharing the same key would
 * then share expand/select/copy UI state, so clicking one visibly
 * selects/borders both. Any duplicate within this list gets an occurrence
 * suffix so every row's key is unique for as long as it's on screen
 * together, without changing the key format for the (common) non-colliding
 * case.
 */
export function violationRowKeys(violations: readonly Pick<Violation, 'rule' | 'selector'>[]): string[] {
  const seen = new Map<string, number>();
  return violations.map((v) => {
    const base = violationKey(v);
    const occurrence = seen.get(base) ?? 0;
    seen.set(base, occurrence + 1);
    return occurrence === 0 ? base : `${base}#${occurrence}`;
  });
}
