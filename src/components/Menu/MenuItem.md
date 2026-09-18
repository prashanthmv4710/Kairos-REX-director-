# MenuItem

**Import:** `import { MenuItem } from "./components/Menu"`
**Category:** components
**Intent:** Menu entry

## Composition

`MenuItem` is part of a compound component. Use together with: `MenuDescriptionItem`, `MenuInfoItem`, `MenuNote`, `MenuSectionTitle`, `MenuBreadcrumbItem`, `MenuSubMenu`, `MenuSectionTitleAccordion`, `MenuEditItem`, `Menu`.

All pieces import from the same path (`./components/Menu`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode (required) — The text label for the menu item.
- `disabled`: boolean — If the menu item is disabled.
- `leadingIcon`: ReactNode — The leading icon for the menu item.
- `trailingIcon`: ReactNode — Optional trailing content (icon, shortcut, etc.) pinned to the end.
- `destructive`: boolean — Renders the item with destructive styling (e.g. a "Delete" command).
- `selected`: boolean — Whether this menu item is currently selected.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
