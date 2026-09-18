# TabNavigationItem

**Import:** `import { TabNavigationItem } from "./components/TabNavigation"`
**Category:** components
**Intent:** Tab entry

## Composition

`TabNavigationItem` is part of a compound component. Use together with: `TabNavigation`.

All pieces import from the same path (`./components/TabNavigation`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode (required) — The content for the tab navigation item.
- `href`: string — The href for the tab navigation item.
- `isCurrent`: boolean — If the tab navigation item represents the current page / selected tab.
- `leadingIcon`: ReactNode — The leading icon for tab navigation item.
- `onClick`: (event: MouseEvent<HTMLElement>) => void — The callback fired when the tab navigation item is clicked.
- `target`: string — The target for the tab navigation item. Only applies in `"navigation"` pattern.
- `trailing`: ReactNode — The trailing content for the tab navigation item.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
