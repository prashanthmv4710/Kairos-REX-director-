# AvatarButton

**Import:** `import { AvatarButton } from "./components/Avatar"`
**Category:** components
**Intent:** User / entity portrait

## Composition

`AvatarButton` is part of a compound component. Use together with: `Avatar`, `AvatarImage`, `AvatarFallback`.

All pieces import from the same path (`./components/Avatar`). See each sibling's `.md` for its API.

## Props

- `size`: AvatarSizeInput
- `shape`: "circular" | "square"
- `color`: "brand" | "brand-subtle" | "neutral" | "agent" | "magic"
- `indicator`: "none" | "badge" | "clock"
- `clockState`: "active" | "subtle"
- `clockLabel`: string
- `badgeContent`: number | string
- `badgeLabel`: string
- `name`: string
- `icon`: ReactNode
- `image`: { src: string; alt?: string }
- `disabled`: boolean
- `'aria-label'`: string — Accessible label for the button (person's name). Status suffix is appended automatically.
- `children`: ReactNode

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- `className` — the canonical hook for adding a CSS class. **Prefer this.**
- ⚠️ `style` is **omitted from this component's TS prop union**. Use `UNSAFE_style` — it passes through at runtime and is the only TS-safe option for inline styles.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases. Use whichever the TS types block (see above); the unblocked one is preferred.
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
