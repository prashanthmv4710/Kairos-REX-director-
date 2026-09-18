# RatingDisplay

**Import:** `import { RatingDisplay } from "./components/RatingDisplay"`
**Category:** components
**Intent:** Read-only star rating with optional review count, link, and text (value clamped 0–5). For input, use a rating control

## Props

- `value`: number
- `size`: "small" | "medium"
- `color`: "default" | "inverse"
- `count`: string
- `linkText`: string
- `linkHref`: string
- `onLinkClick`: (e: MouseEvent) => void
- `text`: string
- `'aria-label'`: string

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
