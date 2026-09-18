# OrderStatusSection

**Import:** `import { OrderStatusSection } from "./patterns/OrderStatusSection"`
**Category:** patterns
**Intent:** Stack of order-status notifications, each a full card or slim banner (asBanner). For one card, use OrderStatusCard

## Props

- `orders`: readonly OrderStatusEntry[] (required) — Entries to render. Each picks card or banner via `asBanner`.