# CarouselProductCard

**Import:** `import { CarouselProductCard } from "./patterns/CarouselProductCard"`
**Category:** patterns
**Intent:** Product card sized for carousel rows

## Props

- `image`: string (required)
- `price`: string (required)
- `cents`: string (required)
- `onAddToCart`: () => void
- `cartQty`: number
- `onCartQtyChange`: (qty: number) => void