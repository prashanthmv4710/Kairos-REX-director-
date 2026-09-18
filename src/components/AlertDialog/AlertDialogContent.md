# AlertDialogContent

**Import:** `import { AlertDialogContent } from "./components/AlertDialog"`
**Category:** components
**Intent:** Confirmation dialog (destructive flows)

## Composition

`AlertDialogContent` is part of a compound component. Use together with: `AlertDialog`, `AlertDialogTrigger`, `AlertDialogAction`, `AlertDialogCancel`.

All pieces import from the same path (`./components/AlertDialog`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode (required) — The body content for the alert dialog.
- `title`: ReactNode (required) — The title for the alert dialog.
- `actions`: ReactNode — The actions (buttons) rendered in the footer area.
- `size`: ModalSize — The size for the alert dialog. Matches Modal's size prop.