# FluentMenuDivider

**Import:** `import { FluentMenuDivider } from "./components/FluentMenu"`
**Category:** components
**Intent:** Compound dropdown menu (Trigger/List/Item/Divider) with keyboard focus management (controlled open)

## Composition

`FluentMenuDivider` is part of a compound component. Use together with: `FluentMenu`, `FluentMenuTrigger`, `FluentMenuList`, `FluentMenuItem`.

All pieces import from the same path (`./components/FluentMenu`). See each sibling's `.md` for its API.

## Props

_(no public props)_

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
