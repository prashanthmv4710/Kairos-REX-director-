# Switch

**Import:** `import { Switch } from "./components/Switch"`
**Category:** components
**Intent:** Boolean toggle

## Props

- `a11yLabelledBy`: string
- `label`: ReactNode
- `disabled`: boolean
- `isOn`: boolean
- `size`: "small" | "medium" — Visual size. `medium` (default) is 48×24px. `small` is 40×20px.
- `onClick`: (event: MouseEvent<HTMLButtonElement>) => void

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
