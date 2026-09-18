# Banner

**Import:** `import { Banner } from "./components/Banner"`
**Category:** components
**Intent:** High-impact global announcement; required close

## Props

- `a11yLabel`: string — Visually hidden prefix read by screen readers before the banner content,
- `closeButtonProps`: BannerCloseButtonProps — The props spread to the banner's close button.
- `children`: ReactNode (required) — The content for the banner.
- `onClose`: (event: MouseEvent<HTMLButtonElement>) => void (required) — The callback fired when the banner requests to close.
- `size`: "default" | "small" — The size for the banner. The `small` size has rounded corners, a compact
- `variant`: "error" | "info" | "success" | "warning" — The variant for the banner.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
