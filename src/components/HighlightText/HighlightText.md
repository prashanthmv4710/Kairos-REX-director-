# HighlightText

**Import:** `import { HighlightText } from "./components/HighlightText"`
**Category:** components
**Intent:** Renders text with the case-insensitive query match un-bolded and the rest bold (typeahead convention)

## Props

- `text`: string (required) — The full text to display.
- `query`: string (required) — The search query to highlight within the text. Case-insensitive.
- `boldClassName`: string — Class applied to the non-matching (bold) segments.
- `matchClassName`: string — Class applied to the matching (normal-weight) segment.