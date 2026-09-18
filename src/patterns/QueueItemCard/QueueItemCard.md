# QueueItemCard

**Import:** `import { QueueItemCard } from "./patterns/QueueItemCard"`
**Category:** patterns
**Intent:** Queue reservation card for one held item (wait-time timer badge + product + View/Leave actions)

## Props

- `item`: QueueItem (required)

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
