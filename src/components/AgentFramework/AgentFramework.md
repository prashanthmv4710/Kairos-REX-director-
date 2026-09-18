# AgentFramework

**Import:** `import { AgentFramework } from "./components/AgentFramework"`
**Category:** components
**Intent:** Floating elevated work-surface card beside an agent chat (header with close/title/actions, scrollable body, optional footer)

## Props

- `title`: ReactNode (required) — The framework title shown in the header.
- `titleAs`: "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" — Element for the title. Heading variants (`h2`–`h6`) render with heading
- `titleVariant`: "heading" | "body" — Typographic style applied to the title, independent of the semantic
- `titleSize`: "small" | "medium" | "large" — Visual size of the title text. Defaults to `small` for the `heading`
- `a11yLabel`: string — Accessible name for the framework `<section>`, exposing it as a distinct
- `icon`: ReactNode — Optional leading media in the header (icon / avatar).
- `onClose`: () => void — Fired when the leading close (✕) control is pressed. Hidden when omitted.
- `closeLabel`: string — Accessible label for the close control.
- `expanded`: boolean — Whether the framework is expanded (maximized). Drives the expand toggle icon.
- `onToggleExpand`: () => void — Fired when the expand / restore control is pressed. Hidden when omitted.
- `actions`: ReactNode — Extra trailing header actions (e.g. edit, more) placed before expand.
- `children`: ReactNode (required) — The body content. Scrolls (scrollbar on hover) when it overflows.
- `footer`: ReactNode — Footer content — typically the action Buttons. Hidden when omitted.
- `headerProps`: HTMLAttributes<HTMLDivElement> & { draggable?: boolean } — Props spread onto the header bar — use to make the header a drag handle
- `linked`: boolean — Marks this framework as the active reference for the current chat turn — the

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
