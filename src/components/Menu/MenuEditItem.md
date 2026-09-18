# MenuEditItem

**Import:** `import { MenuEditItem } from "./components/Menu"`
**Category:** components
**Intent:** Triggered action menu

## Composition

`MenuEditItem` is part of a compound component. Use together with: `MenuItem`, `MenuDescriptionItem`, `MenuInfoItem`, `MenuNote`, `MenuSectionTitle`, `MenuBreadcrumbItem`, `MenuSubMenu`, `MenuSectionTitleAccordion`, `Menu`.

All pieces import from the same path (`./components/Menu`). See each sibling's `.md` for its API.

## Props

- `value`: string — Controlled value.
- `defaultValue`: string — Uncontrolled initial value.
- `onValueChange`: (value: string) => void
- `onSubmit`: (value: string) => void — Fired on Enter / commit. Receives the current value.
- `placeholder`: string
- `disabled`: boolean
- `error`: ReactNode — Error message rendered beneath the field; also applies error styling.
- `editOnDoubleClick`: boolean — When `true`, the item starts read-only and only becomes editable after a

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- `className` — the canonical hook for adding a CSS class. **Prefer this.**
- `style` — inline styles.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases. Use them only as a last resort (e.g. inside a wrapper that re-omits `className`).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
