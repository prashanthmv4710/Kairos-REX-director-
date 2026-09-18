# PriceBlock

**Import:** `import { PriceBlock } from "./patterns/ItemTile"`
**Category:** patterns
**Intent:** Product tile for carousels (~200px max width)

## Props

- `price`: string (required) — Whole-dollar portion of the main price, e.g. "12"
- `cents`: string (required) — Cents portion of the main price, e.g. "99"
- `prefix`: string — Prefix label before the price.
- `suffix`: string — Suffix label after cents, e.g. "/lb"
- `originalPrice`: string — Strike-through was-price, e.g. "$14.99"
- `strikethroughCaption`: string — Subtle caption that trails the strikethrough original price inline.
- `unitPrice`: string — Per-unit price rendered below the main row, e.g. "12.5¢/oz"
- `captionLabel`: string | string[] — Generic caption label(s) rendered below the pricing block.
- `subscribedPrice`: { price: string; cents: string; color?: AttributeColor; label?: string } — W+ subscribed price shown in the pricing zone via Attribute.
- `earlyAccess`: boolean — When true, renders a standalone [W+ icon] "Early Access" Attribute row.
- `savingsLabel`: string — Label for the Flag small positive pill ("Now" prefix only)
- `savingsAmount`: string — Optional trailing text after the savings pill

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
