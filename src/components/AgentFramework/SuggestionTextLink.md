# SuggestionTextLink

**Import:** `import { SuggestionTextLink } from "./components/AgentFramework"`
**Category:** components
**Intent:** Floating elevated work-surface card beside an agent chat (header with close/title/actions, scrollable body, optional footer)

## Props

- `children`: ReactNode (required) — The button label.
- `leading`: ReactNode — Optional leading icon. When provided, it is rendered at 16 × 16 px to the
- `color`: "default" | "white" — The color treatment.
- `size`: "small" | "medium" — The size treatment.
- `disabled`: boolean — Disables the button.
- `onClick`: (event: MouseEvent<HTMLButtonElement>) => void — Fired when the suggestion is chosen.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
