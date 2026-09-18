# Tree

**Import:** `import { Tree } from "./components/SideNavigation"`
**Category:** components

## Props

- `data`: TreeItemData[] — Tree data to render.
- `defaultExpandedIds`: string[] — IDs expanded by default.
- `onSelect`: (id: string) => void — Callback when a node is selected.
- `selectedId`: string — Currently selected node ID.
- `label`: string — Visible label for the tree.
- `a11yLabelledBy`: string

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
