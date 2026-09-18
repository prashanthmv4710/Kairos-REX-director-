# DatePicker

**Import:** `import { DatePicker } from "./components/DatePicker"`
**Category:** components
**Intent:** Calendar-style date selector

## Props

- `locale`: string — The locale for the date picker.
- `a11yLabels`: DatePickerCalendarA11yLabels & { calendarIconButton: string } — The accessible labels for the date picker.
- `disabled`: boolean — If the date picker date field is disabled.
- `error`: ReactNode — The error for the date picker.
- `format`: string — The date string format for the date picker date field.
- `helperText`: ReactNode — The helper text for the date picker date field.
- `id`: string — The id for the date picker.
- `isOpen`: boolean — If the date picker calendar is open.
- `label`: ReactNode (required) — The label for the date picker date field.
- `onClose`: () => void (required) — The callback fired when the date picker calendar requests to close.
- `onOpen`: () => void (required) — The callback fired when the date picker calendar requests to open.
- `onSelect`: (value: Date) => void (required) — The callback fired when a date is selected in the date picker calendar.
- `readOnly`: boolean — If the date picker date field is read only.
- `renderError`: (error: DateFieldError, value: string) => string — The callback fired when date picker date field input is invalid.
- `size`: "large" | "small" — The size for the date picker.
- `textFieldProps`: ComponentPropsWithRef<"input"> — The props spread to the date picker date field's input element.
- `value`: Date — The selected date for the date picker.
- `disabledDateFilter`: DatePickerDisabledDateFilterSignature — The filter function to indicate disabled dates in the date picker.
- `maxDate`: Date — The maximum selectable date in the date picker.
- `minDate`: Date — The minimum selectable date in the date picker.

## Common props

This component pipes props through `applyCommonProps`, so it also accepts:

- ⚠️ `className` and `style` are **omitted from this component's TS prop union** (e.g. `Omit<…, 'className' | 'style'>`). Use `UNSAFE_className` and `UNSAFE_style` — they pass through at runtime and are the only TS-safe options for this component.
- `UNSAFE_className` / `UNSAFE_style` — runtime aliases (the only TS-safe styling hooks here).
- Standard DOM attributes that match the underlying element (`id`, `data-*`, `aria-*`, event handlers, etc.).
