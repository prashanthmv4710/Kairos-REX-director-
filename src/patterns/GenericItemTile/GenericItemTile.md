# GenericItemTile

**Import:** `import { GenericItemTile } from "./patterns/GenericItemTile"`
**Category:** patterns
**Intent:** Full-featured generic item tile — image, flag, heart, swatches, pack chips, sponsored, pricing, description, rating, and fulfillment attributes. Based on WCP Item tile (Figma node 89462:8140, breakpoint 0-899px vertical variant).

## Props

- `image`: string (required) — Product image URL
- `name`: string (required) — Product name / description
- `price`: string (required) — Dollar portion of the price, e.g. "24"
- `cents`: string (required) — Cents portion of the price, e.g. "88"
- `originalPrice`: string — Strikethrough was-price, e.g. "$34.99"
- `pricePrefix`: string — Leading price label — pass "Now" to switch to savings (green) styling
- `priceSuffix`: string — Trailing price modifier, e.g. "/mo"
- `badge`: { label: string; type: "bestseller" | "deal" | "popular" | "rollback" | "clearance"; ... } — Flag / badge in the top-left of the image
- `sponsored`: boolean — Show "Sponsored" attribute above the price
- `rating`: number — Numeric star rating (0–5)
- `ratingCount`: string — Formatted review count shown next to the stars, e.g. "12,234"
- `delivery`: string — First fulfillment line, e.g. "Pickup today"
- `fulfillment`: string — Second fulfillment line, e.g. "Walmart fulfilled"
- `swatches`: GenericItemTileSwatch[] — Color swatches — rendered as small circles below the image
- `packOptions`: string[] — Pack-size options rendered as chips below the swatches
- `selectedPack`: string — Currently selected pack option
- `onPackSelect`: (pack: string) => void — Called when a pack chip is clicked
- `hearted`: boolean — Heart / save state
- `onHeartChange`: (hearted: boolean) => void
- `cartQty`: number — Cart quantity — 0 means "not in cart" (shows Add button)
- `onCartQtyChange`: (qty: number) => void
- `onAddToCart`: () => void