# Button

**Import:** `import { Button } from "./components/Button"`
**Category:** components
**Intent:** Primary/secondary/tertiary/destructive action

## Composition

`Button` is part of a compound component. Use together with: `ButtonGroup`.

All pieces import from the same path (`./components/Button`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode — The content for the button.
- `isFullWidth`: boolean — If the button is displayed at full width.
- `isLoading`: boolean — If the button is in a loading/progress state.
- `loadingLabel`: string — Visually-hidden label announced by screen readers during the loading state.
- `leading`: ReactNode — The leading content for the button.
- `shape`: "pill" | "square" — The shape for the button. `pill` is fully rounded (default); `square`
- `size`: "large" | "medium" | "small" — The size for the button.
- `trailing`: ReactNode — The trailing content for the button.
- `variant`: "destructive" | "ghost" | "primary" | "secondary" | "tertiary" | "topnav-action-alt" — The variant for the button.
- `href`: string (required) — The href for the button (Anchor only).
- `disabled`: boolean — If the button is disabled (Button only).
- `type`: "button" | "reset" | "submit" — The type for the button (Button only).

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
