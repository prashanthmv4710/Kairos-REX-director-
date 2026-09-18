# DemoModal

**Import:** `import { DemoModal } from "./patterns/DemoModal"`
**Category:** patterns
**Intent:** Lightweight portal modal for demos/prototypes (controlled open). For production dialogs, use Modal

## Props

- `open`: boolean (required)
- `onClose`: () => void (required)
- `title`: string
- `children`: ReactNode (required)
- `width`: number