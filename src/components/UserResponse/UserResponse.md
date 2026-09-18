# UserResponse

**Import:** `import { UserResponse } from "./components/UserResponse"`
**Category:** components
**Intent:** Chat bubble for the user's own message in a conversational/AI UI (themeable fill + text color, optional attachment)

## Props

- `children`: ReactNode (required) — The user's message.
- `slot`: ReactNode — Optional rich content rendered beneath the message (e.g. an attachment).
- `caption`: ReactNode — Optional delivery caption rendered below the bubble, right-aligned — e.g.
- `attachments`: ReactNode — File attachment tiles rendered above the prompt bubble, right-aligned.
- `footer`: ReactNode — Custom footer content rendered directly beneath the bubble, right-aligned.
- `onCopy`: (text: string) => void — Called when the user activates the Copy action — receives the current
- `fill`: UserResponseFill — The bubble fill. `textColor` is derived from the mapped pairing.
- `textColor`: UserResponseTextColor — The bubble text color. `fill` is derived from the mapped pairing.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
