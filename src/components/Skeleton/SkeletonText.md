# SkeletonText

**Import:** `import { SkeletonText } from "./components/Skeleton"`
**Category:** components
**Intent:** Text-line loading placeholder

## Composition

`SkeletonText` is part of a compound component. Use together with: `Skeleton`.

All pieces import from the same path (`./components/Skeleton`). See each sibling's `.md` for its API.

## Props

- `isMagic`: boolean — If the Skeleton Text should use visual styles that indicate the involvement of an AI agent.
- `lines`: number — The number of lines for the Skeleton Text.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
