# Chip

**Import:** `import { Chip } from "./components/Chip"`
**Category:** components
**Intent:** Interactive filter chip (multi-select; toggles independently)

## Composition

`Chip` is part of a compound component. Use together with: `ChipGroup`.

All pieces import from the same path (`./components/Chip`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode (required) — The content for the chip.
- `disabled`: boolean — If the chip is disabled.
- `leading`: ReactNode — The leading content for the chip.
- `onClick`: (event: MouseEvent<HTMLButtonElement>) => void — The callback fired when the chip is clicked.
- `selected`: boolean — If the chip is selected (checked). Sets `aria-checked` on the button.
- `selectionIndicator`: boolean — If true, shows a selection checkmark when selected and no leading icon is provided.
- `size`: "large" | "medium" | "small" — The size for the chip.
- `pill`: boolean — If true, renders the chip with fully rounded (pill) corners.
- `trailing`: ReactNode — The trailing content for the chip.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
