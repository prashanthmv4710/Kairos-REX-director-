# Link

**Import:** `import { Link } from "./components/Link"`
**Category:** components
**Intent:** Inline text link

## Props

- `children`: ReactNode (required) — The content for the link.
- `color`: "default" | "subtle" | "white" | "info" — The color for the link.
- `href`: string (required) — The href for the link.
- `onClick`: (event: MouseEvent<HTMLAnchorElement>) => void — The callback fired when the link is clicked.
- `target`: string — The target for the link.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
