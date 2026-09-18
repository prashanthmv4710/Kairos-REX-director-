# LinkButton

**Import:** `import { LinkButton } from "./components/LinkButton"`
**Category:** components
**Intent:** Link styled as a button

## Props

- `children`: ReactNode — The content for the link button.
- `color`: "default" | "subtle" | "white" — The color for the link button.
- `isFullWidth`: boolean — If the link button is displayed at full width.
- `leading`: ReactNode — The leading icon for the link button.
- `size`: "large" | "medium" | "small" — The size for the link button.
- `trailing`: ReactNode — The trailing icon for the link button.
- `href`: string (required) — The href for the link button (Anchor only).
- `disabled`: boolean — If the link button is disabled (Button only).
- `type`: "button" | "reset" | "submit" — The type for the link button (Button only).

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
