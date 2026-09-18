# IconSelector

**Import:** `import { IconSelector } from "./components/IconSelector"`
**Category:** components
**Intent:** Binary on/off toggle shown as a paired icon set (outline/filled); announces as a switch (a11yLabel required)

## Props

- `a11yLabel`: string (required) — The accessible label for the icon selector. Announced by assistive tech
- `iconSelected`: ReactNode (required) — The icon shown when the selector is **selected** (the "on" state). Pair
- `iconUnselected`: ReactNode (required) — The icon shown when the selector is **unselected** (the "off" state).
- `color`: "default" | "white" | "primary" — The color of the icon selector. Mirrors the corresponding colors on
- `defaultSelected`: boolean — The default selected state (uncontrolled). Use together with
- `disabled`: boolean — If the icon selector is disabled.
- `onSelectedChange`: (selected: boolean) => void — The callback fired when the selected state changes. Called with the next
- `selected`: boolean — The selected state (controlled). When provided, the parent owns the
- `size`: "large" | "medium" | "small" | "xsmall" — The size for the icon selector. Matches the sizing scale of `IconButton`.
- `variant`: "round" | "full" — The variant for the icon selector. `round` is fully rounded; `full` uses

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
