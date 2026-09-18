# Sidebar

**Import:** `import { Sidebar } from "./patterns/Sidebar"`
**Category:** patterns
**Intent:** App navigation sidebar — composable kit (SidebarProvider + parts) or data-driven SidebarShell with hover-expand, lock, resize

## Composition

`Sidebar` is part of a compound component. Use together with: `SidebarProvider`, `SidebarTrigger`, `SidebarRail`, `SidebarHeader`, `SidebarFooter`, `SidebarSeparator`, `SidebarContent`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarGroupContent`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarMenuSub`, `SidebarMenuSubItem`, `SidebarMenuSubButton`, `SidebarInset`, `SidebarShell`.

All pieces import from the same path (`./patterns/Sidebar`). See each sibling's `.md` for its API.

## Props

- `side`: "left" | "right"
- `variant`: "sidebar" | "floating" | "inset"
- `collapsible`: "offcanvas" | "icon" | "none"