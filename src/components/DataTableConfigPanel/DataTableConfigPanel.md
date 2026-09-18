# DataTableConfigPanel

**Import:** `import { DataTableConfigPanel } from "./components/DataTableConfigPanel"`
**Category:** components
**Intent:** Right-side overlay for customizing DataTable columns — visibility, pinning, drag-reorder (controlled isOpen)

## Props

- `isOpen`: boolean (required)
- `onClose`: () => void (required)
- `title`: string
- `columns`: DataTableColumnConfig[] (required)
- `onApply`: (columns: DataTableColumnConfig[]) => void (required)