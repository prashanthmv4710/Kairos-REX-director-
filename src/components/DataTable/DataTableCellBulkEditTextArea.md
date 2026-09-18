# DataTableCellBulkEditTextArea

**Import:** `import { DataTableCellBulkEditTextArea } from "./components/DataTable"`
**Category:** components
**Intent:** Tabular data with sortable columns

## Composition

`DataTableCellBulkEditTextArea` is part of a compound component. Use together with: `DataTableBulkActions`, `DataTableCell`, `DataTableCellActions`, `DataTableCellInlineEditTextArea`, `DataTableCellSelect`, `DataTableCellStatus`, `DataTableHeaderSelect`.

All pieces import from the same path (`./components/DataTable`). See each sibling's `.md` for its API.

## Props

- `a11yTextAreaLabelledBy`: string (required) — The accessible label reference IDs for the data table cell bulk edit text area.
- `editedHelperTextLabel`: string — The helper text displayed when the data table cell bulk edit text area is in the `isEdited` state.
- `error`: ReactNode — The error for the data table cell bulk edit text area.
- `isEdited`: boolean — If the data table cell bulk edit text area has been edited.
- `onChange`: (event: ChangeEvent<HTMLTextAreaElement>) => void (required) — The callback fired when the data table cell bulk edit text area requests to change.
- `textAreaProps`: ComponentPropsWithRef<"textarea"> — The props spread to the data table cell bulk edit text area's text area.
- `value`: string — The value for the data table cell bulk edit text area.
- `variant`: "alphanumeric" | "numeric" — The variant for the data table cell bulk edit text area.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
