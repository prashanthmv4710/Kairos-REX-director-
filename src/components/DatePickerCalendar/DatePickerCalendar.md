# DatePickerCalendar

**Import:** `import { DatePickerCalendar } from "./components/DatePickerCalendar"`
**Category:** components
**Intent:** Single/multiple/range calendar grid with month navigation and keyboard support (mode). Standalone calendar of DatePicker

## Props

- `value`: Date — Selected date (single mode convenience).
- `onSelect`: (date: Date | undefined) => void — Callback when a date is selected.
- `mode`: "single" | "multiple" | "range" — Selection mode.
- `selected`: Date | Date[] | DateRange — Multiple / range selection state.
- `disabled`: ((date: Date) => boolean) | Date | Date[] — Disable specific dates.
- `fromDate`: Date — Minimum selectable date.
- `toDate`: Date — Maximum selectable date.
- `showWeekNumbers`: boolean — Show week numbers in a leading column.
- `weekStartsOn`: 0 | 1 | 2 | 3 | 4 | 5 | 6 — First day of week (0=Sun…6=Sat).
- `defaultMonth`: Date — Default month (uncontrolled).
- `month`: Date — Current month (controlled).
- `onMonthChange`: (month: Date) => void — Callback when the visible month changes.
- `variant`: "standalone" | "embedded" — `standalone` adds elevation + bg, `embedded` is bare for composition.
- `hideNavigation`: boolean — Hide the prev/next chevrons (e.g. paired calendar).
- `locale`: string — BCP 47 locale string used for date formatting (e.g. `'en-US'`, `'fr-FR'`).