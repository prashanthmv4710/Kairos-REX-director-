# ProductCardGrid

**Import:** `import { ProductCardGrid } from "./patterns/ProductCardGrid"`
**Category:** patterns
**Intent:** Product card sized for responsive grid columns

## Props

- `image`: string (required)
- `name`: string (required)
- `price`: string (required)
- `cents`: string (required)
- `wasPrice`: string
- `flag`: string
- `flagVariant`: FlagVariant
- `rating`: number (required)
- `ratingCount`: string (required)
- `pickup`: string
- `onAddToCart`: () => void
- `hearted`: boolean
- `onHeartChange`: (hearted: boolean) => void
- `cartQty`: number
- `onCartQtyChange`: (qty: number) => void