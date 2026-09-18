# MenubarRadioGroup

**Import:** `import { MenubarRadioGroup } from "./components/Menubar"`
**Category:** components
**Intent:** Desktop menubar (File/Edit/View) with menus, submenus, checkbox/radio items and shortcuts (compound)

## Composition

`MenubarRadioGroup` is part of a compound component. Use together with: `Menubar`, `MenubarGroup`, `MenubarTrigger`, `MenubarSubTrigger`, `MenubarSubContent`, `MenubarItem`, `MenubarLabel`, `MenubarSeparator`, `MenubarShortcut`, `MenubarMenu`, `MenubarPortal`, `MenubarSub`, `MenubarContent`, `MenubarCheckboxItem`, `MenubarRadioItem`.

All pieces import from the same path (`./components/Menubar`). See each sibling's `.md` for its API.

## Props

- `value`: string
- `onValueChange`: (value: string) => void