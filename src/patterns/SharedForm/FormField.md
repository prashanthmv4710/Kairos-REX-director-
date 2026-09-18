# FormField

**Import:** `import { FormField } from "./patterns/SharedForm"`
**Category:** patterns

## Composition

`FormField` is part of a compound component. Use together with: `Form`, `FormItem`, `SharedFormLabel`, `FormControl`, `FormDescription`, `FormMessage`.

All pieces import from the same path (`./patterns/SharedForm`). See each sibling's `.md` for its API.

## Props

- `children`: ReactNode (required)
- `name`: string (required)
- `rules`: ValidationRules