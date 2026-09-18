# Divider

**Import:** `import { Divider } from "./components/Divider"`
**Category:** components
**Intent:** Section separator (needs surrounding margin)

## Props

- `orientation`: "horizontal" | "vertical" — The divider direction.
- `title`: string — The title for the divider.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
