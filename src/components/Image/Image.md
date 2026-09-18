# Image

**Import:** `import { Image } from "./components/Image"`
**Category:** components
**Intent:** LD-wrapped img with mandatory alt or unsafeDecorative

## Props

- `alt`: string — A short, meaningful description of the image for screen readers.
- `unsafeDecorative`: { reason: string }
- `src`: string — The image source URL.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
