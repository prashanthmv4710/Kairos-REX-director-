# ActiveCurbsideCard

**Import:** `import { ActiveCurbsideCard } from "./patterns/ActiveCurbsideCard"`
**Category:** patterns
**Intent:** Active curbside order card

## Props

- `storeName`: string (required)
- `status`: string (required)
- `products`: CurbsideProduct[] (required)
- `onCheckIn`: () => void