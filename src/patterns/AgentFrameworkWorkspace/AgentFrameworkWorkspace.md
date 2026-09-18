# AgentFrameworkWorkspace

**Import:** `import { AgentFrameworkWorkspace } from "./patterns/AgentFrameworkWorkspace"`
**Category:** patterns
**Intent:** Arrangeable group of AgentFramework cards — drag to split or stack, resize, maximize, animated open/close

## Props

- `items`: AgentFrameworkItem[] (required)
- `onReorder`: (next: AgentFrameworkItem[]) => void (required)
- `activeId`: string | null (required)
- `onActiveChange`: (id: string) => void (required)
- `onClose`: (id: string) => void
- `onAdd`: () => void
- `maxItems`: number
- `allowCloseLast`: boolean
- `framed`: boolean
- `caption`: ReactNode
- `panelPadding`: number
- `disableCloseAnimation`: boolean
- `onExitStart`: (id: string) => void
- `stackSecondFramework`: boolean
- `gapStack`: boolean
- `overlayExpanded`: boolean
- `onExpand`: () => void