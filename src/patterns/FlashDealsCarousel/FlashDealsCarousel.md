# FlashDealsCarousel

**Import:** `import { FlashDealsCarousel } from "./patterns/FlashDealsCarousel"`
**Category:** patterns
**Intent:** Built-in flash-deals product row (writes to Store)

## Props

- `onAddToCart`: (item: { sku: string; name: string; priceCents: number }) => void — Called when a deal's "Add" button is pressed, with the deal's cart