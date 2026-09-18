# ProgressIndicator

**Import:** `import { ProgressIndicator } from "./components/ProgressIndicator"`
**Category:** components
**Intent:** Determinate progress bar

## Props

- `a11yLabelledBy`: string — The accessible label reference IDs for the progress indicator (Required if omitting `label`).
- `label`: ReactNode
- `accentColor`: string — Color of the category dot and track fill (`category` layout only). Accepts
- `layout`: "default" | "category" — The layout for the progress indicator. The `category` layout renders a
- `max`: number — The maximum value for the progress indicator.
- `min`: number — The minimum value for the progress indicator.
- `value`: number — The value for the progress indicator.
- `valueLabel`: string — The value label for the progress indicator. Rendered as the emphasized
- `valueText`: ReactNode — A secondary value shown before the value label in the `category` layout
- `variant`: "error" | "info" | "success" | "warning" — The variant for the progress indicator. Ignored when `layout` is

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
