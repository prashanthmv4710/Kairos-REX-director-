# SpinButton

**Import:** `import { SpinButton } from "./components/SpinButton"`
**Category:** components
**Intent:** Numeric stepper input with up/down chevrons and min/max/step clamping (requires label or a11yLabelledBy)

## Props

- `label`: string
- `a11yLabelledBy`: string
- `disabled`: boolean
- `max`: number
- `min`: number
- `onChange`: (value: number) => void
- `step`: number
- `value`: number

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
