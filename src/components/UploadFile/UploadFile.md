# UploadFile

**Import:** `import { UploadFile } from "./components/UploadFile"`
**Category:** components
**Intent:** Drag-and-drop file upload dropzone with browse button and per-file status/progress list (accept, maxFiles)

## Props

- `files`: UploadedFile[]
- `onChange`: (files: UploadedFile[]) => void
- `onCancel`: (id: string) => void
- `onRemove`: (id: string) => void
- `maxFiles`: number
- `accept`: string — File picker accept string.
- `helperText`: string — Helper text shown under the prompt.
- `browseLabel`: string — Browse button label.
- `promptText`: string — Prompt text shown next to the Browse button.
- `dragPromptText`: string — Prompt shown while a file is being dragged over the zone.
- `invalid`: boolean
- `errorMessage`: string
- `disabled`: boolean

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
