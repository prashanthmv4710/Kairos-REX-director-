# Skeleton

**Import:** `import { Skeleton } from "./components/Skeleton"`
**Category:** components
**Intent:** Block loading placeholder

## Composition

`Skeleton` is part of a compound component. Use together with: `SkeletonText`.

All pieces import from the same path (`./components/Skeleton`). See each sibling's `.md` for its API.

## Props

- `height`: number | string — The height for the Skeleton.
- `isMagic`: boolean — If the Skeleton should use visual styles that indicate the involvement of an AI agent.
- `variant`: "rectangle" | "rounded" — The variant for the Skeleton.
- `width`: number | string — The width for the Skeleton.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
