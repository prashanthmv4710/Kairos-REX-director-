# RichMediaSheet

**Import:** `import { RichMediaSheet } from "./components/RichMediaSheet"`
**Category:** components
**Intent:** Rich media bottom sheet

## Props

- `isOpen`: boolean (required)
- `onClose`: () => void (required)
- `headerVariant`: "title" | "title-subtitle" | "logo-left" | "logo-center" | "inverse" | "none"
- `title`: string
- `subtitle`: string
- `logoSlot`: ReactNode
- `surfaceVariant`: "default" | "brand" | "brand-bold" | "media"
- `children`: ReactNode (required)
- `actions`: ReactNode
- `showFooterDivider`: boolean
- `adjustHeight`: "fixed" | "content"
- `ariaLabel`: string

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
