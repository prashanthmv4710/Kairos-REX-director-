# Menu

**Import:** `import { Menu } from "./components/Menu"`
**Category:** components
**Intent:** Triggered action menu

## Composition

`Menu` is part of a compound component. Use together with: `MenuItem`, `MenuDescriptionItem`, `MenuInfoItem`, `MenuNote`, `MenuSectionTitle`, `MenuBreadcrumbItem`, `MenuSubMenu`, `MenuSectionTitleAccordion`, `MenuEditItem`.

All pieces import from the same path (`./components/Menu`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode (required) — The content for the menu.
- `isOpen`: boolean — If the menu is open.
- `onClose`: (event: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement> | MouseEvent | PointerEvent | TouchEvent) => void (required) — The callback fired when the menu requests to close.
- `onOpen`: (event: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement>) => void (required) — The callback fired when the menu requests to open.
- `position`: "bottomLeft" | "bottomRight" | "topLeft" | "topRight" — The position for the menu.
- `trigger`: ReactElement (required) — The trigger for the menu.
- `triggerRef`: RefObject<HTMLElement> (required) — The trigger ref for the menu.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
