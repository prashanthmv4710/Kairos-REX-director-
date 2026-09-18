# ListActionItem

**Import:** `import { ListActionItem } from "./patterns/ListAction"`
**Category:** patterns
**Intent:** List pattern for AI-assisted action queues (eyebrow, attributes, tag, insight, alert, button). Use ListActionList + ListActionItem

## Composition

`ListActionItem` is part of a compound component. Use together with: `ListAction`, `ListActionList`.

All pieces import from the same path (`./patterns/ListAction`). See each sibling's `.md` for its API.

## Props

- `eyebrow`: boolean — Show the eyebrow label above the title.
- `eyebrowLabel`: string — Text for the eyebrow. Only rendered when `eyebrow` is true.
- `title`: string (required)
- `text`: string
- `sidekickAssigned`: boolean — Brands the item with Sidekick styling when true.
- `leading`: "empty" | "custom"
- `leadingContent`: ReactNode
- `trailing`: "icon" | "link" | "select"
- `trailingIcon`: ReactNode — Falls back to ChevronRightIcon.
- `trailingLink`: { text: string; href?: string; onClick?: () => void }
- `trailingChecked`: boolean
- `onTrailingCheckedChange`: (checked: boolean) => void
- `attributes`: Array<{ label: string; icon?: ReactNode; additionalLabel?: boolean; label2?: string }> — Up to 3 Attribute small rows.
- `insight`: boolean — Show the IntelligentInsight chip.
- `insightLabel`: string — Label for the IntelligentInsight chip.
- `messaging`: boolean — Show an Alert message.
- `messagingVariant`: AlertVariant — Variant for the Alert.
- `messagingText`: string — Text content for the Alert.
- `button`: boolean — Show a full-width action button.
- `buttonLabel`: string — Label for the action button.
- `onButtonClick`: MouseEventHandler<HTMLButtonElement> — Fires when the action button is clicked.
- `divider`: boolean — Renders a Divider at the bottom of the item.
- `footerAction`: ReactNode
- `alert`: ReactNode
- `tag`: "unassigned" | "assigned" | "complete" | ListActionTagCustom