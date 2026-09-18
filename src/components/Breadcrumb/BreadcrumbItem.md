# BreadcrumbItem

**Import:** `import { BreadcrumbItem } from "./components/Breadcrumb"`
**Category:** components
**Intent:** Single breadcrumb entry

## Composition

`BreadcrumbItem` is part of a compound component. Use together with: `Breadcrumb`.

All pieces import from the same path (`./components/Breadcrumb`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode (required) — The content for the breadcrumb item.
- `href`: string (required) — The href for the breadcrumb item.
- `isCurrent`: boolean — If the breadcrumb item represents the current location.
- `onClick`: (event: MouseEvent<HTMLAnchorElement>) => void — The callback fired when the breadcrumb item is clicked.
- `target`: string — The target for the breadcrumb item.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
