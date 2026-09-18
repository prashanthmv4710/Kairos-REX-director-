# IntelligentInsight

**Import:** `import { IntelligentInsight } from "./patterns/IntelligentInsight"`
**Category:** patterns
**Intent:** Sidekick AI insight card — brand mark + insight label, optional title/description/attributes and action button

## Props

- `label`: string (required) — Eyebrow/insight text shown next to the Sidekick logo.
- `title`: string — Optional recommendation title. When present, the card uses the expanded recommendation layout.
- `description`: string — Optional body copy shown under the title.
- `attributes`: IntelligentInsightAttribute[] — Attribute rows shown under the description.
- `showButton`: boolean — Show the full-width action button below the label.
- `buttonLabel`: string — Label for the action button.
- `onButtonClick`: MouseEventHandler<HTMLButtonElement> — Fires when the action button is clicked.