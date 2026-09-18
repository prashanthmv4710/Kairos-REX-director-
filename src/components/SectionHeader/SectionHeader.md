# SectionHeader

**Import:** `import { SectionHeader } from "./components/SectionHeader"`
**Category:** components
**Intent:** Titled section header with optional count, description, and trailing link or expand/collapse chevron

## Props

- `size`: "large" | "small" — The size of the section header. Controls the title typography.
- `title`: string (required) — The title text of the section header.
- `headingLevel`: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" — Heading level rendered for the title. Defaults to `h2`, which is correct
- `count`: number — An optional numeric count displayed next to the title in parentheses, e.g. (5).
- `description`: string — An optional description rendered below the title row.
- `trailing`: "none" | "link" | "chevron" — The trailing affordance type.
- `trailingLabel`: string — The label for the trailing LinkButton. Only used when `trailing="link"`.
- `onTrailingClick`: () => void — Callback for the trailing LinkButton click. Only used when `trailing="link"`.
- `expanded`: boolean — Whether the section is expanded. Only used when `trailing="chevron"`.
- `onExpandChange`: (expanded: boolean) => void — Callback fired when the user toggles the chevron. Only used when `trailing="chevron"`.
- `divider`: boolean — Whether to render a Divider below the section header.