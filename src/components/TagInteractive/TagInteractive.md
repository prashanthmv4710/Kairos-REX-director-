# TagInteractive

**Import:** `import { TagInteractive } from "./components/TagInteractive"`
**Category:** components

## Props

- `action`: "dismiss" | "navigate" — The trailing affordance and behavior. `dismiss` shows a remove (×) icon
- `children`: ReactNode (required) — The content for the tag.
- `color`: "brand" | "info" | "negative" | "positive" | "warning" — The color for the tag.
- `disabled`: boolean — If the tag is disabled.
- `leading`: ReactNode — The leading content for the tag (typically an icon).
- `onDismiss`: (event: MouseEvent<HTMLButtonElement>) => void — The callback fired when a `dismiss` tag is dismissed (clicked). The tag
- `size`: "large" | "medium" | "small" — The size for the tag. Controls both text style and padding.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
