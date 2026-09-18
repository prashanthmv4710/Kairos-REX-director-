# CardInteractiveHeader

**Import:** `import { CardInteractiveHeader } from "./components/Card"`
**Category:** components
**Intent:** Structured card surface (header / body / footer)

## Composition

`CardInteractiveHeader` is part of a compound component. Use together with: `CardInteractiveContent`, `CardInteractive`.

All pieces import from the same path (`./components/Card`). See each sibling's `.md` for its API.

## Props

- `title`: ReactNode (required) — The title for the card header. Typography is driven by `size` context.
- `leadingIcon`: string — Decorative Living Design icon name displayed before the title.
- `description`: ReactNode — Optional subtitle rendered below the title as Body/small in a subtle color.
- `trailingIcon`: string — Decorative Living Design icon name displayed after the title.
- `trailing`: ReactNode — Static trailing content, such as a `Tag`, `Badge`, or text. Do not pass

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
