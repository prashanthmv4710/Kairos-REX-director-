# ProductCardList

**Import:** `import { ProductCardList } from "./patterns/ProductCardList"`
**Category:** patterns
**Intent:** Product card sized for list layouts

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
- `stock`: string
- `unitPrice`: string
- `ebt`: boolean
- `cue`: string
- `brand`: string
- `onAddToCart`: () => void
- `cartQty`: number
- `onCartQtyChange`: (qty: number) => void