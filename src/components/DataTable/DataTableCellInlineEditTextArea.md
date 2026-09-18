# DataTableCellInlineEditTextArea

**Import:** `import { DataTableCellInlineEditTextArea } from "./components/DataTable"`
**Category:** components
**Intent:** Tabular data with sortable columns

## Composition

`DataTableCellInlineEditTextArea` is part of a compound component. Use together with: `DataTableBulkActions`, `DataTableCell`, `DataTableCellActions`, `DataTableCellBulkEditTextArea`, `DataTableCellSelect`, `DataTableCellStatus`, `DataTableHeaderSelect`.

All pieces import from the same path (`./components/DataTable`). See each sibling's `.md` for its API.

## Props

- `a11yDialogLabel`: string (required) — The accessibility label for the data table cell inline edit text area's dialog.
- `a11yEditableLabel`: string — The accessibility label for the data table cell inline edit text area is editable and not saved.
- `a11ySavedLabel`: string — The accessibility label for the data table cell inline edit text area is saved.
- `a11yTextAreaLabel`: string (required) — The accessibility label for the data table cell inline edit text area's text area.
- `cancelButtonProps`: Omit<LinkButtonButtonProps, "size"> — The props spread to the data table cell inline edit text area's cancel button.
- `error`: ReactNode — The error for the data table cell inline edit text area's text area.
- `isOpen`: boolean — If the data table cell inline edit text area is open.
- `isSaved`: boolean — If the data table cell inline edit text area is saved.
- `onCancel`: (event: MouseEvent<HTMLButtonElement, MouseEvent> | KeyboardEvent) => void (required) — The callback fired when the data table cell inline edit text area requests to cancel.
- `onChange`: (event: ChangeEvent<HTMLTextAreaElement>) => void (required) — The callback fired when the data table cell inline edit text area requests to change.
- `onOpen`: (event: MouseEvent<HTMLButtonElement, MouseEvent>) => void (required) — The callback fired when the data table cell inline edit text area requests to open.
- `onSave`: (event: MouseEvent<HTMLButtonElement, MouseEvent>) => void (required) — The callback fired when the data table cell inline edit text area requests to save.
- `saveButtonProps`: Omit<ButtonButtonProps, "size" | "variant"> — The props spread to the data table cell inline edit text area's save button.
- `textAreaProps`: ComponentPropsWithRef<"textarea"> — The props spread to the data table cell inline edit text area's text area.
- `triggerButtonProps`: ComponentPropsWithoutRef<"button"> — The props spread to the data table cell inline edit text area's trigger button.
- `value`: string (required) — The value for the data table cell inline edit text area's text area.
- `variant`: "alphanumeric" | "numeric" — The variant for the data table cell inlne edit text area.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
