# MemberPrice

**Import:** `import { MemberPrice } from "./patterns/ItemTile"`
**Category:** patterns
**Intent:** Product tile for carousels (~200px max width)

## Props

- `price`: string (required) — Whole-dollar portion, e.g. "12"
- `cents`: string (required) — Cents portion, e.g. "99"
- `locked`: boolean — When true renders a price-lock indicator beneath the price row.