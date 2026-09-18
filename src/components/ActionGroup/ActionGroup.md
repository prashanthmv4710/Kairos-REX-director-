# ActionGroup

**Import:** `import { ActionGroup } from "./components/ActionGroup"`
**Category:** components
**Intent:** Structured primary/secondary (and optional tertiary) action pair with prescribed Button variants and a fixed layout pattern. For generic button rows, use ButtonGroup instead.

## Props

- `layout`: "inline" | "stacked"
- `pattern`: "primary-secondary" | "primary-tertiary" | "secondary-tertiary" | "tertiary-tertiary" | "three-options" | "primary-link" | "secondary-link" | "primary-destructive"
- `size`: ButtonSize — Button size applied to every action in the group.
- `preferredLabel`: string
- `alternateLabel`: string
- `thirdLabel`: string
- `preferredRight`: boolean
- `fullWidth`: boolean
- `onPreferred`: MouseEventHandler<HTMLButtonElement>
- `onAlternate`: MouseEventHandler<HTMLButtonElement>
- `onThird`: MouseEventHandler<HTMLButtonElement>
- `preferredButtonProps`: Omit<ComponentPropsWithoutRef<"button">, "onClick" | "children">
- `alternateButtonProps`: Omit<ComponentPropsWithoutRef<"button">, "onClick" | "children">
- `thirdButtonProps`: Omit<ComponentPropsWithoutRef<"button">, "onClick" | "children">
- `slots`: [ReactNode] | [ReactNode, ReactNode] | [ReactNode, ReactNode, ReactNode] — Slot-based API (Figma: Actions-horizontal / 0-899px, node 89624:55465).
- `rows`: ActionGroupRows — Rows-based API (Figma: node 94623:24683 — Actions-horizontal with 6 row toggles).
- `align`: "leading" | "trailing" — Horizontal alignment of slots within the group.
- `gap`: string — Override the gap between slots with a CSS value or design token.
- `wrap`: boolean — Allow slots to wrap onto a second line on narrow screens.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
