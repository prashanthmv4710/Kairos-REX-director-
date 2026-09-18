# AutoCareModals

**Import:** `import { AutoCareModals } from "./patterns/AutoCareModals"`
**Category:** patterns
**Intent:** Auto Care demo modal set (check-in / reschedule / details) switched by openModal; built on DemoModal. Demo/prototype pattern

## Props

- `openModal`: "checkIn" | "reschedule" | "viewDetails" | null (required)
- `onClose`: () => void (required)
- `onSwitchToCheckIn`: () => void (required)
- `onSwitchToReschedule`: () => void (required)
- `serviceDetails`: ServiceDetails
- `location`: string
- `statusHeading`: string
- `orderTotal`: string