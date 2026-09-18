# AccordionHeader

**Import:** `import { AccordionHeader } from "./patterns/Accordion"`
**Category:** patterns
**Intent:** Stacked expandable sections

## Composition

`AccordionHeader` is part of a compound component. Use together with: `Accordion`, `AccordionItem`, `AccordionPanel`.

All pieces import from the same path (`./patterns/Accordion`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode (required)

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
