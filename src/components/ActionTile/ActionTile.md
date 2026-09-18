# ActionTile

**Import:** `import { ActionTile } from "./components/ActionTile"`
**Category:** components
**Intent:** Selectable icon + title tile for action/choice grids (variant sets layout + size; selected drives pressed state)

## Props

- `children`: ReactNode (required) — The title (label) for the tile.
- `disabled`: boolean — If the tile is disabled.
- `leading`: ReactNode — The leading content for the tile — typically an `Icon` or a `SpotIcon`.
- `selected`: boolean — Whether the tile is activated (selected). Renders the activated blue border
- `titleWeight`: "bold" | "regular" — The font weight for the title.
- `variant`: "full" | "horizontal" | "short" | "tall" — The variant for the tile. Controls both the layout and the size.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
