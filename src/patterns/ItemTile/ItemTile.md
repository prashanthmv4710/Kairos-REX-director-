# ItemTile

**Import:** `import { ItemTile } from "./patterns/ItemTile"`
**Category:** patterns
**Intent:** Product tile for carousels (~200px max width)

## Props

- `image`: string (required)
- `imageRatio`: "1:1" | "2:3" — Aspect ratio of the product media box in the vertical layouts. Omit to keep
- `name`: string (required)
- `price`: string — Dollar amount. Omit to render an image-only tile with no price/name row.
- `cents`: string
- `originalPrice`: string
- `pricePrefix`: string
- `priceSuffix`: string
- `unitPrice`: string — Per-unit price rendered in the pricing zone.
- `captionLabel`: string | string[] — Generic caption label(s) below the price block. String or array of strings.
- `strikethroughCaption`: string — Subtle caption trailing the strikethrough original price, e.g. "12.5¢/oz"
- `subscribedPrice`: import('./PriceBlock').PriceBlockProps["subscribedPrice"] — W+ subscribed price — shown inline in the pricing zone as an alternative price state.
- `earlyAccess`: boolean — When true renders a standalone W+ Early Access row in the pricing zone.
- `savingsLabel`: string — Label for the small positive Flag pill shown below a "Now" price row.
- `savingsAmount`: string — Optional trailing text after the savings pill, e.g. "$40.00".
- `flag`: { label: string; type: "bestseller" | "deal" | "popular" | "rollback" | "clearance" | "scarcity" | "savings-subtle" | "confidence-bold" | "holiday-member" | "social" | "confidence-alt" | "express" | "neutral" | "positive"; ... } — Promotional flag rendered over the tile image.
- `flagSize`: "small" | "medium" — Size variant applied to promotional flags.
- `flagPosition`: "overlay" | "above" — Position variant for the primary flag.
- `badge`: { label: string; type: "bestseller" | "deal" | "popular" | "rollback" | "clearance" | "scarcity" | "savings-subtle" | "confidence-bold" | "holiday-member" | "social" | "confidence-alt" | "express" | "neutral" | "positive"; ... }
- `badges`: { label: string; type: "bestseller" | "deal" | "popular" | "rollback" | "clearance" | "scarcity" | "savings-subtle" | "confidence-bold" | "holiday-member" | "social" | "confidence-alt" | "express" | "neutral" | "positive"; ... }[] — Flag row rendered above the media when the tile adopts the CTA composition
- `nameLines`: 1 | 2 | 3 — Number of lines the product name is clamped to.
- `hearted`: boolean
- `onHeartChange`: (hearted: boolean) => void
- `benefitsSlot`: ReactNode — Slot for benefit attributes (e.g. "Built for Better", scarcity indicators, brand offers)
- `inventorySlot`: ReactNode — Slot for inventory status (e.g. stock level, aisle location, pickup availability)
- `attributesSlot`: ReactNode — Slot for item descriptor tags (e.g. compliance, content rating, condition, seller tags)
- `fulfillmentSlot`: ReactNode — Slot for fulfillment method indicators (e.g. pickup, express, free delivery, drone).
- `prePriceSlot`: ReactNode — Optional attribute row rendered above the price block.
- `layout`: "vertical" | "horizontal" — Visual layout variant.
- `rating`: number — Star rating value (0–5). Renders RatingDisplay when provided.
- `reviewCount`: string — Review count string passed to RatingDisplay, e.g. "1,234".
- `cartQty`: number — Controlled cart quantity. Renders QuantityStepper when provided.
- `onCartQtyChange`: (qty: number) => void — Called when cart quantity changes via QuantityStepper.
- `actions`: ActionGroupRows — Configurable action rows rendered at the bottom of the horizontal layout
- `actionPlacement`: "inline" | "fullWidth" — Where the horizontal tile's actions live. The two positions are exclusive,
- `flags`: ItemTileBadge[] — Flags rendered in a row above the image, as in the swatch-selection tile.
- `breakpoint`: "base" | "lg" — Responsive breakpoint the tile renders at (Figma: the `breakpoint` variant
- `swatches`: ItemTileSwatch[] — Product variations shown as a swatch row below the image. At most
- `swatchesInteractive`: boolean — Whether the swatches expose interactive states (selected, hover, pressed,
- `selectedSwatchId`: string
- `onSwatchChange`: (swatchId: string) => void
- `showSwatchMore`: boolean — Show the trailing "+" affordance for variations that don't fit the row.
- `onSwatchMoreClick`: () => void
- `swatchMoreLabel`: string — Accessible label for the "+" affordance.
- `options`: ItemTileOption[] — Product options rendered as single-select Chips below the swatches.
- `selectedOptionId`: string
- `onOptionChange`: (optionId: string) => void
- `offers`: ReactNode — Offer content rendered in the content column, below the item details and
- `actionDetails`: ItemTileActionDetails — Stacked Primary + Secondary buttons below Offers and above the `actions`
- `footer`: ReactNode — Trailing full-width slot below the item details, shown by the vertical

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
