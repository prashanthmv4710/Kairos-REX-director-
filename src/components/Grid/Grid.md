# Grid

**Import:** `import { Grid } from "./components/Grid"`
**Category:** components
**Intent:** Responsive 12-column layout (always pass hasGutter)

## Composition

`Grid` is part of a compound component. Use together with: `GridColumn`.

All pieces import from the same path (`./components/Grid`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode (required) — The content for the grid.
- `hasGutter`: boolean — If the grid has a gutter.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
