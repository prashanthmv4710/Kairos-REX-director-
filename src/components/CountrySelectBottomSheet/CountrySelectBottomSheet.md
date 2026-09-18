# CountrySelectBottomSheet

**Import:** `import { CountrySelectBottomSheet } from "./components/CountrySelectBottomSheet"`
**Category:** components
**Intent:** Modal bottom-sheet radio list for picking one country, confirmed via footer button (controlled open)

## Props

- `countries`: Country[]
- `value`: string
- `onSelect`: (country: Country) => void
- `showDialCode`: boolean
- `variant`: "flat" | "slot"
- `title`: string
- `actionLabel`: string
- `onConfirm`: (selected: Country | undefined) => void
- `onClose`: () => void
- `open`: boolean (required)

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
