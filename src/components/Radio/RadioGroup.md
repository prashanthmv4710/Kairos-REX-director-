# RadioGroup

**Import:** `import { RadioGroup } from "./components/Radio"`
**Category:** components
**Intent:** Single-select choice (share name; group via FormGroup)

## Composition

`RadioGroup` is part of a compound component. Use together with: `RadioGroupItem`.

All pieces import from the same path (`./components/Radio`). See each sibling's `.md` for its API.

## Props

- `value`: string — Controlled selected value.
- `defaultValue`: string — Uncontrolled initial selected value.
- `onValueChange`: (value: string) => void — Fires whenever the selected value changes.
- `disabled`: boolean — Disables every item in the group.
- `required`: boolean — Marks the group as required for form validation.
- `name`: string — Shared `name` attribute. Auto-generated when omitted.
- `orientation`: "horizontal" | "vertical" — Layout direction.