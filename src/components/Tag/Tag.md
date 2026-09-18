# Tag

**Import:** `import { Tag } from "./components/Tag"`
**Category:** components
**Intent:** Text status pill — accepts any ReactNode children (e.g. "New", "Beta", "Out of stock"). For integer-only counts and status dots, use Badge.

## Props

- `children`: ReactNode (required) — The content for the tag.
- `color`: "blue" | "brand" | "brandBold" | "cyan" | "edited" | "gray" | "green" | "info" | "negative" | "neutral" | "orange" | "pink" | "positive" | "purple" | "red" | "spark" | "teal" | "warning" | "yellow" — The color for the tag.
- `leading`: ReactNode — The leading content for the tag.
- `size`: "small" | "medium" — The size for the tag. `'small'` uses 2px vertical / 4px horizontal
- `variant`: "primary" | "secondary" | "tertiary" — The variant for the tag.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
