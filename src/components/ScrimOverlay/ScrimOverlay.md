# ScrimOverlay

**Import:** `import { ScrimOverlay } from "./components/ScrimOverlay"`
**Category:** components
**Intent:** Portalled dimming layer behind custom overlay surfaces, dismiss on click/Escape. For standard dialogs use Modal/Panel/BottomSheet

## Props

- `isOpen`: boolean (required) — Whether the scrim is mounted and visible.
- `onClose`: (event: MouseEvent<HTMLDivElement, MouseEvent> | KeyboardEvent | undefined) => void — Callback fired when the scrim requests to close — clicking the scrim
- `dismissOnClick`: boolean — If true, clicking the scrim calls `onClose`.
- `dismissOnEscape`: boolean — If true, pressing Escape calls `onClose`.
- `children`: ReactNode — Optional content rendered above the scrim, centered in the overlay.
- `scrimClassName`: string — Extra class on the scrim element.