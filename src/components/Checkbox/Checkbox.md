# Checkbox

**Import:** `import { Checkbox } from "./components/Checkbox"`
**Category:** components
**Intent:** Multi-select choice (group with FormGroup)

## Props

- `a11yLabelledBy`: string — The accessible label reference IDs for the checkbox (Required if omitting `label`).
- `label`: ReactNode
- `checkboxProps`: ComponentPropsWithoutRef<"input"> — The props spread to the checkbox's input element.
- `checked`: boolean — If the checkbox is checked.
- `disabled`: boolean — If the checkbox is disabled.
- `id`: string — The id for the checkbox.
- `indeterminate`: boolean — If the checkbox is indeterminate.
- `name`: string — The name for the checkbox.
- `onChange`: (event: ChangeEvent<HTMLInputElement>) => void — The callback fired when the checkbox requests to change.
- `size`: "small" | "medium" — The size of the checkbox control. `'small'` is 20×20 px, `'medium'`
- `value`: number | string — The value for the checkbox.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
