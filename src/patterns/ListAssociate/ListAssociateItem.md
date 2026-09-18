# ListAssociateItem

**Import:** `import { ListAssociateItem } from "./patterns/ListAssociate"`
**Category:** patterns
**Intent:** List pattern for associate/scheduling lists — adds avatar, monitoring section, attendance tags. Use ListAssociateList + ListAssociateItem

## Composition

`ListAssociateItem` is part of a compound component. Use together with: `ListAssociate`, `ListAssociateList`.

All pieces import from the same path (`./patterns/ListAssociate`). See each sibling's `.md` for its API.

## Props

- `eyebrow`: string
- `title`: string (required)
- `text`: string
- `avatarName`: string — Associate name — used for Avatar initials fallback and a11y label.
- `avatarSrc`: string — Optional image URL for the Avatar.
- `leading`: "empty" | "custom"
- `leadingContent`: ReactNode
- `trailing`: "icon" | "link" | "select"
- `trailingIcon`: ReactNode
- `trailingLink`: { text: string; href?: string; onClick?: () => void }
- `trailingChecked`: boolean
- `onTrailingCheckedChange`: (checked: boolean) => void
- `attributes`: Array<{ label: string; icon?: ReactNode; additionalLabel?: boolean; label2?: string }>
- `insight`: boolean — Show the IntelligentInsight chip.
- `insightLabel`: string — Label for the IntelligentInsight chip.
- `alert`: boolean — Show an Alert message.
- `alertVariant`: AlertVariant — Variant for the Alert.
- `alertText`: string — Text content for the Alert.
- `button`: boolean — Show a full-width action button.
- `buttonLabel`: string — Label for the action button.
- `onButtonClick`: MouseEventHandler<HTMLButtonElement> — Fires when the action button is clicked.
- `content`: boolean — Show the Content / Monitoring-Active section — a ProgressIndicator
- `contentLabel`: string — Section heading.
- `contentProgressVariant`: ProgressIndicatorVariant — ProgressIndicator variant.
- `contentProgressValue`: number — Progress value 0–100.
- `contentProgressLabel`: string — ProgressIndicator label (required when content is true).
- `contentProgressValueLabel`: string — ProgressIndicator value label (required when content is true).
- `contentGoals`: ListAssociateAssignedGoal[] — Assigned goal rows shown below the ProgressIndicator.
- `divider`: boolean
- `footerAction`: ReactNode
- `tag`: "absent" | "tardy" | "unavailable" | "removed" | "do-not-disturb" | "meal" | "ppto" | "not-scheduled" | ListAssociateTagCustom