# LocationBreadcrumb

**Import:** `import { LocationBreadcrumb } from "./components/LocationBreadcrumb"`
**Category:** components
**Intent:** Hierarchical location path with a trailing item count (wraps core Breadcrumb)

## Props

- `crumbs`: LocationBreadcrumbCrumb[] (required)
- `count`: number — Pass `undefined` to hide.
- `countLabel`: string — Trailing label appended after the count number.
- `countLoading`: boolean
- `'aria-label'`: string