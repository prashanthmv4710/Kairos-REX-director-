# Callout

**Import:** `import { Callout } from "./components/Callout"`
**Category:** components
**Intent:** Anchored onboarding / coach-mark overlay

## Composition

`Callout` is part of a compound component. Use together with: `CalloutLink`.

All pieces import from the same path (`./components/Callout`). See each sibling's `.md` for its API.

## Props

- `a11yContentLabel`: string (required) — The accessibility label describing the content of the callout.
- `children`: ReactNode (required) — The content for the callout.
- `isOpen`: boolean — If the callout is open.
- `position`: CalloutPosition — The position for the callout.
- `trigger`: ReactElement (required) — The trigger for the callout.
- `triggerRef`: RefObject<HTMLElement> (required) — The trigger ref for the callout.
- `actions`: ReactNode — Custom actions rendered, right-aligned, in the callout's footer (e.g.
- `closeButtonProps`: CalloutCloseButtonProps — The props spread to the callout's close button.
- `onClose`: (event: MouseEvent) => void (required) — The callback fired when the callout requests to close.
- `stepIndicator`: ReactNode — An optional step indicator (e.g. `"1/3"`) rendered left-aligned in the

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
