# GridColumn

**Import:** `import { GridColumn } from "./components/Grid"`
**Category:** components
**Intent:** Grid column (always set sm/md/lg breakpoints)

## Composition

`GridColumn` is part of a compound component. Use together with: `Grid`.

All pieces import from the same path (`./components/Grid`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode (required) — The content for the grid column.
- `hasGutter`: boolean — If the grid column has a gutter.
- `lg`: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 — The number of columns at the large breakpoint.
- `md`: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 — The number of columns at the medium breakpoint.
- `sm`: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 — The number of columns at the small breakpoint.
- `xl`: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 — The number of columns at the extra-large breakpoint.
- `xxl`: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 — The number of columns at the extra-extra-large breakpoint.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
