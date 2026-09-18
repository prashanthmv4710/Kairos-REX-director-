# Flag

**Import:** `import { Flag } from "./components/Flag"`
**Category:** components
**Intent:** Inline label / flag pill

## Props

- `label`: string
- `variant`: "holiday-restricted" | "brand-subtle" | "scarcity" | "savings-bold" | "savings-subtle" | "confidence-subtle" | "confidence-bold" | "confidence-alt" | "confidence" | "holiday-member" | "social" | "urgent" | "express" | "drone-delivery" | "neutral" | "positive"
- `leadingIcon`: ReactNode
- `trailingIcon`: ReactNode
- `size`: "small" | "medium"

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
