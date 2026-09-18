# SelectDropdownDescriptionItem

**Import:** `import { SelectDropdownDescriptionItem } from "./components/SelectDropdown"`
**Category:** components
**Intent:** Composable menu/dropdown primitive (Trigger + Content + Item variants: checkbox/radio/switch/edit). For a value picker, use Select

## Composition

`SelectDropdownDescriptionItem` is part of a compound component. Use together with: `SelectDropdownSeparator`, `SelectDropdown`, `SelectDropdownTrigger`, `SelectDropdownSub`, `SelectDropdownRadioGroup`, `SelectDropdownSubTrigger`, `SelectDropdownSubContent`, `SelectDropdownContent`, `SelectDropdownItem`, `SelectDropdownCheckboxItem`, `SelectDropdownRadioItem`, `SelectDropdownLabel`, `SelectDropdownFooter`, `SelectDropdownShortcut`, `SelectDropdownCheckmarkItem`, `SelectDropdownDescriptionFavoriteItem`, `SelectDropdownSwitchItem`, `SelectDropdownEditItem`, `SelectDropdownSectionTitle`, `SelectDropdownAccordionSection`.

All pieces import from the same path (`./components/SelectDropdown`). See each sibling's `.md` for its API.

## Props

- `title`: ReactNode (required) — Primary label.
- `description`: ReactNode — Secondary descriptive text shown beneath the title.
- `icon`: ReactNode — Leading media — defaults to a placeholder icon inside a round avatar.
- `checked`: boolean — Whether this option is currently selected.
- `disabled`: boolean
- `onSelect`: () => void
- `closeOnSelect`: boolean — Close the menu after selection. Defaults to `true`.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
