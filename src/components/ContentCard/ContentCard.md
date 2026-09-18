# ContentCard

**Import:** `import { ContentCard } from "./components/ContentCard"`
**Category:** components
**Intent:** Editorial / promotional card

## Props

- `imageSrc`: string (required) — Hero/background image URL
- `imageAlt`: string (required) — Alt text for the image
- `eyebrow`: string — Small top text for brand/category context (e.g. "Ray-Ban, Oakley, Costa & more")
- `headline`: string (required) — Primary text
- `subtext`: string — Secondary descriptive line
- `ctaLabel`: string — CTA button/link text ("Shop now", "Learn more", "Get started")
- `ctaHref`: string — CTA link destination. When provided, the CTA renders as a `<Link>`.
- `onClick`: () => void — Click handler for the entire card
- `variant`: "vertical" | "horizontal" | "background" — Layout variant

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
