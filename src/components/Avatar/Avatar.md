# Avatar

**Import:** `import { Avatar } from "./components/Avatar"`
**Category:** components
**Intent:** User / entity portrait

## Composition

`Avatar` is part of a compound component. Use together with: `AvatarImage`, `AvatarFallback`, `AvatarButton`.

All pieces import from the same path (`./components/Avatar`). See each sibling's `.md` for its API.

## Props

- `a11yLabel`: string
- `a11yLabelledBy`: string
- `color`: "brand" | "brand-subtle" | "neutral" | "agent" | "magic"
- `icon`: ReactNode
- `image`: { src: string; alt?: string }
- `name`: string
- `shape`: "circular" | "square"
- `size`: AvatarSizeInput
- `indicator`: "none" | "badge" | "clock" — Optional overlay indicator.
- `clockState`: "active" | "subtle" — Clock state when indicator='clock'.
- `clockLabel`: string — Custom announced clock status label. Overrides the default "online" / "away" suffix.
- `disabled`: boolean — Applies disabled fill tokens.
- `badgeContent`: number | string — Custom badge content — must be an integer.
- `badgeLabel`: string — Accessible label for the badge count, appended to the root aria-label.
- `children`: ReactNode — Optional override children. When provided, takes precedence over

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
