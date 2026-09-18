# SignatureCapturePanel

**Import:** `import { SignatureCapturePanel } from "./components/SignatureCapturePanel"`
**Category:** components
**Intent:** SignatureCapture hosted in a side Panel with an Agree & sign action. For a mobile sheet, use SignatureCaptureBottomSheet

## Props

- `isOpen`: boolean (required)
- `onClose`: () => void (required)
- `title`: string
- `size`: "small" | "medium" | "large"
- `position`: "left" | "right"
- `onSubmit`: () => void
- `submitLabel`: string