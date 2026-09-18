# MenubarCheckboxItem

**Import:** `import { MenubarCheckboxItem } from "./components/Menubar"`
**Category:** components
**Intent:** Desktop menubar (File/Edit/View) with menus, submenus, checkbox/radio items and shortcuts (compound)

## Composition

`MenubarCheckboxItem` is part of a compound component. Use together with: `Menubar`, `MenubarGroup`, `MenubarTrigger`, `MenubarSubTrigger`, `MenubarSubContent`, `MenubarItem`, `MenubarLabel`, `MenubarSeparator`, `MenubarShortcut`, `MenubarMenu`, `MenubarPortal`, `MenubarSub`, `MenubarRadioGroup`, `MenubarContent`, `MenubarRadioItem`.

All pieces import from the same path (`./components/Menubar`). See each sibling's `.md` for its API.

## Props

- `checked`: boolean
- `onCheckedChange`: (checked: boolean) => void
- `disabled`: boolean