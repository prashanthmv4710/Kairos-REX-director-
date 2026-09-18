# CardActions

**Import:** `import { CardActions } from "./components/Card"`
**Category:** components
**Intent:** Structured card surface (header / body / footer)

## Composition

`CardActions` is part of a compound component. Use together with: `CardContent`, `CardHeader`, `CardMedia`, `Card`.

All pieces import from the same path (`./components/Card`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode (required) — The content for the card actions.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
