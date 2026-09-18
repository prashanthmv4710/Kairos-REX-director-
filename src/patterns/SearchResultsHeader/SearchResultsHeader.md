# SearchResultsHeader

**Import:** `import { SearchResultsHeader } from "./patterns/SearchResultsHeader"`
**Category:** patterns
**Intent:** Search-results page top bar (back button + SearchBar) for a query-refinement view

## Props

- `query`: string (required) — Current query string shown in the search field.
- `onQueryChange`: (value: string) => void — Called as the user edits the query. When provided the field is controlled.
- `onClear`: () => void — Called when the clear (×) button is pressed.
- `onBack`: () => void — Called when the back button is pressed.
- `placeholder`: string — Placeholder shown when the field is empty.