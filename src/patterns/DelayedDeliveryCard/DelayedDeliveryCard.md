# DelayedDeliveryCard

**Import:** `import { DelayedDeliveryCard } from "./patterns/DelayedDeliveryCard"`
**Category:** patterns
**Intent:** Order card for a delayed delivery — warning banner, progress tracker, and reschedule/pickup/cancel actions

## Props

- `statusHeading`: string (required)
- `delayEstimate`: string (required)
- `products`: OrderProduct[] (required)
- `orderTotal`: string
- `onReschedule`: () => void
- `onPickupInstead`: () => void
- `onViewDetails`: () => void
- `onCancelOrder`: () => void