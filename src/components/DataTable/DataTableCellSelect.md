# DataTableCellSelect

**Import:** `import { DataTableCellSelect } from "./components/DataTable"`
**Category:** components
**Intent:** Tabular data with sortable columns

## Composition

`DataTableCellSelect` is part of a compound component. Use together with: `DataTableBulkActions`, `DataTableCell`, `DataTableCellActions`, `DataTableCellBulkEditTextArea`, `DataTableCellInlineEditTextArea`, `DataTableCellStatus`, `DataTableHeaderSelect`.

All pieces import from the same path (`./components/DataTable`). See each sibling's `.md` for its API.

## Props

- `a11yLabelledBy`: string (required) — The accessibility label reference IDs for the data table cell select.
- `checkboxProps`: CheckboxA11yProps["checkboxProps"] — The props spread to the data table cell select's input element.
- `checked`: CheckboxA11yProps["checked"] — If the data table cell select is checked.
- `disabled`: CheckboxA11yProps["disabled"] — If the data table cell select is disabled.
- `name`: CheckboxA11yProps["name"] — The name for the data table cell select.
- `onChange`: CheckboxA11yProps["onChange"] (required) — The callback fired when the data table cell select requests to change.
- `value`: CheckboxA11yProps["value"] — The value for the data table cell select.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
