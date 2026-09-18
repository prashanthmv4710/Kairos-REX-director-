# SideNavigationItem

**Import:** `import { SideNavigationItem } from "./components/SideNavigation"`
**Category:** components

## Composition

`SideNavigationItem` is part of a compound component. Use together with: `SideNavigation`.

All pieces import from the same path (`./components/SideNavigation`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode — The content for the side navigation item.
- `href`: string (required) — The href for the navigation item.
- `isCurrent`: boolean — If the navigation item represents the current page.
- `leading`: ReactNode — The leading content for the navigation item.
- `onClick`: (event: MouseEvent<HTMLAnchorElement>) => void — The callback fired when the side navigation item is clicked.
- `target`: string — The target for the side navigation item.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
