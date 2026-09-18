# AlertDialog

**Import:** `import { AlertDialog } from "./components/AlertDialog"`
**Category:** components
**Intent:** Confirmation dialog (destructive flows)

## Composition

`AlertDialog` is part of a compound component. Use together with: `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogAction`, `AlertDialogCancel`.

All pieces import from the same path (`./components/AlertDialog`). See each sibling's `.md` for its API.

## Props

- `open`: boolean
- `defaultOpen`: boolean
- `onOpenChange`: (open: boolean) => void
- `children`: ReactNode (required)