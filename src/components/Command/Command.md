# Command

**Import:** `import { Command } from "./components/Command"`
**Category:** components
**Intent:** Cmd-K command palette

## Composition

`Command` is part of a compound component. Use together with: `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandSeparator`, `CommandShortcut`, `CommandDialog`.

All pieces import from the same path (`./components/Command`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode (required)
- `onSelect`: (value: string) => void — Optional callback when an item is selected