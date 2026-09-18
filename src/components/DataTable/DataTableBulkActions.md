# DataTableBulkActions

**Import:** `import { DataTableBulkActions } from "./components/DataTable"`
**Category:** components
**Intent:** Tabular data with sortable columns

## Composition

`DataTableBulkActions` is part of a compound component. Use together with: `DataTableCell`, `DataTableCellActions`, `DataTableCellBulkEditTextArea`, `DataTableCellInlineEditTextArea`, `DataTableCellSelect`, `DataTableCellStatus`, `DataTableHeaderSelect`.

All pieces import from the same path (`./components/DataTable`). See each sibling's `.md` for its API.

## Props

- `a11yLabel`: string — The accessibility label for the data table bulk actions.
- `actionContent`: ReactNode — The action content for the data table bulk actions.
- `count`: number — The selected row count for the data table bulk actions.
- `countLabel`: string — The count label for the data table bulk actions.
- `onClearSelectedButtonProps`: DataTableBulkActionsButtonProps — The props to spread to the data table bulk actions' clear selected button.
- `onClearSelected`: (event: MouseEvent<HTMLButtonElement, MouseEvent>) => void — The callback fired when the data table bulk actions requests to clear selected.
- `onSelectAll`: (event: MouseEvent<HTMLButtonElement, MouseEvent>) => void — The callback fired when the data table bulk actions requests to select all.
- `selectAllButtonProps`: DataTableBulkActionsButtonProps — The props to spread to the data table bulk actions' select all button.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
