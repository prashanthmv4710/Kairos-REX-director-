# SearchResults

**Import:** `import { SearchResults } from "./patterns/SearchResults"`
**Category:** patterns
**Intent:** Composed search results section (search header + filter bar + product list/grid)

## Props

- `query`: string (required) — Initial query string shown in the search field.
- `onQueryChange`: (value: string) => void — Called as the user edits the query in the header SearchBar.
- `filters`: readonly string[] (required) — Filter chip labels rendered into the filter bar.
- `products`: readonly SearchResultProduct[] (required) — Products to render in the result list/grid.
- `layout`: "list" | "grid" — Layout — list (default) or grid.
- `onAddToCart`: (product: SearchResultProduct, index: number) => void — Called when a result's Add to cart is clicked.