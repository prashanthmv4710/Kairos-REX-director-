# OfferBadge

**Import:** `import { OfferBadge } from "./components/OfferBadge"`
**Category:** components
**Intent:** Savings/offer badge for item tiles — selectable cashback offer or applied discount

## Props

- `variant`: "cashback" | "discount"
- `label`: string (required) — Primary message (`cashback`) or saving title (`discount`).
- `subtitle`: string — Second line, `cashback` only.
- `requirementText`: string — Third line — terms/eligibility copy, `cashback` only.
- `linkLabel`: string — Trailing link label. Omit to hide the link.
- `linkHref`: string
- `selected`: boolean — Checkbox state, `cashback` only.
- `onSelectedChange`: (selected: boolean) => void — Called with the next checkbox state, `cashback` only.
- `icon`: ReactNode — Leading icon, `discount` only.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
