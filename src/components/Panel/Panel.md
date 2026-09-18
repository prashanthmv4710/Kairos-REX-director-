# Panel

**Import:** `import { Panel } from "./components/Panel"`
**Category:** components
**Intent:** Side-drawer overlay (controlled isOpen)

## Props

- `actions`: ReactNode — The actions for the panel.
- `children`: ReactNode (required) — The content for the panel.
- `closeButtonProps`: PanelCloseButtonProps — The props spread to the panel's close button.
- `isOpen`: boolean (required) — If the Panel is open.
- `onClose`: (event: PanelCloseEvent) => void (required) — The callback fired when the panel requests to close.
- `onClosed`: () => void — The callback fired when the panel transition has ended.
- `hasScrim`: boolean — Whether the dimming scrim renders behind the panel. Set to `false` for a
- `position`: "left" | "right" — The position for the panel.
- `size`: "large" | "medium" | "small" — The size for the panel.
- `title`: ReactNode (required) — The title for the panel.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
