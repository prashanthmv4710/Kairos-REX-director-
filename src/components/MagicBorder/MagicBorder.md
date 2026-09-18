# MagicBorder

**Import:** `import { MagicBorder } from "./components/MagicBorder"`
**Category:** components

## Props

- `animated`: boolean — Sweeps the border's gradient continuously around the ring instead of
- `activateOnFocus`: boolean — Keeps the ring hidden until a descendant receives focus (via
- `borderRadius`: "25" | "50" | "100" | "200" | "300" | "round" — The border radius for the Magic Border.
- `children`: ReactNode (required) — The content to frame with the magic border.
- `height`: CSSProperties["height"] — The height for the Magic Border.
- `padded`: boolean — Whether the framed content gets breathing room inside the ring. Turn
- `variant`: "subtle" | "bold" | "dark" — The angular gradient treatment for the border. `dark` is tuned to glow
- `width`: CSSProperties["width"] — The width for the Magic Border.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
