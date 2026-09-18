/**
 * MODEL — the agent-chat conversation state machine.
 *
 * Pure TypeScript: no React, no DOM, no store. Every transition is a total
 * function of `(state, event)`, so it can be unit-tested, replayed from a log,
 * or run on a server without a renderer. The React binding lives in
 * `AgentChatCore.tsx` (`useAgentChat`) and the optional pub/sub wiring in
 * `events.ts` — neither is required to use what's here.
 */

/** A single turn in the conversation. */
export interface ChatMessage {
  /** Stable identity for list keys and for addressing a turn in an event. */
  id: string;
  /** Who produced the turn. */
  role: 'user' | 'agent';
  /** The message body. */
  text: string;
  /** Names of files attached at send time, snapshotted onto the turn so the
   *  timeline keeps showing them after the composer's attachment row clears. */
  files?: string[];
  /** Delivery state for a user turn. Agent turns are always `sent`. */
  status: 'sending' | 'sent' | 'failed';
}

export interface ChatState {
  messages: ChatMessage[];
  /** True between a `send` and the matching `respond` / `fail` — drives the
   *  composer's stop button and the "Thinking…" affordance. */
  busy: boolean;
  /** Monotonic counter backing generated message ids. Kept in state (rather
   *  than a module-level `let`) so the reducer stays pure and two independent
   *  surfaces never share a sequence. */
  seq: number;
}

export const initialChatState: ChatState = {messages: [], busy: false, seq: 0};

export type ChatEvent =
  /** The person submitted the composer. */
  | {type: 'send'; text: string; files?: string[]}
  /** The agent's reply arrived. Omit `text` to just clear the busy flag. */
  | {type: 'respond'; text?: string}
  /** The in-flight user turn could not be delivered. */
  | {type: 'fail'}
  /** Re-send the most recent failed user turn. */
  | {type: 'retry'}
  /** Clear the conversation. */
  | {type: 'reset'};

/** Build the initial state for a surface that mounts with existing turns
 *  (e.g. a demo that opens mid-conversation). Assigns ids and seeds `seq`. */
export function seedChatState(
  turns: ReadonlyArray<Pick<ChatMessage, 'role' | 'text'> & {files?: string[]}>,
): ChatState {
  return {
    messages: turns.map((t, i) => ({...t, id: `m${i + 1}`, status: 'sent' as const})),
    busy: false,
    seq: turns.length,
  };
}

/**
 * The one place a conversation changes shape. Always returns a new object when
 * something changed, and the *same* object when nothing did, so React bails out
 * of re-rendering on a no-op event.
 */
export function chatReducer(state: ChatState, event: ChatEvent): ChatState {
  switch (event.type) {
    case 'send': {
      const text = event.text.trim();
      // Empty submits are a no-op rather than an empty bubble.
      if (!text) return state;
      const seq = state.seq + 1;
      return {
        messages: [
          ...state.messages,
          {
            id: `m${seq}`,
            role: 'user',
            text,
            ...(event.files?.length ? {files: [...event.files]} : {}),
            status: 'sent',
          },
        ],
        busy: true,
        seq,
      };
    }

    case 'respond': {
      if (!state.busy && event.text === undefined) return state;
      if (event.text === undefined) return {...state, busy: false};
      const seq = state.seq + 1;
      return {
        messages: [...state.messages, {id: `m${seq}`, role: 'agent', text: event.text, status: 'sent'}],
        busy: false,
        seq,
      };
    }

    case 'fail': {
      // Mark the newest user turn as undelivered; leave agent turns alone.
      const i = findLastIndex(state.messages, (m) => m.role === 'user');
      if (i < 0) return state;
      const messages = [...state.messages];
      messages[i] = {...messages[i], status: 'failed'};
      return {...state, messages, busy: false};
    }

    case 'retry': {
      const i = findLastIndex(state.messages, (m) => m.role === 'user' && m.status === 'failed');
      if (i < 0) return state;
      const messages = [...state.messages];
      messages[i] = {...messages[i], status: 'sending'};
      return {...state, messages, busy: true};
    }

    case 'reset':
      return initialChatState;

    default:
      return state;
  }
}

/** `Array.prototype.findLastIndex` is ES2023; the kit targets ES2020. */
function findLastIndex<T>(arr: readonly T[], pred: (v: T) => boolean): number {
  for (let i = arr.length - 1; i >= 0; i--) if (pred(arr[i])) return i;
  return -1;
}
