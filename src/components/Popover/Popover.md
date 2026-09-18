# Popover

**Import:** `import { Popover } from "./components/Popover"`
**Category:** components
**Intent:** Anchored contextual overlay

## Props

- `children`: ReactElement (required) — The trigger for the popover.
- `isOpen`: boolean — If the popover is open.
- `a11yContentLabel`: string — The accessibility label for the popover's content.
- `basePopoverProps`: DetailedHTMLProps<ComponentPropsWithoutRef<"div">, HTMLDivElement> — The props spread to the base popover's element.
- `content`: ReactNode (required) — The content for the popover.
- `hasNubbin`: boolean — If the popover has a nubbin.
- `onClose`: (event: MouseEvent<HTMLButtonElement, MouseEvent> | FocusEvent<HTMLDivElement> | PointerEvent | MouseEvent | TouchEvent | KeyboardEvent) => void (required) — The callback fired when the popover requests to close.
- `position`: "bottomCenter" | "bottomLeft" | "bottomRight" | "left" | "right" | "topCenter" | "topLeft" | "topRight" — The position for the popover.
- `triggerRef`: RefObject<HTMLElement> (required) — The trigger ref for the popover.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
