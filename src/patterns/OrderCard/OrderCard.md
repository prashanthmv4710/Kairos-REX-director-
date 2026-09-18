# OrderCard

**Import:** `import { OrderCard } from "./patterns/OrderCard"`
**Category:** patterns
**Intent:** Order status card — fulfillment type, progress tracker, product thumbnails, actions, delivered-order rating

## Props

- `orderType`: "curbside" | "delivery" | "shipping" | "store" | "auto" (required)
- `location`: string
- `seller`: string
- `fulfilledBy`: string
- `statusHeading`: string (required)
- `timelineStep`: "placed" | "preparing" | "on-the-way" | "delivered"
- `timelineVariant`: "delivery" | "pickup"
- `isDelayed`: boolean
- `products`: OrderProduct[] (required)
- `actions`: OrderAction[]
- `orderTotal`: string
- `showStartReturn`: boolean
- `returnNotice`: string
- `returnDeadline`: string
- `addItemsBanner`: string
- `serviceDetails`: ServiceDetails