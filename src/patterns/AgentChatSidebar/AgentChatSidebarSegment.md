# AgentChatSidebarSegment

**Import:** `import { AgentChatSidebarSegment } from "./patterns/AgentChatSidebar"`
**Category:** patterns

## Composition

`AgentChatSidebarSegment` is part of a compound component. Use together with: `AgentChatSidebarSeparator`, `AgentChatSidebarProvider`, `AgentChatSidebar`, `AgentChatSidebarTrigger`, `AgentChatSidebarLockToggle`, `AgentChatSidebarHeader`, `AgentChatSidebarContent`, `AgentChatSidebarItem`, `AgentChatSidebarSection`, `AgentChatSidebarTextItem`, `AgentChatSidebarFooter`.

All pieces import from the same path (`./patterns/AgentChatSidebar`). See each sibling's `.md` for its API.

## Props

- `items`: SegmentedControlItem[] (required)
- `value`: string (required)
- `onChange`: (value: string) => void (required)
- `'aria-label'`: string