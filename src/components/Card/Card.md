# Card

**Import:** `import { Card } from "./components/Card"`
**Category:** components
**Intent:** Structured card surface (header / body / footer)

## Composition

`Card` is part of a compound component. Use together with: `CardActions`, `CardContent`, `CardHeader`, `CardMedia`.

All pieces import from the same path (`./components/Card`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode (required) — The content for the card.
- `size`: "large" | "small" — The size for the card.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
