# Alert

**Import:** `import { Alert } from "./components/Alert"`
**Category:** components
**Intent:** Status message (success/info/warning/error)

## Props

- `a11yIconLabel`: string
- `actionButtonProps`: AlertActionButtonProps
- `children`: ReactNode (required)
- `variant`: "error" | "info" | "success" | "warning"

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
