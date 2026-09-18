# CommandDialog

**Import:** `import { CommandDialog } from "./components/Command"`
**Category:** components
**Intent:** Cmd-K command palette

## Composition

`CommandDialog` is part of a compound component. Use together with: `Command`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandSeparator`, `CommandShortcut`.

All pieces import from the same path (`./components/Command`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode (required)
- `open`: boolean
- `onOpenChange`: (open: boolean) => void
- `'aria-label'`: string — Accessible label for the dialog.