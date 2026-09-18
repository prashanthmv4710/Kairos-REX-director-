# Toggle

**Import:** `import { Toggle } from "./components/Toggle"`
**Category:** components
**Intent:** Pressable icon/text toggle button holding an on/off state (switch semantics). For a labeled row switch, use Switch

## Props

- `pressed`: boolean — Whether the toggle is pressed (controlled).
- `defaultPressed`: boolean — Default pressed state (uncontrolled).
- `onPressedChange`: (pressed: boolean) => void — Callback when pressed state changes.
- `variant`: "default" | "outline" — Visual variant.
- `size`: "small" | "medium" | "large" — Size of the toggle button.
- `shape`: "square" | "rounded" — Shape of the toggle button.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
