# SearchField

**Import:** `import { SearchField } from "./components/SearchField"`
**Category:** components
**Intent:** Pill-shaped search input with leading magnifier, inline mic/barcode buttons and slide-in Cancel

## Props

- `value`: string (required)
- `onChange`: (value: string) => void (required)
- `onClear`: () => void
- `onCancel`: () => void
- `showMic`: boolean — Show microphone icon button in unfilled, resting state.
- `showBarcode`: boolean — Show barcode icon button in unfilled, resting state.
- `onMicClick`: () => void
- `onBarcodeClick`: () => void
- `placeholder`: string
- `disabled`: boolean
- `simulateFocused`: boolean — Force the activated/focused visual state without real browser focus.
- `size`: "xsmall" | "small" | "medium" | "large"
- `cornerStyle`: "rounded" | "default"