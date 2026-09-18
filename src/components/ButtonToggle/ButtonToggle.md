# ButtonToggle

**Import:** `import { ButtonToggle } from "./components/ButtonToggle"`
**Category:** components
**Intent:** Disclosure/next button with trailing chevron (isOpen sets aria-expanded) and optional +N count

## Props

- `children`: ReactNode (required) — The content for the button (its label).
- `chevron`: "next" | "updown" — The trailing chevron behavior. `updown` flips the chevron with `isOpen`
- `count`: number — An optional count shown after the label as `+N`. This is dynamic and
- `disabled`: boolean — If the button is disabled.
- `isOpen`: boolean — Whether the toggle is in its open state. With `chevron="updown"` this
- `leading`: ReactNode — The leading content for the button (typically an icon).
- `noFill`: boolean — If the button has no fill on its default (enabled) state — transparent
- `shape`: "pill" | "square" — The shape for the button. `pill` is fully rounded; `square` uses 4px
- `size`: "large" | "medium" | "small" — The size for the button. Controls both text style and height/padding.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
