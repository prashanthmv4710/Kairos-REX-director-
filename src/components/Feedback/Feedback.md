# Feedback

**Import:** `import { Feedback } from "./components/Feedback"`
**Category:** components
**Intent:** Thumbs up/down rating for an agent response with confirmation and Share-more affordance (value + onChange)

## Props

- `label`: ReactNode — The resting prompt shown beside the rating controls.
- `showLabel`: boolean — Whether to render the resting prompt text beside the rating controls.
- `positiveLabel`: ReactNode — The confirmation copy shown after a positive rating.
- `shareMoreLabel`: ReactNode — The label for the "share more" affordance shown after a negative rating —
- `shareMoreHref`: string — If provided, "share more" renders as a Link to this href. Otherwise it is a
- `onShareMore`: () => void — Fired when the user activates the "share more" affordance.
- `value`: "positive" | "negative" | null — The selected rating — pass to control the component. Leave undefined to let
- `defaultValue`: "positive" | "negative" | null — The initial rating when uncontrolled.
- `onChange`: (rating: "positive" | "negative") => void — Fired when the user rates the response.
- `a11yPositiveLabel`: string — Accessible label for the positive (thumbs up) control.
- `a11yNegativeLabel`: string — Accessible label for the negative (thumbs down) control.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
