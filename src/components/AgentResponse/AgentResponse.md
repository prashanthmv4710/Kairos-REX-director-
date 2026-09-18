# AgentResponse

**Import:** `import { AgentResponse } from "./components/AgentResponse"`
**Category:** components
**Intent:** Agent/assistant chat turn — avatar, name, reply body or streaming placeholder, optional link/timestamp/feedback slots

## Props

- `children`: ReactNode — The agent's reply. Ignored while `thinking`.
- `slot`: ReactNode — Optional rich content rendered beneath the reply (e.g. an ItemTile).
- `link`: string — Optional follow-up link rendered beneath the content slot.
- `timestamp`: string — Optional timestamp / read receipt caption.
- `thinking`: boolean — When `true`, shows the streaming placeholder instead of `children`.
- `name`: string — The agent's display name shown in the header.
- `avatarA11yLabel`: string — Accessible label for the agent avatar.
- `thinkingLabel`: string — Copy shown while `thinking`.
- `hideAvatar`: boolean — Hide the leading avatar (e.g. when a status dot identifies the source).
- `statusColor`: string — A status dot color shown before the name (e.g. a source/brand color).
- `meta`: ReactNode — Subtle meta text after the name (e.g. "generated this response").
- `info`: boolean — Show a trailing info affordance in the header.
- `infoLabel`: string — Accessible label for the info affordance.
- `feedback`: ReactNode — A feedback / actions toolbar rendered beneath the response.
- `trace`: ReactNode — A system `ProcessingTrace` paired with this response. Rendered above the

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
