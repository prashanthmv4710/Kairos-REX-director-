/**
 * scripts/a11y/decide.mjs
 *
 * PURE decision core for the end-hook loop. No fs, no browser, no globals —
 * data in, verdict out. This is the file that makes the loop safe: the whole
 * "never wedge the agent / never loop forever" contract lives in one place
 * and is exhaustively unit-tested.
 *
 * State machine (the spec):
 *   errs=0            -> done     [reset attempts]        (silent success)
 *   errs>0 & tries<1  -> block    [tries=1]               (hand over the report)
 *   errs>0 & tries>=1 -> handoff  [reset attempts]        (surface the a11y UI)
 *
 * stop_hook_active re-entry is NOT a special row: because decide() always
 * emits a real verdict from the freshly-scanned ruleCount, re-entry simply
 * re-evaluates — it can never "bail". A still-dirty re-scan after a block
 * (attempts>=1) lands on handoff; a clean one lands on done.
 */

/** The 1-attempt ceiling. One automated fix, then hand off. Never endless. */
export const MAX_ATTEMPTS = 1;

const BLOCK_REASON =
  'Accessibility issues were found in changed components. See .a11y/a11y-errors.md ' +
  'for a terse fix list, apply the fixes, then finish your turn to re-verify.';

/**
 * decide({ ruleCount, attempts, agent, stopHookActive }) ->
 *   { action, attempts, block, reason, output }
 *
 * - action:   'done' | 'block' | 'handoff'
 * - attempts: the value the orchestrator should PERSIST for next run
 * - output:   the agent-native hook payload (via emitDecision)
 */
export function decide({ ruleCount = 0, attempts = 0, agent = 'wibey' } = {}) {
  if (ruleCount === 0) {
    return verdict('done', 0, agent, { block: false });
  }
  if (attempts < MAX_ATTEMPTS) {
    return verdict('block', MAX_ATTEMPTS, agent, { block: true, reason: BLOCK_REASON });
  }
  // errors persist after our one automated attempt: reset + hand to the user.
  return verdict('handoff', 0, agent, { block: false });
}

function verdict(action, attempts, agent, { block, reason }) {
  return { action, attempts, block, reason: reason ?? null, output: emitDecision(agent, { block, reason }) };
}

/**
 * emitDecision(agent, { block, reason }) -> the agent-native hook JSON.
 * ONE place that knows each agent's schema — no scattered `if (cursor)`.
 *   - Claude / Wibey: { decision: 'block', reason }        (blocking)
 *                     {}                                    (allow stop)
 *   - Cursor:         { followup_message: reason }          (blocking / re-engage)
 *                     {}                                    (allow stop)
 *
 * Cursor's `stop` hook re-engages the agent ONLY via a `followup_message`
 * string (schema `agent.v1.StopRequestResponse` in the Cursor bundle: the sole
 * field is `followup_message`). A `{continue:false, reason}` payload validates
 * as "an object" but is silently ignored — the agent stops anyway. Verified
 * against Cursor 3.12.30 (hook log + bundle reverse-engineering).
 */
export function emitDecision(agent, { block = false, reason } = {}) {
  const isCursor = String(agent).toLowerCase() === 'cursor';

  if (isCursor) {
    return block ? { followup_message: reason ?? BLOCK_REASON } : {};
  }
  // Claude + Wibey share one schema; treat it as the default.
  return block ? { decision: 'block', reason: reason ?? BLOCK_REASON } : {};
}
