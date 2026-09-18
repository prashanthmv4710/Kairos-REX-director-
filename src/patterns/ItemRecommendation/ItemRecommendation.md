# ItemRecommendation

**Import:** `import { ItemRecommendation } from "./patterns/ItemRecommendation"`
**Category:** patterns
**Intent:** AI product recommendation card with item image/price, metrics, location chip, Sidekick insight and actions

## Props

- `eyebrowText`: string
- `tagLabel`: string
- `trailingAction`: "none" | "navigate" | "linkButton" | "checkbox"
- `linkButtonLabel`: string
- `onLinkButtonClick`: () => void
- `checked`: boolean
- `onCheckedChange`: (checked: boolean) => void
- `onNavigate`: () => void
- `imageUrl`: string
- `imageAlt`: string
- `itemName`: string
- `itemColor`: string
- `price`: string
- `wasPrice`: string
- `pricingDetails`: string
- `unitPrice`: string
- `attributes`: Array<{ key: string; value: string }>
- `metrics`: ItemRecommendationMetric[]
- `locationCode`: string
- `additionalLocations`: number
- `onMoreLocations`: () => void
- `insightText`: string
- `showInsight`: boolean
- `alertMessage`: string
- `alertActionLabel`: string
- `onAlertAction`: () => void
- `showAlert`: boolean
- `alternateLabel`: string
- `preferredLabel`: string
- `onAlternate`: () => void
- `onPreferred`: () => void