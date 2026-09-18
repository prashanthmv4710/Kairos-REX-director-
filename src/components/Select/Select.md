# Select

**Import:** `import { Select } from "./components/Select"`
**Category:** components
**Intent:** Option-selection dropdown

## Props

- `a11yMagicLabel`: string — The accessible description of the Select that indicates the involvement of an AI agent.
- `children`: ReactNode (required) — The content for the select.
- `disabled`: boolean — If the select is disabled.
- `error`: ReactNode — The error for the select.
- `helperText`: ReactNode — The helper text for the select.
- `id`: string — The id for the select.
- `isMagic`: boolean — If the Select should use visual styles that indicate the involvement of an AI agent.
- `label`: ReactNode (required) — The label for the select.
- `leadingIcon`: ReactNode — The leading icon for the select.
- `onChange`: (event: ChangeEvent<HTMLSelectElement>) => void (required) — The callback fired when the select requests to change.
- `selectProps`: ComponentPropsWithoutRef<"select"> — The props spread to the select's select element.
- `size`: "large" | "small" — The size for the select.
- `value`: string — The value for the select.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
