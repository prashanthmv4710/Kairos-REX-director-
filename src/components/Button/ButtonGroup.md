# ButtonGroup

**Import:** `import { ButtonGroup } from "./components/Button"`
**Category:** components
**Intent:** Related action row (children must be Button elements). For structured primary/secondary action pairs with prescribed variants, see ActionGroup.

## Composition

`ButtonGroup` is part of a compound component. Use together with: `Button`.

All pieces import from the same path (`./components/Button`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode (required) — The content for the button group.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
