# ListGoal

**Import:** `import { ListGoal } from "./patterns/ListGoal"`
**Category:** patterns
**Intent:** Goal list item with status tag, progress bar, AI insight, alert and navigation chevron

## Props

- `goalName`: string (required)
- `sidekick`: boolean
- `statusTag`: boolean
- `tagVariant`: "primary" | "secondary" | "tertiary"
- `tagColor`: TagColor
- `tagLabel`: string
- `navigation`: boolean
- `onNavigate`: () => void
- `progressBar`: boolean
- `progressTitle`: string
- `progressValue`: number
- `progressLabel`: string
- `progressValueLabel`: string
- `content`: boolean
- `children`: ReactNode
- `insight`: boolean
- `insightLabel`: string
- `alert`: boolean
- `alertMessage`: string
- `alertAction`: string
- `onAlertAction`: () => void
- `divider`: boolean