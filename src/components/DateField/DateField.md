# DateField

**Import:** `import { DateField } from "./components/DateField"`
**Category:** components
**Intent:** Date input

## Props

- `disabled`: boolean — If the date field is disabled.
- `error`: ReactNode — The error for the date field.
- `format`: string — The date string format for the date field.
- `helperText`: ReactNode — The helper text for the date field.
- `id`: string — The id for the date field.
- `label`: ReactNode (required) — The label for the date field.
- `onChange`: (event: ChangeEvent<HTMLInputElement>) => void (required) — The callback fired when the date field requests to change.
- `readOnly`: boolean — If the date field is read only.
- `renderError`: (error: Error) => string — The callback fired when date picker date field input is invalid.
- `size`: "large" | "small" — The size for the date field.
- `textFieldProps`: ComponentPropsWithoutRef<"input"> — The props spread to the date field's input element.
- `value`: string — The value for the date field.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
