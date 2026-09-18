# GetItNowModal

**Import:** `import { GetItNowModal } from "./patterns/GetItNowModal"`
**Category:** patterns
**Intent:** Confirmation modal for switching curbside pickup to express delivery, with fee/total summary (controlled open)

## Props

- `open`: boolean (required)
- `onClose`: () => void (required)
- `location`: string
- `orderTotal`: string