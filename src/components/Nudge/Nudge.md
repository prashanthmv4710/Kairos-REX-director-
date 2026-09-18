# Nudge

**Import:** `import { Nudge } from "./components/Nudge"`
**Category:** components
**Intent:** Coaching hint / reminder

## Props

- `actions`: ReactNode — The actions for the nudge.
- `children`: ReactNode (required) — The content for the nudge.
- `closeButtonProps`: NudgeCloseButtonProps — The props spread to the nudge's close button.
- `leadingIconLabel`: string — Accessible label for the leading icon slot. Pass when the icon is
- `leading`: ReactNode — The leading content for the nudge.
- `onClose`: (event: MouseEvent<HTMLButtonElement>) => void — The callback fired when the nudge requests to close.
- `title`: ReactNode (required) — The title for the nudge.
- `titleAs`: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" — Heading level rendered for the title. Use when the nudge title should

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
