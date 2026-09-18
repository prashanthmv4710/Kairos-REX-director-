# QueueLanding

**Import:** `import { QueueLanding } from "./patterns/QueueLanding"`
**Category:** patterns
**Intent:** Full waiting-room landing page for a queued item (authenticated in-line hero vs. unauthenticated sign-in prompt)

## Props

- `variant`: "authenticated" | "unauthenticated"
- `product`: QueueLandingProduct (required)
- `timeDisplay`: string
- `endTime`: Date | number | string
- `timerVariant`: TimerViewVariant
- `onSignIn`: () => void

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
