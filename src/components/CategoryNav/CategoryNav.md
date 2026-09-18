# CategoryNav

**Import:** `import { CategoryNav } from "./components/CategoryNav"`
**Category:** components
**Intent:** Category browse navigation

## Props

- `items`: CategoryNavItem[] — All navigation items displayed in a single flat row
- `activeItem`: string — Currently active item label
- `expandedItem`: string — Label of the currently expanded chevron item. Pass the label returned by
- `onItemClick`: (label: string) => void — Click handler for nav items
- `onBrowseClick`: () => void — Click handler for the mobile browse button (replaces Departments/Services)
- `browseHref`: string — Href for the mobile browse button

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
