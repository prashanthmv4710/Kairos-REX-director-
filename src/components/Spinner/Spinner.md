# Spinner

**Import:** `import { Spinner } from "./components/Spinner"`
**Category:** components
**Intent:** Indeterminate loading indicator

## Props

- `a11yLabel`: string — The accessible label for the spinner.
- `color`: "neutral" | "white" | "brand" | "dark" — The color for the spinner.
- `size`: "large" | "small" — The size for the spinner.
- `spinnerProps`: ComponentPropsWithoutRef<"svg"> — The props spread to the spinner's svg element.
- `variant`: "default" | "generic" — The visual variant for the spinner. The `"generic"` variant renders a

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
