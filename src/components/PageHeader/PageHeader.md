# PageHeader

**Import:** `import { PageHeader } from "./components/PageHeader"`
**Category:** components
**Intent:** Full-bleed page header block (eyebrow label + h1 title + optional description; drop headingLevel when nested under an h1)

## Props

- `section`: string (required) — Small eyebrow label rendered above the title.
- `title`: string (required) — Main heading text.
- `headingLevel`: 1 | 2 | 3 | 4 | 5 | 6 — Heading level used for the title. Default is 1 because PageHeader is
- `description`: string — Supporting description rendered to the right of the title on wide screens.