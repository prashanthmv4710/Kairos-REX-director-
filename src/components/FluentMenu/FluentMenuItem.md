# FluentMenuItem

**Import:** `import { FluentMenuItem } from "./components/FluentMenu"`
**Category:** components
**Intent:** Compound dropdown menu (Trigger/List/Item/Divider) with keyboard focus management (controlled open)

## Composition

`FluentMenuItem` is part of a compound component. Use together with: `FluentMenuDivider`, `FluentMenu`, `FluentMenuTrigger`, `FluentMenuList`.

All pieces import from the same path (`./components/FluentMenu`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode (required)
- `disabled`: boolean
- `icon`: ReactNode

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
