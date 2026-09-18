# SelectDropdownEditItem

**Import:** `import { SelectDropdownEditItem } from "./components/SelectDropdown"`
**Category:** components
**Intent:** Composable menu/dropdown primitive (Trigger + Content + Item variants: checkbox/radio/switch/edit). For a value picker, use Select

## Composition

`SelectDropdownEditItem` is part of a compound component. Use together with: `SelectDropdownSeparator`, `SelectDropdown`, `SelectDropdownTrigger`, `SelectDropdownSub`, `SelectDropdownRadioGroup`, `SelectDropdownSubTrigger`, `SelectDropdownSubContent`, `SelectDropdownContent`, `SelectDropdownItem`, `SelectDropdownCheckboxItem`, `SelectDropdownRadioItem`, `SelectDropdownLabel`, `SelectDropdownFooter`, `SelectDropdownShortcut`, `SelectDropdownCheckmarkItem`, `SelectDropdownDescriptionItem`, `SelectDropdownDescriptionFavoriteItem`, `SelectDropdownSwitchItem`, `SelectDropdownSectionTitle`, `SelectDropdownAccordionSection`.

All pieces import from the same path (`./components/SelectDropdown`). See each sibling's `.md` for its API.

## Props

- `value`: string — Controlled value.
- `defaultValue`: string — Uncontrolled initial value.
- `onValueChange`: (value: string) => void
- `onSubmit`: (value: string) => void — Fired on Enter. Receives the current value.
- `placeholder`: string
- `disabled`: boolean
- `error`: ReactNode — Error message rendered beneath the field. Also applies the error styling.
- `checked`: boolean — Whether this option is currently selected (shows a trailing checkmark).
- `onSelect`: () => void — Fired when the read-only row is clicked once (gated mode only). Use this to
- `editOnDoubleClick`: boolean — When `true`, the item starts read-only and only becomes editable after a

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
