# SelectCard

**Import:** `import { SelectCard } from "./components/SelectCard"`
**Category:** components
**Intent:** Card as a selectable option with built-in Checkbox (multi) or Radio (single); the whole card is the toggle target

## Props

- `label`: ReactNode — The label/title for the card.
- `a11yLabelledBy`: string — The accessible label reference IDs for the selection control.
- `children`: ReactNode — The content for the card body (e.g. a description or sub-label).
- `disabled`: boolean — If the card selection is disabled.
- `id`: string — The id for the selection input.
- `size`: "small" | "medium" — The size for the card.
- `selectProps`: ComponentPropsWithoutRef<"input"> — The props spread to the selection control (Checkbox or Radio input).

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
