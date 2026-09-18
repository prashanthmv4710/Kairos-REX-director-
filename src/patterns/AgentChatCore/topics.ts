/**
 * CONTRACT — topics, payload shapes, and the transport interface.
 *
 * Deliberately free of React, the DOM, and ld-kit's store, so a team on Vue,
 * Angular, Svelte, or plain TS can import the event contract (and the pure
 * reducers next to it) without pulling a renderer in. The React hooks that
 * publish and subscribe live in `events.ts`; the ld-kit-backed transport lives
 * there too, because ld-kit's store imports React.
 *
 * Shipped as its own entry point: `@walmart/ld-kit/agent-chat`.
 */

import type {FrameworkLike} from './frameworkModel';

/* ------------------------------------------------------------------ */
/*  Topics + payloads                                                  */
/* ------------------------------------------------------------------ */

/** Every topic `usePublishAgentChatState` publishes, and the payload each carries.
 *  Subscribing through {@link useAgentChatEvent} checks the handler against
 *  this map, so a mistyped topic is a compile error rather than a handler that
 *  silently never fires. */
export interface AgentChatEventMap {
  /** A user turn was committed. */
  'ui:agentchat:message-sent': {surfaceId: string; id: string; text: string; files?: string[]};
  /** An agent turn landed. */
  'ui:agentchat:response-received': {surfaceId: string; id: string; text: string};
  /** The agent started or stopped generating. */
  'ui:agentchat:busy-change': {surfaceId: string; busy: boolean};
  /** A framework was opened. */
  'ui:agentchat:framework-open': {surfaceId: string; id: string};
  /** A framework was closed. */
  'ui:agentchat:framework-close': {surfaceId: string; id: string};
  /** The active (linked) framework changed. */
  'ui:agentchat:framework-focus': {surfaceId: string; id: string};
}

export type AgentChatTopic = keyof AgentChatEventMap;

/** Import these rather than typing the strings — the map above types the
 *  payloads, and these constants keep the literals in one place. */
export const AGENT_CHAT_TOPICS = {
  messageSent: 'ui:agentchat:message-sent',
  responseReceived: 'ui:agentchat:response-received',
  busyChange: 'ui:agentchat:busy-change',
  frameworkOpen: 'ui:agentchat:framework-open',
  frameworkClose: 'ui:agentchat:framework-close',
  frameworkFocus: 'ui:agentchat:framework-focus',
} as const satisfies Record<string, AgentChatTopic>;

/* ------------------------------------------------------------------ */
/*  Transport                                                          */
/* ------------------------------------------------------------------ */

/**
 * The minimum a message bus has to do to be usable here. Deliberately
 * two required methods so adapting Redux, Zustand, an `EventTarget`, or a
 * bespoke emitter is a few lines and pulls in nothing from ld-kit.
 */
export interface AgentChatTransport {
  emit<K extends AgentChatTopic>(topic: K, payload: AgentChatEventMap[K]): void;
  /** Subscribe. Must return an unsubscribe function. */
  on<K extends AgentChatTopic>(topic: K, handler: (payload: AgentChatEventMap[K]) => void): () => void;
  /**
   * Optional key-value mirror, for buses that also expose readable state.
   * The ld-kit transport writes `agentchat:<surfaceId>:<field>` so a sibling
   * can `useStore(agentChatStoreKey('main', 'busy'), false)` instead of
   * tracking events. Omit it and only events are published.
   */
  setValue?(key: string, value: unknown): void;
}

/** Store key holding a surface's published state — read with
 *  `useStore(agentChatStoreKey('main', 'busy'), false)`. Only meaningful when
 *  the transport implements `setValue` (the ld-kit default does). */
export function agentChatStoreKey(
  surfaceId: string,
  field: 'messageCount' | 'busy' | 'frameworkCount',
): string {
  return `agentchat:${surfaceId}:${field}`;
}

/** The read-only view of a framework workspace that the publisher observes.
 *  {@link FrameworkWorkspaceController} satisfies it structurally for any item type. */
export interface ObservableFrameworks {
  items: ReadonlyArray<FrameworkLike>;
  activeId: string | null;
}
