# MenuBreadcrumbItem

**Import:** `import { MenuBreadcrumbItem } from "./components/Menu"`
**Category:** components
**Intent:** Triggered action menu

## Composition

`MenuBreadcrumbItem` is part of a compound component. Use together with: `MenuItem`, `MenuDescriptionItem`, `MenuInfoItem`, `MenuNote`, `MenuSectionTitle`, `MenuSubMenu`, `MenuSectionTitleAccordion`, `MenuEditItem`, `Menu`.

All pieces import from the same path (`./components/Menu`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode (required)
- `disabled`: boolean

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
