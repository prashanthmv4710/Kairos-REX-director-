# PromptComposer

**Import:** `import { PromptComposer } from "./components/PromptComposer"`
**Category:** components
**Intent:** AI agent chat input with attachments, dictation, slash/mention triggers, char counter, and generate/stop cycle

## Composition

`PromptComposer` is part of a compound component. Use together with: `PromptComposerSuggestions`, `PromptComposerDisclaimer`.

All pieces import from the same path (`./components/PromptComposer`). See each sibling's `.md` for its API.

## Props

- `a11yHeading`: string — Visually-hidden heading rendered at the top of the composer so screen
- `variant`: "default" | "inline" — The layout variant.
- `size`: "large" | "small" | "mobile" — The size for the composer (text / icon / padding scale).
- `value`: string — Controlled value of the prompt text.
- `defaultValue`: string — Uncontrolled initial value.
- `onValueChange`: (value: string) => void — Fired on every change of the prompt text.
- `onSend`: (value: string) => void — Fired when the prompt is submitted (send click, or Enter per `submitOn`).
- `placeholder`: string — The placeholder for the input.
- `disabled`: boolean — If the composer is disabled.
- `error`: boolean | ReactNode — Error / negative styling. A node is rendered as a message beneath the
- `busy`: boolean — When the agent is generating, the primary button becomes a Stop button.
- `onStop`: () => void — Fired when the Stop button is pressed (only relevant while `busy`).
- `submitOn`: "enter" | "mod+enter" — Submit behavior. `enter` sends on Enter (Shift+Enter inserts a newline);
- `maxRows`: number — Max rows the textarea grows to before it scrolls. The field hugs its
- `expandable`: boolean — Show an expand / fullscreen toggle for long prompts.
- `onExpand`: () => void — Fired when the expand toggle is pressed.
- `maxLength`: number — Character limit. Sending is blocked while the value is over the limit.
- `showCount`: boolean — Show the character counter (auto-on when `maxLength` is set).
- `attachments`: ReactNode — Attachment tiles rendered in the attachments row.
- `onAttachFiles`: (files: File[]) => void — Fired by the file picker, drag-and-drop, and clipboard paste.
- `allowDrop`: boolean — Enable drag-and-drop attachment. Shows a drop affordance while dragging.
- `onSlashTrigger`: () => void — Fired when `/` is typed at the start of a token (open a command menu).
- `onMentionTrigger`: () => void — Fired when `@` is typed at the start of a token (open a mention menu).
- `recording`: boolean — Mic dictation active state.
- `dictationVariant`: "listening" | "voice-to-text" — How an active dictation session is presented (see
- `onMicToggle`: () => void — Fired when the mic is toggled.
- `showMic`: boolean — Show the mic button.
- `showSelector`: boolean — Show an optional `IconSelector` button between the leading `+` button and
- `selectorIconSelected`: ReactNode — The icon shown when the selector is **selected** (the "on" state).
- `selectorIconUnselected`: ReactNode — The icon shown when the selector is **unselected** (the "off" state).
- `selectorSelected`: boolean — Controlled selected state of the selector.
- `selectorDefaultSelected`: boolean — Default selected state when uncontrolled.
- `onSelectorChange`: (selected: boolean) => void — Fired when the selector's selected state changes.
- `selectorLabel`: string — Accessible label for the selector.
- `addMenu`: ReactNode — Content rendered by the leading `+` button (e.g. a Menu of add actions).
- `onAdd`: () => void — Fired when the built-in `+` add button is pressed (no `addMenu`). When
- `toolbarStart`: ReactNode — Tools / context pill(s) placed after the `+` button (e.g. ButtonToggle).
- `toolbarEnd`: ReactNode — Mode selector(s) placed before the mic + send cluster.
- `suggestions`: ReactNode — Suggestion starter chips shown above the input (empty state).
- `sendLabel`: string — Accessible label for the send button.
- `stopLabel`: string — Accessible label for the stop button.
- `addLabel`: string — Accessible label for the add button.
- `micLabel`: string — Accessible label for the mic button.
- `dictationLang`: string — BCP-47 language tag used for built-in voice-to-text dictation when the

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
