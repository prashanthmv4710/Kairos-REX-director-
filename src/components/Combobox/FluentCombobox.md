# FluentCombobox

**Import:** `import { FluentCombobox } from "./components/Combobox"`
**Category:** components
**Intent:** Searchable single-select combobox, Fluent-styled (requires label or a11yLabelledBy). For LD-standard styling, use Combobox

## Props

- `label`: string
- `a11yLabelledBy`: string
- `disabled`: boolean
- `onChange`: (value: string) => void
- `options`: ComboboxOption[]
- `placeholder`: string
- `selectedValue`: string
- `value`: string

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
