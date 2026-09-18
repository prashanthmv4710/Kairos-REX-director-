# DataTableHeaderSelect

**Import:** `import { DataTableHeaderSelect } from "./components/DataTable"`
**Category:** components
**Intent:** Tabular data with sortable columns

## Composition

`DataTableHeaderSelect` is part of a compound component. Use together with: `DataTableBulkActions`, `DataTableCell`, `DataTableCellActions`, `DataTableCellBulkEditTextArea`, `DataTableCellInlineEditTextArea`, `DataTableCellSelect`, `DataTableCellStatus`.

All pieces import from the same path (`./components/DataTable`). See each sibling's `.md` for its API.

## Props

- `a11yCheckboxLabel`: string — The accessibility label for the data table header select.
- `checkboxProps`: CheckboxA11yProps["checkboxProps"] — The props spread to the data table header select's input element.
- `checked`: CheckboxA11yProps["checked"] — If the data table header select is checked.
- `disabled`: CheckboxA11yProps["disabled"] — If the data table header select is disabled.
- `indeterminate`: CheckboxA11yProps["indeterminate"] — If the data table header select is indeterminate.
- `name`: CheckboxA11yProps["name"] — The name for the data table header select.
- `onChange`: CheckboxA11yProps["onChange"] (required) — The callback fired when the data table header select requests to change.
- `value`: CheckboxA11yProps["value"] — The value for the data table header select.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
