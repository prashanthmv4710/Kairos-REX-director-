# useAgentChatEvent

**Import:** `import { useAgentChatEvent } from "./patterns/AgentChatCore"`
**Category:** patterns · React hook
**Intent:** Typed subscription to an agent-chat topic.

## Signature

```ts
useAgentChatEvent<K extends AgentChatTopic>(topic: K, handler: (payload: AgentChatEventMap[K]) => void, transport?: AgentChatTransport): void
```

## Related hooks

From the same module (`./patterns/AgentChatCore`): `usePublishAgentChatState`.

## Parameters

- `topic`: K
- `handler`: (payload: AgentChatEventMap[K]) => void
- `transport`: AgentChatTransport (optional)

## Returns

`void`

## Usage notes

Typed subscription to an agent-chat topic. The handler's payload is inferred from
, and the latest handler is always used without
resubscribing on every render.
