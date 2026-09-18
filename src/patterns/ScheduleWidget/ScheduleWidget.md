# ScheduleWidget

**Import:** `import { ScheduleWidget } from "./patterns/ScheduleWidget"`
**Category:** patterns
**Intent:** Associate shift schedule list (date/role/lunch/store rows with optional Report-an-absence CTA)

## Props

- `shifts`: Shift[]
- `onShiftClick`: (shift: Shift) => void
- `onViewFullSchedule`: () => void
- `onReportAbsence`: () => void