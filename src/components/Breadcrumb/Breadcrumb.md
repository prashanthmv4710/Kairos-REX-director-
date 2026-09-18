# Breadcrumb

**Import:** `import { Breadcrumb } from "./components/Breadcrumb"`
**Category:** components
**Intent:** Hierarchical path navigation

## Composition

`Breadcrumb` is part of a compound component. Use together with: `BreadcrumbItem`.

All pieces import from the same path (`./components/Breadcrumb`). See each sibling's `.md` for its API.

## Props

- `a11yLabel`: string — The accessible label for the breadcrumb.
- `children`: ReactNode (required) — The content for the breadcrumb.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
