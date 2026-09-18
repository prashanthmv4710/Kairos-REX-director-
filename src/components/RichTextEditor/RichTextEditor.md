# RichTextEditor

**Import:** `import { RichTextEditor } from "./components/RichTextEditor"`
**Category:** components
**Intent:** Contenteditable rich-text input with a formatting toolbar, char limit and optional AI styling; emits HTML via onChange

## Props

- `a11yMagicLabel`: string — The accessible description of the editor that indicates the involvement of an AI agent.
- `disabled`: boolean — If the editor is disabled.
- `editorProps`: HTMLAttributes<HTMLDivElement> — The props spread to the contenteditable region.
- `error`: ReactNode — The error for the editor. Takes precedence over `warning` and `helperText`.
- `helperText`: ReactNode — The helper text for the editor.
- `id`: string — The id for the editor.
- `isMagic`: boolean — If the editor should use visual styles that indicate the involvement of an AI agent.
- `label`: ReactNode (required) — The label for the editor.
- `maxLength`: number — The maximum length for the editor (includes character counter). Counts plain text characters.
- `maxLengthA11yAnnouncement`: string — The max length accessible announcement for the editor.
- `onChange`: (html: string) => void — The callback fired when the editor content changes. Receives the current HTML string.
- `placeholder`: string — The placeholder shown when the editor is empty.
- `readOnly`: boolean — If the editor is read only.
- `size`: "large" | "small" — The size for the editor.
- `toolbar`: "blockStyle" | "bulletList" | "numberList" | "bold" | "italic" | "code"[] — The formatting controls shown in the toolbar.
- `value`: string — The initial HTML value for the editor.
- `warning`: ReactNode — The warning for the editor. Shown when `error` is not set.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
