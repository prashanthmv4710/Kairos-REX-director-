# TablePagination

**Import:** `import { TablePagination } from "./patterns/TablePagination"`
**Category:** patterns
**Intent:** Data-table footer — items-per-page Select, numbered Pagination, and a Page N of M jump. For bare page nav, use Pagination

## Props

- `page`: number (required) — The current page, 1-based.
- `pageCount`: number (required) — The total number of pages.
- `pageSize`: number (required) — The number of rows shown per page.
- `totalItems`: number (required) — The total number of rows across all pages — drives the range readout.
- `pageSizeOptions`: number[] — The selectable page sizes shown in the "Items per page" select.
- `onPageChange`: (page: number) => void (required) — The callback fired when the user requests a different page.
- `onPageSizeChange`: (pageSize: number) => void (required) — The callback fired when the user changes the page size.
- `itemsPerPageLabel`: string — The label shown beside the page-size select.
- `hidePageSize`: boolean — Hide the left-hand items-per-page + range cluster.
- `hidePageJump`: boolean — Hide the right-hand "Page N of M" jump field.
- `navigationLabel`: string — Accessible label for the pagination navigation landmark.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
