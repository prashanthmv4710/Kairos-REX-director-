# BottomSheet

**Import:** `import { BottomSheet } from "./components/BottomSheet"`
**Category:** components
**Intent:** Modal anchored to the bottom of the viewport

## Props

- `actions`: ReactNode — The actions for the bottom sheet.
- `closeButtonProps`: BottomSheetCloseButtonProps — The props spread to the bottom sheet's close button.
- `children`: ReactNode (required) — The content for the bottom sheet.
- `isOpen`: boolean — If the bottom sheet is open.
- `onClose`: (event: BottomSheetCloseEvent) => void (required) — The callback fired when the bottom sheet requests to close.
- `onClosed`: () => void — The callback fired when the bottom sheet transition has ended.
- `title`: ReactNode (required) — The title for the bottom sheet.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
