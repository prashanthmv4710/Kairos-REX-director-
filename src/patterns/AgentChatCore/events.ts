'use client';

/**
 * OPT-IN PUB/SUB — republishes agent-chat state onto a message bus.
 *
 * The controllers in `AgentChatCore.tsx` are props-first and know nothing about
 * any bus; this module is the only place the two meet. Add one line to a
 * surface and anything else on the page can react to the conversation without
 * prop-drilling or a shared parent:
 *
 * ```tsx
 * const chat = useAgentChat();
 * usePublishAgentChatState({surfaceId: 'main', chat});
 *
 * // elsewhere — typed, no shared ancestor required
 * useAgentChatEvent('ui:agentchat:message-sent', ({text}) => analytics.track(text));
 * ```
 *
 * ## Bring your own bus
 *
 * The bus is injected, not assumed. By default it is ld-kit's own event bus
 * (`src/utils/store`), so the scaffold and vibe-coding flows need zero setup.
 * A team integrating `@walmart/ld-kit` into an existing app passes a
 * {@link AgentChatTransport} instead and ld-kit's store never enters their
 * dependency graph:
 *
 * ```tsx
 * const transport = {
 *   emit: (topic, payload) => dispatch({type: topic, payload}),
 *   on:   (topic, handler) => subscribe(topic, handler),
 * };
 * usePublishAgentChatState({surfaceId: 'main', chat, transport});
 * ```
 *
 * Topic names follow the kit's `ui:<source>:<event>` convention (see
 * `src/context/component-communication.mdc`). Payloads always carry
 * `surfaceId`, so two chats on one page stay distinguishable.
 *
 * Nothing here runs during render — every publish happens inside an effect,
 * which also keeps the bus off the SSR path.
 */

import * as React from 'react';

import {emit as ldKitEmit, on as ldKitOn, setStoreValue} from '../../utils/store';
import type {AgentChatController, FrameworkWorkspaceController} from './AgentChatCore';
import {
  AGENT_CHAT_TOPICS,
  type AgentChatEventMap,
  type AgentChatTopic,
  type AgentChatTransport,
  type ObservableFrameworks,
  agentChatStoreKey,
} from './topics';

// Re-exported so `@walmart/ld-kit` consumers get the whole surface from one
// import; the framework-free half is also its own entry (`/agent-chat`).
export * from './topics';

/**
 * The default bus: ld-kit's own `emit` / `on` plus its key-value store.
 *
 * `emit` is guarded for SSR — ld-kit's `emit` calls `window.dispatchEvent`
 * unconditionally, and publishing should never be the reason a server render
 * throws. On the server the publish is simply dropped; the next client-side
 * effect republishes from live state.
 */
export const ldKitTransport: AgentChatTransport = {
  emit: (topic, payload) => {
    if (typeof window === 'undefined') return;
    ldKitEmit(topic, payload);
  },
  on: (topic, handler) => ldKitOn(topic, handler as (p: unknown) => void),
  setValue: (key, value) => setStoreValue(key, value),
};

/* ------------------------------------------------------------------ */
/*  Subscribe                                                          */
/* ------------------------------------------------------------------ */

/**
 * Typed subscription to an agent-chat topic. The handler's payload is inferred from
 * {@link AgentChatEventMap}, and the latest handler is always used without
 * resubscribing on every render.
 */
export function useAgentChatEvent<K extends AgentChatTopic>(
  topic: K,
  handler: (payload: AgentChatEventMap[K]) => void,
  transport: AgentChatTransport = ldKitTransport,
): void {
  const ref = React.useRef(handler);
  ref.current = handler;
  React.useEffect(
    () => transport.on(topic, (payload) => ref.current(payload)),
    [topic, transport],
  );
}

/* ------------------------------------------------------------------ */
/*  Publish                                                            */
/* ------------------------------------------------------------------ */

export interface PublishAgentChatStateOptions {
  /** Distinguishes surfaces when more than one chat is mounted. */
  surfaceId: string;
  /** The conversation controller to observe. */
  chat?: AgentChatController;
  /**
   * The framework controller to observe. Typed as the read-only slice the publisher
   * actually uses rather than `FrameworkWorkspaceController<T>`, whose action
   * signatures are invariant in `T` — a `FrameworkWorkspaceController<MyFramework>`
   * would otherwise fail to assign here. Any controller satisfies this shape.
   */
  frameworks?: ObservableFrameworks;
  /** Where to publish. @default ldKitTransport */
  transport?: AgentChatTransport;
}

/**
 * Observes the given controllers and publishes on every meaningful change.
 * Safe to call with either controller alone. Nothing is published for state
 * that was already present at mount — only genuine transitions.
 */
export function usePublishAgentChatState({
  surfaceId,
  chat,
  frameworks,
  transport = ldKitTransport,
}: PublishAgentChatStateOptions): void {
  // ── Conversation ────────────────────────────────────────────────────────
  const seenMessages = React.useRef<number | null>(null);
  React.useEffect(() => {
    if (!chat) return;
    const prev = seenMessages.current;
    seenMessages.current = chat.messages.length;
    // Mirror on the first run (to seed) and thereafter only on a real change —
    // `setValue` publishes unconditionally, so re-running this effect without a
    // changed count would put a phantom "change" on the bus.
    if (prev === null || prev !== chat.messages.length) {
      transport.setValue?.(agentChatStoreKey(surfaceId, 'messageCount'), chat.messages.length);
    }
    // First run establishes the baseline; seeded turns are not "new".
    if (prev === null || chat.messages.length <= prev) return;
    for (const m of chat.messages.slice(prev)) {
      if (m.role === 'user') {
        transport.emit(AGENT_CHAT_TOPICS.messageSent, {
          surfaceId,
          id: m.id,
          text: m.text,
          ...(m.files ? {files: m.files} : {}),
        });
      } else {
        transport.emit(AGENT_CHAT_TOPICS.responseReceived, {surfaceId, id: m.id, text: m.text});
      }
    }
  }, [surfaceId, transport, chat, chat?.messages]);

  const seenBusy = React.useRef<boolean | null>(null);
  React.useEffect(() => {
    if (!chat) return;
    if (seenBusy.current === chat.busy) return;
    seenBusy.current = chat.busy;
    transport.setValue?.(agentChatStoreKey(surfaceId, 'busy'), chat.busy);
    transport.emit(AGENT_CHAT_TOPICS.busyChange, {surfaceId, busy: chat.busy});
  }, [surfaceId, transport, chat, chat?.busy]);

  // ── Frameworks ────────────────────────────────────────────────────────────
  const seenFrameworkIds = React.useRef<Set<string> | null>(null);
  React.useEffect(() => {
    if (!frameworks) return;
    const ids = new Set(frameworks.items.map((c) => c.id));
    const prev = seenFrameworkIds.current;
    seenFrameworkIds.current = ids;
    // Seed once, then mirror only genuine count changes — a drag-reorder swaps
    // the array identity (re-running this effect) without changing the count.
    if (prev === null || prev.size !== ids.size) {
      transport.setValue?.(agentChatStoreKey(surfaceId, 'frameworkCount'), ids.size);
    }
    if (prev === null) return;
    for (const id of ids) {
      if (!prev.has(id)) transport.emit(AGENT_CHAT_TOPICS.frameworkOpen, {surfaceId, id});
    }
    for (const id of prev) {
      if (!ids.has(id)) transport.emit(AGENT_CHAT_TOPICS.frameworkClose, {surfaceId, id});
    }
  }, [surfaceId, transport, frameworks, frameworks?.items]);

  const seenActive = React.useRef<string | null | undefined>(undefined);
  React.useEffect(() => {
    if (!frameworks) return;
    if (seenActive.current === frameworks.activeId) return;
    const first = seenActive.current === undefined;
    seenActive.current = frameworks.activeId;
    if (first || frameworks.activeId === null) return;
    transport.emit(AGENT_CHAT_TOPICS.frameworkFocus, {surfaceId, id: frameworks.activeId});
  }, [surfaceId, transport, frameworks, frameworks?.activeId]);
}
