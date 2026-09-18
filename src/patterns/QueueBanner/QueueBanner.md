# QueueBanner

**Import:** `import { QueueBanner } from "./patterns/QueueBanner"`
**Category:** patterns
**Intent:** Sticky queue/reservation banner with countdown timer and four variants (line-joined/warning/checkout/error)

## Props

- `variant`: "lineJoined" | "warning" | "checkout" | "error" (required)
- `timeDisplay`: string
- `endTime`: Date | number | string
- `message`: string
- `snackbarText`: string
- `productImage`: string
- `onView`: () => void
- `onLeave`: () => void
- `onClose`: () => void
- `onAction`: () => void
- `inline`: boolean

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
