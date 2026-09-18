# HeaderInstructional

**Import:** `import { HeaderInstructional } from "./components/HeaderInstructional"`
**Category:** components
**Intent:** L2-screen context header — large title, optional count/description and trailing chevron or link action

## Props

- `title`: string (required) — Title text. Truncated after 2 lines.
- `count`: number | null — Optional item count rendered as `(N)` after the title.
- `description`: string | null — Optional description below the title. Truncated after 3 lines.
- `bottomPadding`: boolean — Add bottom padding below the content.
- `navigation`: "None" | "Chevron" | "LinkButton" — Trailing action type.
- `trailingLabel`: string — Label for the trailing LinkButton (used only with `navigation="LinkButton"`).
- `onTrailingAction`: () => void — Fires when the chevron / link button is activated.