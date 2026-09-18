# PromotionalItemTile

**Import:** `import { PromotionalItemTile } from "./patterns/PromotionalItemTile"`
**Category:** patterns
**Intent:** Compact promo product tile (image + price + Add button / QuantityStepper; name required as image alt)

## Props

- `image`: string (required)
- `name`: string (required) — The product name. Used as the image alt text so screen reader users know
- `price`: string (required)
- `cents`: string (required)
- `onAddToCart`: () => void
- `cartQty`: number
- `onCartQtyChange`: (qty: number) => void