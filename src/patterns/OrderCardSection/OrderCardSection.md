# OrderCardSection

**Import:** `import { OrderCardSection } from "./patterns/OrderCardSection"`
**Category:** patterns
**Intent:** Renders a stack of order cards, picking the variant per entry via a kind tag. For one card, use OrderCard

## Props

- `orders`: readonly OrderEntry[] (required) — Orders to render. Each picks a variant via `kind`.