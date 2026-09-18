# AgentChatSidebarSection

**Import:** `import { AgentChatSidebarSection } from "./patterns/AgentChatSidebar"`
**Category:** patterns

## Composition

`AgentChatSidebarSection` is part of a compound component. Use together with: `AgentChatSidebarSeparator`, `AgentChatSidebarProvider`, `AgentChatSidebar`, `AgentChatSidebarTrigger`, `AgentChatSidebarLockToggle`, `AgentChatSidebarHeader`, `AgentChatSidebarContent`, `AgentChatSidebarItem`, `AgentChatSidebarTextItem`, `AgentChatSidebarSegment`, `AgentChatSidebarFooter`.

All pieces import from the same path (`./patterns/AgentChatSidebar`). See each sibling's `.md` for its API.

## Props

- `title`: string — Section header label (hidden when the sidebar is collapsed).
- `collapsible`: boolean — Make the section header a toggle that expands / collapses its content
- `defaultExpanded`: boolean — Initial expanded state when `collapsible`.
- `children`: ReactNode