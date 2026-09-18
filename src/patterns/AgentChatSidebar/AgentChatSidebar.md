# AgentChatSidebar

**Import:** `import { AgentChatSidebar } from "./patterns/AgentChatSidebar"`
**Category:** patterns

## Composition

`AgentChatSidebar` is part of a compound component. Use together with: `AgentChatSidebarSeparator`, `AgentChatSidebarProvider`, `AgentChatSidebarTrigger`, `AgentChatSidebarLockToggle`, `AgentChatSidebarHeader`, `AgentChatSidebarContent`, `AgentChatSidebarItem`, `AgentChatSidebarSection`, `AgentChatSidebarTextItem`, `AgentChatSidebarSegment`, `AgentChatSidebarFooter`.

All pieces import from the same path (`./patterns/AgentChatSidebar`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode
- `'aria-label'`: string — Accessible label for the navigation landmark.
- `resizable`: boolean — Allow the user to drag the right edge to resize the expanded sidebar.
- `defaultWidth`: number — Initial expanded width in px (used when `resizable`).
- `minWidth`: number — Minimum expanded width in px.
- `maxWidth`: number — Maximum expanded width in px.
- `onWidthChange`: (width: number) => void — Called with the new width (px) while resizing.