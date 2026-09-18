# AgentChatSidebarHeader

**Import:** `import { AgentChatSidebarHeader } from "./patterns/AgentChatSidebar"`
**Category:** patterns

## Composition

`AgentChatSidebarHeader` is part of a compound component. Use together with: `AgentChatSidebarSeparator`, `AgentChatSidebarProvider`, `AgentChatSidebar`, `AgentChatSidebarTrigger`, `AgentChatSidebarLockToggle`, `AgentChatSidebarContent`, `AgentChatSidebarItem`, `AgentChatSidebarSection`, `AgentChatSidebarTextItem`, `AgentChatSidebarSegment`, `AgentChatSidebarFooter`.

All pieces import from the same path (`./patterns/AgentChatSidebar`). See each sibling's `.md` for its API.

## Props

- `logo`: ReactNode — Brand mark / logo shown at the start of the header (always visible).
- `title`: string (required) — The app / workspace name.
- `subtitle`: string — A secondary caption shown beneath the title — the "two lines" header
- `tag`: ReactNode — A Tag rendered inline after the title — the "one line, tag" variant.
- `onSearch`: () => void — Render a trailing search button. Clicking it reveals an inline search field
- `onSearchChange`: (value: string) => void — Called on every keystroke in the inline search field.
- `onSearchSubmit`: (value: string) => void — Called when the inline search is submitted (Enter).
- `searchPlaceholder`: string — Placeholder for the inline search field.
- `logoAsToggle`: boolean — When `true` and no  is mounted in the same
- `logoTooltipLabels`: { expand?: string; collapse?: string } — Override the tooltip copy.