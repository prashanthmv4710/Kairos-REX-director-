# FormGroup

**Import:** `import { FormGroup } from "./components/FormGroup"`
**Category:** components
**Intent:** Group related form controls under a shared label

## Props

- `children`: ReactNode (required) — The content for the form group.
- `error`: ReactNode — The error for the form group.
- `helperText`: ReactNode — The helper text for the form group.
- `label`: ReactNode — The label for the form group.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
