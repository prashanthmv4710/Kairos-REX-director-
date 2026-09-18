# ChipGroup

**Import:** `import { ChipGroup } from "./components/Chip"`
**Category:** components
**Intent:** Container for filter-style multi-select chips

## Composition

`ChipGroup` is part of a compound component. Use together with: `Chip`.

All pieces import from the same path (`./components/Chip`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode (required) — The content for the chip group.
- `'aria-label'`: string — Accessible label for the group, announced by screen readers before the
- `'aria-labelledby'`: string — ID of a visible element that labels the group (alternative to `aria-label`).

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
