# CountrySelectDropdown

**Import:** `import { CountrySelectDropdown } from "./components/CountrySelectDropdown"`
**Category:** components
**Intent:** Searchable single/multi country combobox with keyboard listbox nav (multi confirmed via Apply)

## Props

- `countries`: Country[]
- `mode`: "single" | "multi"
- `value`: string | string[]
- `onChange`: (value: string | string[], countries: Country | Country[]) => void
- `placeholder`: string
- `showDialCode`: boolean
- `confirmLabel`: string
- `label`: string
- `disabled`: boolean
- `triggerWidth`: string | number
- `allowSpaceInSearch`: boolean — When `true`, the Space key types a space character in the search input

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
