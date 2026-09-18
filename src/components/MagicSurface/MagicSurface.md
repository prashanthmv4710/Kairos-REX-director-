# MagicSurface

**Import:** `import { MagicSurface } from "./components/MagicSurface"`
**Category:** components

## Props

- `borderRadius`: "25" | "50" | "100" | "200" | "round" — The border radius for the Magic Surface.
- `children`: ReactNode (required) — The content for the magic surface.
- `height`: CSSProperties["height"] — The height for the Magic Surface.
- `width`: CSSProperties["width"] — The width for the Magic Surface.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
