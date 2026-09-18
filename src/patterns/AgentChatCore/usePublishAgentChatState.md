# usePublishAgentChatState

**Import:** `import { usePublishAgentChatState } from "./patterns/AgentChatCore"`
**Category:** patterns · React hook
**Intent:** Observes the given controllers and publishes on every meaningful change.

## Signature

```ts
usePublishAgentChatState(options: PublishAgentChatStateOptions): void
```

## Related hooks

From the same module (`./patterns/AgentChatCore`): `useAgentChatEvent`.

## Options

- `surfaceId`: string (required) — Distinguishes surfaces when more than one chat is mounted.
- `chat`: AgentChatController — The conversation controller to observe.
- `frameworks`: ObservableFrameworks — The framework controller to observe. Typed as the read-only slice the publisher
- `transport`: AgentChatTransport — Where to publish.

## Returns

`void`

## Usage notes

Observes the given controllers and publishes on every meaningful change.
Safe to call with either controller alone. Nothing is published for state
that was already present at mount — only genuine transitions.
