# CommandItem

**Import:** `import { CommandItem } from "./components/Command"`
**Category:** components
**Intent:** Cmd-K command palette

## Composition

`CommandItem` is part of a compound component. Use together with: `Command`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandSeparator`, `CommandShortcut`, `CommandDialog`.

All pieces import from the same path (`./components/Command`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode (required)
- `value`: string — The value used for filtering and selection. Defaults to text content.
- `disabled`: boolean
- `onSelect`: () => void