# HeartView

**Import:** `import { HeartView } from "./components/HeartView"`
**Category:** components
**Intent:** Favorite toggle indicator

## Props

- `activated`: boolean
- `defaultActivated`: boolean
- `onChange`: (activated: boolean) => void
- `size`: "small" | "medium"
- `listName`: string
- `onViewList`: () => void
- `onSnackbar`: (message: string, actionLabel: string, onAction: () => void) => void — Called when mobile snackbar should fire. Consumer provides snackbar implementation.
- `snackbarDuration`: number
- `disabled`: boolean
- `'aria-label'`: string
- `calloutPosition`: "left" | "right" | "bottom" | "top"

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
