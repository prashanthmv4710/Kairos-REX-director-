# CountrySelectGroup

**Import:** `import { CountrySelectGroup } from "./components/CountrySelectGroup"`
**Category:** components
**Intent:** Radio-list country picker with flags and optional dial codes. For a mobile sheet, use CountrySelectBottomSheet

## Props

- `countries`: Country[]
- `value`: string
- `onChange`: (country: Country) => void
- `description`: string
- `footerText`: string
- `showDialCode`: boolean
- `name`: string — Native radio `name` attribute — required for proper form submission and AT grouping. Auto-generated if omitted.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
