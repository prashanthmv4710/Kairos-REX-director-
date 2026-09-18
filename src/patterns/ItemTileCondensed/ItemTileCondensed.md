# ItemTileCondensed

**Import:** `import { ItemTileCondensed } from "./patterns/ItemTileCondensed"`
**Category:** patterns
**Intent:** Compact circular-image product tile for grocery/re-order grids with add-to-cart pill and edit-mode stepper

## Props

- `price`: string (required) — Dollar portion of the price, e.g. "3"
- `cents`: string (required) — Cents portion of the price, e.g. "25"
- `tag`: string — Optional size/options tag text, e.g. "5 oz"
- `variant`: "primary" | "tertiary" | "edit"
- `fillContainer`: boolean
- `loading`: boolean
- `onAddToCart`: (count: number) => void
- `name`: string
- `quantity`: number
- `onQuantityChange`: (q: number) => void
- `isChecked`: boolean
- `onCheckChange`: (checked: boolean) => void
- `itemIndex`: number
- `animationClass`: string