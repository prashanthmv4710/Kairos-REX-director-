# PromptComposerSuggestions

**Import:** `import { PromptComposerSuggestions } from "./components/PromptComposer"`
**Category:** components
**Intent:** AI agent chat input with attachments, dictation, slash/mention triggers, char counter, and generate/stop cycle

## Composition

`PromptComposerSuggestions` is part of a compound component. Use together with: `PromptComposerDisclaimer`, `PromptComposer`.

All pieces import from the same path (`./components/PromptComposer`). See each sibling's `.md` for its API.

## Props

- `suggestions`: string[] (required) — The suggestion strings shown as starter chips.
- `onSelect`: (suggestion: string) => void — Fired when a chip is chosen; typically fills the composer.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
