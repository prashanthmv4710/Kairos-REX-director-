# AgentChatSidebarFooter

**Import:** `import { AgentChatSidebarFooter } from "./patterns/AgentChatSidebar"`
**Category:** patterns

## Composition

`AgentChatSidebarFooter` is part of a compound component. Use together with: `AgentChatSidebarSeparator`, `AgentChatSidebarProvider`, `AgentChatSidebar`, `AgentChatSidebarTrigger`, `AgentChatSidebarLockToggle`, `AgentChatSidebarHeader`, `AgentChatSidebarContent`, `AgentChatSidebarItem`, `AgentChatSidebarSection`, `AgentChatSidebarTextItem`, `AgentChatSidebarSegment`.

All pieces import from the same path (`./patterns/AgentChatSidebar`). See each sibling's `.md` for its API.

## Props

- `type`: "avatar-button"
- `onClick`: () => void
- `avatar`: AvatarProps — The leading avatar (avatar-button / menu-expand types).
- `label`: string — Label beside the avatar / icon (expanded only).
- `menuItems`: AgentChatSidebarMenuEntry[] (required) — Entries shown in the flyout menu — plain links, or an accordion group
- `segment`: AgentChatSidebarSegmentProps — Optional segmented control rendered at the bottom of the menu (e.g. theme).
- `icon`: ReactNode (required)
- `a11yLabel`: string (required)
- `title`: string (required)
- `subtext`: string
- `children`: ReactNode — Expandable content shown above the row.