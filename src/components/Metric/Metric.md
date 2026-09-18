# Metric

**Import:** `import { Metric } from "./components/Metric"`
**Category:** components
**Intent:** KPI / trend display

## Props

- `a11yTrendIndicatorLabel`: string — Override for the trend indicator icon's accessible label.
- `textLabel`: ReactNode — The text label providing a description of the metric.
- `timescope`: ReactNode — The timescope for the metric.
- `title`: ReactNode (required) — The title for the metric.
- `unit`: ReactNode — The unit for the metric.
- `value`: ReactNode (required) — The value for the metric.
- `variant`: "negativeDown" | "negativeUp" | "neutral" | "positiveDown" | "positiveUp" — The variant for the metric.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
