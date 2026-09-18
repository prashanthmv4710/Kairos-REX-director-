# DelayedDeliveryModals

**Import:** `import { DelayedDeliveryModals } from "./patterns/DelayedDeliveryModals"`
**Category:** patterns
**Intent:** Reschedule/pickup/cancel/details modal set for delayed orders (switch via openModal)

## Props

- `openModal`: "reschedule" | "pickupInstead" | "viewDetails" | "cancel" | null (required)
- `onClose`: () => void (required)
- `orderTotal`: string