# ProgressTrackerItem

**Import:** `import { ProgressTrackerItem } from "./components/ProgressTracker"`
**Category:** components
**Intent:** Multi-step progress

## Composition

`ProgressTrackerItem` is part of a compound component. Use together with: `ProgressTracker`.

All pieces import from the same path (`./components/ProgressTracker`). See each sibling's `.md` for its API.

## Props

- `a11yIndicatorLabel`: string — The accessible label for the progress tracker item indicator.
- `children`: ReactNode — The content for the progress tracker item.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
