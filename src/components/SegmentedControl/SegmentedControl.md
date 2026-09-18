# SegmentedControl

**Import:** `import { SegmentedControl } from "./components/SegmentedControl"`
**Category:** components
**Intent:** One-of-many pill toggle (radiogroup semantics)

## Props

- `items`: SegmentedControlItem[] (required) — The list of segment items (2-5 items).
- `value`: string (required) — The currently selected value (controlled).
- `onChange`: (value: string) => void (required) — Called when the user selects a segment.
- `'aria-label'`: string — Accessible label for the control group.
- `pattern`: "radio" | "tablist" — The ARIA pattern to use.
- `disabled`: boolean — Disable all segments.
- `isFullWidth`: boolean — If true the control stretches to fill its container width.
- `iconOnly`: boolean — Icon-only variant — hides every segment's text label and renders just the

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
