# ClockingWidget

**Import:** `import { ClockingWidget } from "./patterns/ClockingWidget"`
**Category:** patterns
**Intent:** Associate clock-in/out summary card — status, role, shift/lunch/store, and Clock in + View timecard actions

## Props

- `clockState`: ClockState
- `role`: string
- `shiftTime`: string
- `lunchTime`: string
- `storeNumber`: string
- `walmartWeek`: string
- `onClockIn`: () => void
- `onViewTimecard`: () => void
- `showIllustration`: boolean — When `false` (default), a placeholder illustration is shown on the
- `illustration`: ReactNode — Custom illustration node rendered in place of the default
- `showMealButton`: boolean — Show a "Start meal" action alongside the clock button.
- `mealButtonLabel`: string
- `onStartMeal`: () => void
- `showMoreButton`: boolean — Show a trailing overflow ("⋯") trigger.
- `onMoreClick`: () => void
- `moreA11yLabel`: string