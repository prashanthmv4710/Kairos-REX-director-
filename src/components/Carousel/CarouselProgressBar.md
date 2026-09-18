# CarouselProgressBar

**Import:** `import { CarouselProgressBar } from "./components/Carousel"`
**Category:** components
**Intent:** Horizontal scrolling content row

## Composition

`CarouselProgressBar` is part of a compound component. Use together with: `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`, `CarouselPagination`, `CarouselSection`, `CarouselHeaderPrevious`, `CarouselHeaderNext`.

All pieces import from the same path (`./components/Carousel`). See each sibling's `.md` for its API.

## Props

- `autoPlay`: boolean — Enable auto-play on mount. Default: false
- `autoPlayInterval`: number — Auto-play interval in milliseconds. Default: 3000
- `showDots`: boolean — Show dot indicators on the progress bar. Default: true

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
