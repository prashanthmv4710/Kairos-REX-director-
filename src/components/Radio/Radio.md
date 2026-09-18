# Radio

**Import:** `import { Radio } from "./components/Radio"`
**Category:** components
**Intent:** Single-select choice (share name; group via FormGroup)

## Props

- `a11yLabelledBy`: string — The accessible label reference IDs for the radio (Required if omitting `label`).
- `label`: ReactNode
- `checked`: boolean — If the radio is checked.
- `disabled`: boolean — If the radio is disabled.
- `id`: string — The id for the radio.
- `name`: string — The name for the radio.
- `onChange`: (event: ChangeEvent<HTMLInputElement>) => void — The callback fired when the radio requests to change.
- `radioProps`: ComponentPropsWithoutRef<"input"> — The props spread to the radio's input element.
- `size`: "small" | "medium" — The size of the radio control. `'small'` is 20×20 px, `'medium'`
- `value`: number | string — The value for the radio.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
