# TimerView

**Import:** `import { TimerView } from "./components/TimerView"`
**Category:** components
**Intent:** Countdown timer view

## Props

- `timeDisplay`: string
- `variant`: "waiting" | "warning" | "expiring" | "badge" | "brand-bold" | "outlined" | "transparent"
- `size`: "medium" | "small"
- `endTime`: Date | number | string
- `badgeColor`: "blue" | "spark" | "negative"
- `label`: string
- `showLabel`: boolean

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
