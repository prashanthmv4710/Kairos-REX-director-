# TextField

**Import:** `import { TextField } from "./components/TextField"`
**Category:** components
**Intent:** Single-line text input

## Props

- `a11yMagicLabel`: string — The accessible description of the Text Field that indicates the involvement of an AI agent.
- `disabled`: boolean — If the text field is disabled.
- `error`: ReactNode — The error for the text field.
- `helperText`: ReactNode — The helper text for the text field.
- `id`: string — The id for the text field.
- `isMagic`: boolean — If the Text Field should use visual styles that indicate the involvement of an AI agent.
- `label`: ReactNode (required) — The label for the text field.
- `leadingIcon`: ReactNode — The leading icon for the text field.
- `onChange`: (event: ChangeEvent<HTMLInputElement>) => void (required) — The callback fired when the text field requests to change.
- `readOnly`: boolean — If the text field is read only.
- `size`: "large" | "small" | "xsmall" — The size for the text field.
- `textFieldProps`: ComponentPropsWithoutRef<"input"> — The props spread to the text field's input element.
- `trailing`: ReactNode — The trailing content for the text field.
- `type`: "email" | "number" | "password" | "search" | "tel" | "text" | "time" | "url" — The type for the text field.
- `value`: string — The value for the text field.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
