# AgentChatSidebarItem

**Import:** `import { AgentChatSidebarItem } from "./patterns/AgentChatSidebar"`
**Category:** patterns

## Composition

`AgentChatSidebarItem` is part of a compound component. Use together with: `AgentChatSidebarSeparator`, `AgentChatSidebarProvider`, `AgentChatSidebar`, `AgentChatSidebarTrigger`, `AgentChatSidebarLockToggle`, `AgentChatSidebarHeader`, `AgentChatSidebarContent`, `AgentChatSidebarSection`, `AgentChatSidebarTextItem`, `AgentChatSidebarSegment`, `AgentChatSidebarFooter`.

All pieces import from the same path (`./patterns/AgentChatSidebar`). See each sibling's `.md` for its API.

## Props

- `children`: string (required)
- `leading`: ReactNode (required) — Leading icon (always shown — it's the collapsed representation).
- `href`: string — Renders the item as a link.
- `isCurrent`: boolean — Marks the current page / active item.
- `tag`: ReactNode — An optional trailing Tag, shown only when expanded.
- `trailing`: ReactNode — Optional trailing content (e.g. an edit / overflow control), expanded only.
- `onClick`: (event: MouseEvent<HTMLElement>) => void
- `target`: string