# SidebarInset

**Import:** `import { SidebarInset } from "./patterns/Sidebar"`
**Category:** patterns
**Intent:** App navigation sidebar — composable kit (SidebarProvider + parts) or data-driven SidebarShell with hover-expand, lock, resize

## Composition

`SidebarInset` is part of a compound component. Use together with: `SidebarProvider`, `SidebarTrigger`, `SidebarRail`, `SidebarHeader`, `SidebarFooter`, `SidebarSeparator`, `SidebarContent`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarGroupContent`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarMenuSub`, `SidebarMenuSubItem`, `SidebarMenuSubButton`, `Sidebar`, `SidebarShell`.

All pieces import from the same path (`./patterns/Sidebar`). See each sibling's `.md` for its API.

## Props

- `as`: "main" | "div" — Override the rendered element. Use `"div"` when embedding in a page that