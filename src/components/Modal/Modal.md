# Modal

**Import:** `import { Modal } from "./components/Modal"`
**Category:** components
**Intent:** Centered overlay dialog (controlled isOpen)

## Props

- `actions`: ReactNode — The actions for the modal.
- `children`: ReactNode (required) — The content for the modal.
- `closeButtonProps`: ModalCloseButtonProps — The props spread to the modal's close button.
- `isOpen`: boolean (required) — If the bottom sheet is open.
- `onClose`: (event: ModalCloseEvent) => void (required) — The callback fired when the modal requests to close.
- `onClosed`: () => void — The callback fired when the modal transition has ended.
- `size`: "small" | "medium" | "large" — The size for the modal.
- `title`: ReactNode (required) — The title for the modal.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
