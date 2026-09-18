# RichSnackbar

**Import:** `import { RichSnackbar } from "./components/RichSnackbar"`
**Category:** components
**Intent:** Rich-content snackbar variant

## Composition

`RichSnackbar` is part of a compound component. Use together with: `RichSnackbarContainer`.

All pieces import from the same path (`./components/RichSnackbar`). See each sibling's `.md` for its API.

## Props

- `open`: boolean
- `color`: "primary" | "secondary" | "inverse" | "brand"
- `contentVariant`: "left-regular" | "left-bold" | "center-regular" | "center-bold"
- `leadingSlot`: ReactNode
- `message`: string | ReactNode (required)
- `a11yAnnouncement`: string — Plain-text string announced to screen readers via the shared
- `actionLabel`: string
- `onAction`: () => void
- `onClose`: () => void
- `duration`: number
- `position`: "bottom-left" | "bottom-center" | "bottom-right"
- `inline`: boolean

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
