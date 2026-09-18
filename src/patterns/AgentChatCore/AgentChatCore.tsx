'use client';
// @refresh reset

/**
 * @module AgentChatCore
 *
 * # CRITICAL AGENT DIRECTIVE - HARD STOP
 * 
 * This file is read-only output. Treat it as immutable.
 * 
 * - NEVER edit this file directly.
 * - NEVER apply "quick fixes" in this file.
 * - NEVER reformat, refactor, or rewrite content in place.
 * - NEVER treat this file as the source of truth.
 * 
 * If behavior must change, modify the upstream source of this content (the canonical source), not this copy.
 * 
 * Any direct edits in this file are invalid and must be rejected.
 *
 * For prop API + usage notes, read `AgentChatCore.md` in this folder
 * or run `npm run ld-kit -- show AgentChatCore`.
 */

/**
 * CONTROLLER — React bindings for the agent-chat models.
 *
 * Each hook owns one model (see `chatModel.ts` / `frameworkModel.ts`) and returns
 * `{ ...state, ...actions }`. They are the seam between the pure models and any
 * view: `AgentFrameworkWorkspace`, the Living Design chat components, or a
 * consumer's own markup.
 *
 * Props-first by design — nothing here reads or writes the ld-kit store. Opt
 * into cross-component messaging separately with `usePublishAgentChatState`
 * from `./events`, which observes these hooks' state and publishes it.
 */

import * as React from 'react';

import {
  type ChatMessage,
  type ChatState,
  chatReducer,
  initialChatState,
  seedChatState,
} from './chatModel';
import {
  type FrameworkLike,
  type FrameworkState,
  frameworkReducer,
  initialFrameworkState,
} from './frameworkModel';

/* ------------------------------------------------------------------ */
/*  Conversation                                                       */
/* ------------------------------------------------------------------ */

export interface UseAgentChatOptions {
  /** Turns the conversation opens with. Read once, on mount. */
  initialMessages?: ReadonlyArray<Pick<ChatMessage, 'role' | 'text'> & {files?: string[]}>;
  /**
   * Auto-clear `busy` this many ms after a send, simulating a reply landing.
   * Demo/prototype affordance — omit it in production and call `respond()`
   * yourself when the real response arrives.
   */
  simulateResponseMs?: number;
}

export interface AgentChatController extends ChatState {
  /** The uncommitted composer text. */
  draft: string;
  setDraft: (value: string) => void;
  /** Commit `text` (defaults to the current draft) as a user turn and clear the
   *  draft. No-ops on empty input. */
  send: (text?: string, files?: string[]) => void;
  /** Land the agent's reply. Pass `text` to append an agent turn, or call bare
   *  to just drop the busy flag (when the view renders the reply itself). */
  respond: (text?: string) => void;
  /** Mark the newest user turn undelivered. */
  fail: () => void;
  /** Re-send the newest failed turn. */
  retry: () => void;
  reset: () => void;
}

/**
 * Owns one conversation. Replaces the hand-rolled
 * `useState<ChatMessage[]>` + `busy` + `draft` trio each chat surface used to
 * carry, so send / respond / retry behave identically everywhere.
 */
export function useAgentChat(options: UseAgentChatOptions = {}): AgentChatController {
  const {initialMessages, simulateResponseMs} = options;
  const [state, dispatch] = React.useReducer(
    chatReducer,
    initialMessages,
    (seed) => (seed?.length ? seedChatState(seed) : initialChatState),
  );
  const [draft, setDraft] = React.useState('');

  // Keep the latest simulate duration in a ref so changing it never restarts a
  // timer that is already counting down for an in-flight send.
  const simulateRef = React.useRef(simulateResponseMs);
  simulateRef.current = simulateResponseMs;
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  React.useEffect(
    () => () => {
      if (timerRef.current !== undefined) clearTimeout(timerRef.current);
    },
    [],
  );

  const respond = React.useCallback((text?: string) => {
    if (timerRef.current !== undefined) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
    dispatch({type: 'respond', text});
  }, []);

  const armSimulatedResponse = React.useCallback(() => {
    const ms = simulateRef.current;
    if (ms === undefined) return;
    if (timerRef.current !== undefined) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = undefined;
      dispatch({type: 'respond'});
    }, ms);
  }, []);

  const send = React.useCallback(
    (text?: string, files?: string[]) => {
      const body = (text ?? draft).trim();
      if (!body) return;
      dispatch({type: 'send', text: body, files});
      setDraft('');
      armSimulatedResponse();
    },
    [draft, armSimulatedResponse],
  );

  const fail = React.useCallback(() => dispatch({type: 'fail'}), []);
  const retry = React.useCallback(() => {
    dispatch({type: 'retry'});
    armSimulatedResponse();
  }, [armSimulatedResponse]);
  const reset = React.useCallback(() => {
    if (timerRef.current !== undefined) clearTimeout(timerRef.current);
    dispatch({type: 'reset'});
    setDraft('');
  }, []);

  return {...state, draft, setDraft, send, respond, fail, retry, reset};
}

/* ------------------------------------------------------------------ */
/*  Framework list                                                        */
/* ------------------------------------------------------------------ */

export interface UseFrameworkWorkspaceOptions<T extends FrameworkLike> {
  /** Frameworks the surface opens with. Read once, on mount. */
  initialItems?: T[];
  /** Build the next framework. `seq` is a monotonic counter, 1-based. */
  create: (seq: number) => T;
  /** Hard cap on simultaneously open frameworks. @default 4 */
  max?: number;
  /** Fired when the last framework closes — a docked surface uses this to hand
   *  its width back to the chat pane. */
  onEmpty?: () => void;
}

export interface FrameworkWorkspaceController<T extends FrameworkLike> extends FrameworkState<T> {
  /** Open another framework. No-ops at `max`. */
  open: () => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  /** Replace the list — wire straight to `AgentFrameworkWorkspace`'s `onReorder`. */
  reorder: (items: T[]) => void;
  clear: () => void;
  /** True when `max` frameworks are open (disable the add control). */
  isFull: boolean;
}

/**
 * Owns the list of open frameworks. Its `items` / `activeId` / `reorder` / `focus`
 * outputs line up 1:1 with `AgentFrameworkWorkspace`'s props:
 *
 * ```tsx
 * const ws = useFrameworkWorkspace({create: (n) => ({id: `c${n}`, title: `Framework ${n}`, body: <Body />})});
 * <AgentFrameworkWorkspace
 *   items={ws.items}
 *   activeId={ws.activeId}
 *   onReorder={ws.reorder}
 *   onActiveChange={ws.focus}
 *   onClose={ws.close}
 *   onAdd={ws.open}
 * />
 * ```
 */
export function useFrameworkWorkspace<T extends FrameworkLike>(
  options: UseFrameworkWorkspaceOptions<T>,
): FrameworkWorkspaceController<T> {
  const {initialItems, create, max = 4, onEmpty} = options;
  const [state, dispatch] = React.useReducer(
    frameworkReducer as React.Reducer<FrameworkState<T>, Parameters<typeof frameworkReducer<T>>[1]>,
    initialItems,
    (seed) => initialFrameworkState<T>(seed ?? []),
  );

  // Read `create` / `onEmpty` through refs so callers can pass inline closures
  // without the action identities changing on every render.
  const createRef = React.useRef(create);
  createRef.current = create;
  const onEmptyRef = React.useRef(onEmpty);
  onEmptyRef.current = onEmpty;

  const open = React.useCallback(
    () => dispatch({type: 'open', create: (seq) => createRef.current(seq), max}),
    [max],
  );
  const close = React.useCallback((id: string) => dispatch({type: 'close', id}), []);
  const focus = React.useCallback((id: string) => dispatch({type: 'focus', id}), []);
  const reorder = React.useCallback((items: T[]) => dispatch({type: 'reorder', items}), []);
  const clear = React.useCallback(() => dispatch({type: 'clear'}), []);

  // Fire `onEmpty` only on the transition into empty, never on the initial
  // mount of an already-empty workspace.
  const wasPopulated = React.useRef(state.items.length > 0);
  React.useEffect(() => {
    const populated = state.items.length > 0;
    if (wasPopulated.current && !populated) onEmptyRef.current?.();
    wasPopulated.current = populated;
  }, [state.items.length]);

  return {...state, open, close, focus, reorder, clear, isFull: state.items.length >= max};
}

/* ------------------------------------------------------------------ */
/*  Composer attachments                                               */
/* ------------------------------------------------------------------ */

export interface ChatAttachmentsController {
  /** Names of the files currently staged on the composer. */
  files: string[];
  /** Append dropped / picked files. Wire to `PromptComposer`'s `onAttachFiles`
   *  and to a `ChatDropOverlay`'s drop handler — both feed the same list. */
  append: (dropped: File[]) => void;
  remove: (index: number) => void;
  /** Clear the row once its files have been snapshotted onto a sent turn, so
   *  the next turn doesn't re-send them. */
  reset: () => void;
}

/**
 * Staged composer attachments. Deliberately returns plain names, not rendered
 * tiles — the view decides how to present them (the kit's `AttachmentTile` is
 * the usual choice).
 */
export function useChatAttachments(): ChatAttachmentsController {
  const [files, setFiles] = React.useState<string[]>([]);
  const append = React.useCallback((dropped: File[]) => {
    if (dropped.length === 0) return;
    setFiles((f) => [...f, ...dropped.map((d) => d.name)]);
  }, []);
  const remove = React.useCallback(
    (i: number) => setFiles((f) => f.filter((_, idx) => idx !== i)),
    [],
  );
  const reset = React.useCallback(() => setFiles([]), []);
  return {files, append, remove, reset};
}
