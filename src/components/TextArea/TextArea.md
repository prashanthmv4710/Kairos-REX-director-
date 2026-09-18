# TextArea

**Import:** `import { TextArea } from "./components/TextArea"`
**Category:** components
**Intent:** Multi-line text input

## Props

- `a11yMagicLabel`: string — The accessible description of the Text Area that indicates the involvement of an AI agent.
- `disabled`: boolean — If the text area is disabled.
- `error`: ReactNode — The error for the text area.
- `helperText`: ReactNode — The helper text for the text area.
- `id`: string — The id for the text area.
- `isMagic`: boolean — If the Text Area should use visual styles that indicate the involvement of an AI agent.
- `label`: ReactNode (required) — The label for the text area.
- `maxLength`: number — The maximum length for the text area (includes character counter).
- `maxLengthA11yAnnouncement`: string — The max length accessible announcement for the text area.
- `onChange`: (event: ChangeEvent<HTMLTextAreaElement>) => void (required) — The callback fired when the text area requests to change.
- `readOnly`: boolean — If the text area is read only.
- `size`: "large" | "small" — The size for the text area.
- `textAreaProps`: ComponentPropsWithoutRef<"textarea"> — The props spread to the textarea's textarea element.
- `value`: string — The value for the text area.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
