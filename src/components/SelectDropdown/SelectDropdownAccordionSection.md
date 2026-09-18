# SelectDropdownAccordionSection

**Import:** `import { SelectDropdownAccordionSection } from "./components/SelectDropdown"`
**Category:** components
**Intent:** Composable menu/dropdown primitive (Trigger + Content + Item variants: checkbox/radio/switch/edit). For a value picker, use Select

## Composition

`SelectDropdownAccordionSection` is part of a compound component. Use together with: `SelectDropdownSeparator`, `SelectDropdown`, `SelectDropdownTrigger`, `SelectDropdownSub`, `SelectDropdownRadioGroup`, `SelectDropdownSubTrigger`, `SelectDropdownSubContent`, `SelectDropdownContent`, `SelectDropdownItem`, `SelectDropdownCheckboxItem`, `SelectDropdownRadioItem`, `SelectDropdownLabel`, `SelectDropdownFooter`, `SelectDropdownShortcut`, `SelectDropdownCheckmarkItem`, `SelectDropdownDescriptionItem`, `SelectDropdownDescriptionFavoriteItem`, `SelectDropdownSwitchItem`, `SelectDropdownEditItem`, `SelectDropdownSectionTitle`.

All pieces import from the same path (`./components/SelectDropdown`). See each sibling's `.md` for its API.

## Props

- `title`: ReactNode (required) — Heading shown on the trigger row.
- `open`: boolean
- `defaultOpen`: boolean
- `onOpenChange`: (open: boolean) => void
- `disabled`: boolean
- `children`: ReactNode

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
