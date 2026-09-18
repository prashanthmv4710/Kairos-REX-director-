# AgentChatSidebarProvider

**Import:** `import { AgentChatSidebarProvider } from "./patterns/AgentChatSidebar"`
**Category:** patterns

## Composition

`AgentChatSidebarProvider` is part of a compound component. Use together with: `AgentChatSidebarSeparator`, `AgentChatSidebar`, `AgentChatSidebarTrigger`, `AgentChatSidebarLockToggle`, `AgentChatSidebarHeader`, `AgentChatSidebarContent`, `AgentChatSidebarItem`, `AgentChatSidebarSection`, `AgentChatSidebarTextItem`, `AgentChatSidebarSegment`, `AgentChatSidebarFooter`.

All pieces import from the same path (`./patterns/AgentChatSidebar`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode
- `collapsed`: boolean — Controlled collapsed state.
- `defaultCollapsed`: boolean — Initial collapsed state when uncontrolled.
- `onCollapsedChange`: (collapsed: boolean) => void — Called when the collapsed state changes (controlled or uncontrolled).