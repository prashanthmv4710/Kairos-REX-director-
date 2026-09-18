# SelectDropdownCheckmarkItem

**Import:** `import { SelectDropdownCheckmarkItem } from "./components/SelectDropdown"`
**Category:** components
**Intent:** Composable menu/dropdown primitive (Trigger + Content + Item variants: checkbox/radio/switch/edit). For a value picker, use Select

## Composition

`SelectDropdownCheckmarkItem` is part of a compound component. Use together with: `SelectDropdownSeparator`, `SelectDropdown`, `SelectDropdownTrigger`, `SelectDropdownSub`, `SelectDropdownRadioGroup`, `SelectDropdownSubTrigger`, `SelectDropdownSubContent`, `SelectDropdownContent`, `SelectDropdownItem`, `SelectDropdownCheckboxItem`, `SelectDropdownRadioItem`, `SelectDropdownLabel`, `SelectDropdownFooter`, `SelectDropdownShortcut`, `SelectDropdownDescriptionItem`, `SelectDropdownDescriptionFavoriteItem`, `SelectDropdownSwitchItem`, `SelectDropdownEditItem`, `SelectDropdownSectionTitle`, `SelectDropdownAccordionSection`.

All pieces import from the same path (`./components/SelectDropdown`). See each sibling's `.md` for its API.

## Props

- `checked`: boolean — Whether this option is currently selected.
- `disabled`: boolean
- `onSelect`: () => void — Fired when the option is activated.
- `closeOnSelect`: boolean — Close the menu after selection. Defaults to `true`.
- `children`: ReactNode

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
