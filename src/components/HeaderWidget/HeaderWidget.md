# HeaderWidget

**Import:** `import { HeaderWidget } from "./components/HeaderWidget"`
**Category:** components
**Intent:** Header for a self-contained widget/card — title, count, description, trailing action, optional error alert

## Props

- `title`: string — Widget title text. Truncated after 2 lines.
- `count`: number | null — Optional item count rendered as `(N)` after the title.
- `description`: string | null — Optional description below the title. Truncated after 3 lines.
- `showDivider`: boolean — Render a `core/Divider` at the bottom.
- `navigation`: "None" | "Chevron" | "LinkButton" — Trailing action type.
- `trailingLabel`: string — Label for the trailing LinkButton (used only with `navigation="LinkButton"`).
- `onTrailingAction`: () => void — Fires when the chevron / link button is activated.
- `type`: "Default" | "Error" — Component type. `Error` renders a warning alert below the content.
- `alertMessage`: string — Alert body text (used only with `type="Error"`).
- `alertActionLabel`: string — Alert action label (used only with `type="Error"`).
- `onAlertAction`: () => void — Fires when the alert action is activated.