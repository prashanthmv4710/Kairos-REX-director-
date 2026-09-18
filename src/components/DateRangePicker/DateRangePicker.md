# DateRangePicker

**Import:** `import { DateRangePicker } from "./components/DateRangePicker"`
**Category:** components
**Intent:** Paired calendars plus mm/dd/yyyy inputs and Cancel/Apply for picking a {from,to} date range

## Props

- `value`: DateRange — Selected date range.
- `onApply`: (range: DateRange | undefined) => void — Fired when the user clicks `Apply`.
- `onCancel`: () => void — Fired when the user clicks `Cancel`.
- `disabled`: ((date: Date) => boolean) | Date | Date[] — Disable specific dates.
- `fromDate`: Date — Minimum selectable date.
- `toDate`: Date — Maximum selectable date.
- `showWeekNumbers`: boolean — Show week numbers.
- `weekStartsOn`: 0 | 1 | 2 | 3 | 4 | 5 | 6 — First day of week (0=Sun…6=Sat).
- `defaultMonth`: Date — Default month.
- `labels`: { cancel?: string; apply?: string; startDate?: string; endDate?: string } — Action button and input labels.