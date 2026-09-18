# IconButton

**Import:** `import { IconButton } from "./components/IconButton"`
**Category:** components
**Intent:** Icon-only interactive button (requires a11yLabel)

## Props

- `a11yLabel`: string — The accessible label for the icon button.
- `children`: ReactNode — The content for the icon button.
- `color`: "default" | "white" | "primary" | "secondary" | "tertiary" — The color of the icon button. `primary`, `secondary`, and `tertiary`
- `size`: "large" | "medium" | "small" | "xsmall" — The size for the icon button.
- `variant`: "round" | "full" | "ghost" — The variant for the icon button.
- `href`: string (required) — The href for the icon button (Anchor only).
- `disabled`: boolean — If the icon button is disabled (Button only).

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
