# Badge

**Import:** `import { Badge } from "./components/Badge"`
**Category:** components
**Intent:** Count/status pill — integer-only children (number or numeric string), throws at runtime otherwise. Omit children for a status dot. Use Badge for counts; use Tag for text status labels ("New", "Beta", "Out of stock").

## Props

- `children`: number | string — The count to display. Badge only supports integers — for text status
- `color`: "blue" | "brand" | "brandBold" | "cyan" | "edited" | "gray" | "green" | "info" | "negative" | "neutral" | "orange" | "pink" | "positive" | "purple" | "red" | "spark" | "teal" | "warning" | "yellow"
- `size`: "small" | "medium" — Dot size. Only applies when the badge renders as a dot (no children).

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
