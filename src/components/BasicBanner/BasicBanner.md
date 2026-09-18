# BasicBanner

**Import:** `import { BasicBanner } from "./components/BasicBanner"`
**Category:** components
**Intent:** Generic promotional banner

## Props

- `icon`: ReactNode — Icon element to display on the left. Defaults to the Walmart placeholder icon.
- `iconLabel`: string — Visually hidden text that describes the icon to screen readers.
- `text`: string — Main text content
- `variant`: "default" | "brand" | "inverse" — Visual variant: default (blue-subtle), brand (Walmart blue), inverse (dark)
- `onClick`: () => void — Optional click handler — renders as button when provided
- `'aria-label'`: string — Accessible label for the banner button. Only meaningful when `onClick` is

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
