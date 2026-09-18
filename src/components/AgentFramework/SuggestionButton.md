# SuggestionButton

**Import:** `import { SuggestionButton } from "./components/AgentFramework"`
**Category:** components
**Intent:** Floating elevated work-surface card beside an agent chat (header with close/title/actions, scrollable body, optional footer)

## Props

- `children`: ReactNode (required) — The button label.
- `leading`: ReactNode — The leading asset. For the `"icon"` variant pass an `<Icon />` (rendered
- `variant`: "icon" | "image" — The layout treatment.
- `color`: "default" | "brandSubtle" — The color treatment.
- `loading`: boolean — Shows a non-interactive loading placeholder (a spinner for the icon
- `disabled`: boolean — Disables the button.
- `fill`: string — Override the fill. Any CSS color (or design token `var(...)`). Hover and
- `textColor`: string — Override the label (and icon) color. Any CSS color or token. When omitted,
- `radius`: string | number — Override the corner radius. A number is treated as pixels; strings pass
- `onClick`: (event: MouseEvent<HTMLButtonElement>) => void — Fired when the suggestion is chosen.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
