// @refresh reset

/**
 * @module DatePickerCalendar
 *
 * # CRITICAL AGENT DIRECTIVE - HARD STOP
 * 
 * This file is read-only output. Treat it as immutable.
 * 
 * - NEVER edit this file directly.
 * - NEVER apply "quick fixes" in this file.
 * - NEVER reformat, refactor, or rewrite content in place.
 * - NEVER treat this file as the source of truth.
 * 
 * If behavior must change, modify the upstream source of this content (the canonical source), not this copy.
 * 
 * Any direct edits in this file are invalid and must be rejected.
 *
 * For prop API + usage notes, read `DatePickerCalendar.md` in this folder
 * or run `npm run ld-kit -- show DatePickerCalendar`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/DatePickerCalendar.tsx
 *
 * AX Date Picker Calendar — single / multiple / range calendar grid with
 * month navigation. Hand-rolled (no `react-day-picker`) to match the
 * source's exact LD 3.5 styling.
 *
 * Adaptation: CSS module → plain `.css` w/ BEM classes, `UNSAFE_style` →
 * plain `style`, `@/components/icons` chevrons replaced with inlined SVGs.
 */
import * as React from 'react';

import {cx} from '../../common/cx';
import {useAnnounce} from '../A11yAnnouncement';

import './DatePickerCalendar.css';

// ---------------------------------------------------------------------------
// Date helpers (inline — no external deps)
// ---------------------------------------------------------------------------
function _addDays(date: Date, n: number): Date {
  const d = new Date(date); d.setDate(d.getDate() + n); return d;
}
function _startOfWeek(date: Date, weekStartsOn: number): Date {
  const d = new Date(date);
  const diff = (d.getDay() - weekStartsOn + 7) % 7;
  d.setDate(d.getDate() - diff);
  return d;
}
function _endOfWeek(date: Date, weekStartsOn: number): Date {
  const d = _startOfWeek(date, weekStartsOn);
  d.setDate(d.getDate() + 6);
  return d;
}
function _addMonths(date: Date, n: number): Date {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + n, 1);
  const maxDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, maxDay));
  return d;
}
function _sameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}
// ---------------------------------------------------------------------------

export interface DateRange {
  from?: Date;
  to?: Date;
}

export type DatePickerCalendarMode = 'single' | 'multiple' | 'range';
export type DatePickerCalendarVariant = 'standalone' | 'embedded';

export interface DatePickerCalendarProps {
  /** Selected date (single mode convenience). */
  value?: Date;
  /** Callback when a date is selected. */
  onSelect?: (date: Date | undefined) => void;
  /** Selection mode. */
  mode?: DatePickerCalendarMode;
  /** Multiple / range selection state. */
  selected?: Date | Date[] | DateRange;
  /** Disable specific dates. */
  disabled?: ((date: Date) => boolean) | Date | Date[];
  /** Minimum selectable date. */
  fromDate?: Date;
  /** Maximum selectable date. */
  toDate?: Date;
  /** Show week numbers in a leading column. */
  showWeekNumbers?: boolean;
  /** First day of week (0=Sun…6=Sat). */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Default month (uncontrolled). */
  defaultMonth?: Date;
  /** Current month (controlled). */
  month?: Date;
  /** Callback when the visible month changes. */
  onMonthChange?: (month: Date) => void;
  /** `standalone` adds elevation + bg, `embedded` is bare for composition. */
  variant?: DatePickerCalendarVariant;
  /** Hide the prev/next chevrons (e.g. paired calendar). */
  hideNavigation?: boolean;
  /**
   * BCP 47 locale string used for date formatting (e.g. `'en-US'`, `'fr-FR'`).
   * Defaults to the user's browser locale when omitted.
   */
  locale?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M15 18l-6-6 6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 18l6-6-6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DatePickerCalendar = React.forwardRef<
  HTMLDivElement,
  DatePickerCalendarProps
>((props, ref) => {
  const {
    value,
    onSelect,
    mode = 'single',
    selected,
    disabled,
    fromDate,
    toDate,
    showWeekNumbers = false,
    weekStartsOn = 0,
    defaultMonth,
    month: controlledMonth,
    onMonthChange,
    variant = 'standalone',
    hideNavigation = false,
    locale,
    className,
    style,
  } = props;

  const announce = useAnnounce();

  const [internalMonth, setInternalMonth] = React.useState<Date>(
    controlledMonth || defaultMonth || value || new Date(),
  );
  const currentMonth =
    controlledMonth !== undefined ? controlledMonth : internalMonth;

  // Keyboard-focused date — drives roving tabindex
  const [focusedDate, setFocusedDate] = React.useState<Date>(
    () => value || new Date()
  );

  // Sync focused date when value changes externally
  React.useEffect(() => {
    if (value) setFocusedDate(value);
  }, [value]);

  // Announce selection changes via the global live region
  React.useEffect(() => {
    const fmt = (d: Date) =>
      d.toLocaleDateString(locale, {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});

    if (mode === 'single') {
      const val = selected as Date | undefined ?? value;
      if (val) {
        announce.polite(`Screen reader instruction: Use arrow keys to navigate dates on keyboard. Selected: ${fmt(val)}.`);
      }
    } else if (mode === 'range') {
      const rangeSel = selected as DateRange | undefined;
      if (rangeSel?.from && rangeSel?.to) {
        const msPerDay = 86400000;
        const totalDays = Math.round((rangeSel.to.getTime() - rangeSel.from.getTime()) / msPerDay) + 1;
        announce.polite(`Screen reader instruction: Use arrow keys to navigate dates on keyboard. Current range selected: ${fmt(rangeSel.from)} to ${fmt(rangeSel.to)}, ${totalDays} day${totalDays === 1 ? '' : 's'}.`);
      } else if (rangeSel?.from) {
        announce.polite(`Screen reader instruction: Use arrow keys to navigate dates on keyboard. Start date selected: ${fmt(rangeSel.from)}. Select an end date.`);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, value, mode]);

  // Stable ID for aria-labelledby
  const headingId = React.useId ? React.useId() : React.useMemo(() => `dpc-${Math.random().toString(36).slice(2)}`, []);

  const gridRef = React.useRef<HTMLDivElement>(null);
  // Set to true when the user navigates with arrow/page keys so the focus effect
  // knows to force-focus after a month transition (the grid loses DOM focus while
  // the month is swapped, so the contains() check alone is not sufficient).
  const wasKeyboardNav = React.useRef(false);

  const handleMonthChange = React.useCallback(
    (newMonth: Date) => {
      if (controlledMonth === undefined) setInternalMonth(newMonth);
      onMonthChange?.(newMonth);
    },
    [controlledMonth, onMonthChange],
  );

  const goToPreviousMonth = React.useCallback(() => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() - 1);
    handleMonthChange(next);
  }, [currentMonth, handleMonthChange]);

  const goToNextMonth = React.useCallback(() => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    handleMonthChange(next);
  }, [currentMonth, handleMonthChange]);

  const monthYear = React.useMemo(() => {
    const monthName = currentMonth.toLocaleDateString(locale, {month: 'short'});
    return `${monthName} ${currentMonth.getFullYear()}`;
  }, [currentMonth]);

  const dayNames = React.useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (weekStartsOn === 0 || !showWeekNumbers) return days;
    return ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  }, [weekStartsOn, showWeekNumbers]);

  const calendarDays = React.useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startDayOfWeek = firstDay.getDay();
    if (showWeekNumbers) {
      startDayOfWeek = (firstDay.getDay() + 1) % 7;
    } else if (weekStartsOn !== 0) {
      startDayOfWeek = (startDayOfWeek - weekStartsOn + 7) % 7;
    }

    const totalDays = lastDay.getDate();
    const prevMonthTotal = new Date(year, month, 0).getDate();

    const prev: Array<{date: Date; isCurrentMonth: boolean}> = [];
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      prev.push({
        date: new Date(year, month - 1, prevMonthTotal - i),
        isCurrentMonth: false,
      });
    }

    const cur: Array<{date: Date; isCurrentMonth: boolean}> = [];
    for (let day = 1; day <= totalDays; day++) {
      cur.push({date: new Date(year, month, day), isCurrentMonth: true});
    }

    const totalCells = prev.length + cur.length;
    const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    const next: Array<{date: Date; isCurrentMonth: boolean}> = [];
    for (let day = 1; day <= remaining; day++) {
      next.push({date: new Date(year, month + 1, day), isCurrentMonth: false});
    }

    return [...prev, ...cur, ...next];
  }, [currentMonth, weekStartsOn, showWeekNumbers]);

  const weeks = React.useMemo(() => {
    const out: Array<typeof calendarDays> = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      out.push(calendarDays.slice(i, i + 7));
    }
    return out;
  }, [calendarDays]);

  const getWeekNumber = (date: Date): number => {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  const isDateDisabled = React.useCallback(
    (date: Date): boolean => {
      if (fromDate && date < fromDate) return true;
      if (toDate && date > toDate) return true;
      if (typeof disabled === 'function') return disabled(date);
      if (disabled instanceof Date) {
        return date.toDateString() === disabled.toDateString();
      }
      if (Array.isArray(disabled)) {
        return disabled.some((d) => date.toDateString() === d.toDateString());
      }
      return false;
    },
    [disabled, fromDate, toDate],
  );

  const isDateSelected = React.useCallback(
    (date: Date): boolean => {
      if (mode === 'single') {
        const sd = (selected as Date) || value;
        return sd ? date.toDateString() === sd.toDateString() : false;
      }
      if (mode === 'multiple' && Array.isArray(selected)) {
        return selected.some((d) => date.toDateString() === d.toDateString());
      }
      if (
        mode === 'range' &&
        selected &&
        typeof selected === 'object' &&
        'from' in selected
      ) {
        const {from, to} = selected as DateRange;
        if (!from) return false;
        if (!to) return date.toDateString() === from.toDateString();
        return date >= from && date <= to;
      }
      return false;
    },
    [mode, selected, value],
  );

  const isRangeStart = React.useCallback(
    (date: Date): boolean => {
      if (
        mode !== 'range' ||
        !selected ||
        typeof selected !== 'object' ||
        !('from' in selected)
      )
        return false;
      const {from} = selected as DateRange;
      return from ? date.toDateString() === from.toDateString() : false;
    },
    [mode, selected],
  );

  const isRangeEnd = React.useCallback(
    (date: Date): boolean => {
      if (
        mode !== 'range' ||
        !selected ||
        typeof selected !== 'object' ||
        !('from' in selected)
      )
        return false;
      const {from, to} = selected as DateRange;
      if (!from || !to) return false;
      return date.toDateString() === to.toDateString();
    },
    [mode, selected],
  );

  const isInRange = React.useCallback(
    (date: Date): boolean => {
      if (
        mode !== 'range' ||
        !selected ||
        typeof selected !== 'object' ||
        !('from' in selected)
      )
        return false;
      const {from, to} = selected as DateRange;
      if (!from || !to) return false;
      // Use toDateString() comparisons (same as isRangeStart/isRangeEnd) so the
      // endpoints are always excluded regardless of time-component differences.
      const dateStr = date.toDateString();
      if (dateStr === from.toDateString() || dateStr === to.toDateString()) return false;
      return date > from && date < to;
    },
    [mode, selected],
  );

  const isToday = React.useCallback((date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }, []);

  const handleDayClick = React.useCallback(
    (date: Date) => {
      if (isDateDisabled(date)) return;
      onSelect?.(date);
    },
    [isDateDisabled, onSelect],
  );

  // When focused date is outside the visible month, navigate to show it
  React.useEffect(() => {
    if (
      focusedDate.getFullYear() !== currentMonth.getFullYear() ||
      focusedDate.getMonth() !== currentMonth.getMonth()
    ) {
      handleMonthChange(new Date(focusedDate.getFullYear(), focusedDate.getMonth(), 1));
    }
  }, [focusedDate, currentMonth, handleMonthChange]);

  // Move DOM focus to the focused-date button when keyboard navigation changes focusedDate
  // or when the visible month changes (e.g. arrow key crosses a month boundary).
  //
  // Why currentMonth is a dep: when arrow-down crosses into a new month, the month-nav
  // effect fires and updates currentMonth, causing a second render. focusedDate is the
  // same in that second render so this effect would not re-run — without currentMonth as
  // a dep the new month's grid renders without the correct button receiving focus and the
  // browser falls back to document.body.
  //
  // Why wasKeyboardNav: after the month boundary render the grid no longer contains
  // document.activeElement (focus fell to body during the DOM swap), so the contains()
  // check alone would skip the focus call. wasKeyboardNav lets us force-focus after any
  // keyboard-triggered month transition while still preventing stolen focus on mouse
  // clicks and on mount (those never set wasKeyboardNav).
  React.useEffect(() => {
    if (!gridRef.current) return;
    const gridHasFocus = gridRef.current.contains(document.activeElement);
    if (!gridHasFocus && !wasKeyboardNav.current) return;
    const key = focusedDate.toDateString();
    const btn = gridRef.current.querySelector<HTMLButtonElement>(`[data-date="${key}"]`);
    if (btn) {
      if (document.activeElement !== btn) btn.focus();
      wasKeyboardNav.current = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedDate, currentMonth]);

  // Full keyboard navigation per ARIA APG date picker pattern
  const handleGridKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      let next: Date | null = null;

      // Mark as keyboard navigation before any state updates so the focus effect
      // knows to force-focus even after a month-boundary transition clears DOM focus.
      const isNavKey = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End','PageUp','PageDown'].includes(e.key);
      if (isNavKey) wasKeyboardNav.current = true;

      switch (e.key) {
        case 'ArrowLeft':  next = _addDays(focusedDate, -1); break;
        case 'ArrowRight': next = _addDays(focusedDate,  1); break;
        case 'ArrowUp':    next = _addDays(focusedDate, -7); break;
        case 'ArrowDown':  next = _addDays(focusedDate,  7); break;
        case 'Home':       next = _startOfWeek(focusedDate, weekStartsOn); break;
        case 'End':        next = _endOfWeek(focusedDate, weekStartsOn); break;
        case 'PageUp':     next = _addMonths(focusedDate, e.shiftKey ? -12 : -1); break;
        case 'PageDown':   next = _addMonths(focusedDate, e.shiftKey ? 12 : 1); break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (!isDateDisabled(focusedDate)) handleDayClick(focusedDate);
          return;
        default:
          return;
      }

      e.preventDefault();

      // Clamp to fromDate/toDate bounds
      if (fromDate && next < fromDate) next = fromDate;
      if (toDate && next > toDate) next = toDate;

      setFocusedDate(next);
    },
    [focusedDate, weekStartsOn, fromDate, toDate, isDateDisabled, handleDayClick],
  );

  return (
    <div
      ref={ref}
      className={cx(
        'ax-date-picker-calendar',
        variant === 'embedded' && 'ax-date-picker-calendar--embedded',
        className,
      )}
      style={style}
    >
      <div className="ax-date-picker-calendar__header">
        {!hideNavigation && (
          <button
            type="button"
            className="ax-date-picker-calendar__nav ax-date-picker-calendar__nav--prev"
            onClick={goToPreviousMonth}
            aria-label="Previous month"
          >
            <ChevronLeft />
          </button>
        )}
        {/* id wires grid's aria-labelledby to the visible month/year */}
        <div id={headingId} className="ax-date-picker-calendar__month-year"
          aria-live="polite" aria-atomic="true">
          {monthYear}
        </div>
        {!hideNavigation && (
          <button
            type="button"
            className="ax-date-picker-calendar__nav ax-date-picker-calendar__nav--next"
            onClick={goToNextMonth}
            aria-label="Next month"
          >
            <ChevronRight />
          </button>
        )}
      </div>

      <div className="ax-date-picker-calendar__grid">
        {/* Day-name headers — hidden from AT since day buttons carry full date labels */}
        <div
          aria-hidden="true"
          className={cx(
            'ax-date-picker-calendar__day-headers',
            showWeekNumbers && 'ax-date-picker-calendar__day-headers--with-weeks',
          )}
        >
          {showWeekNumbers && (
            <div className="ax-date-picker-calendar__day-header ax-date-picker-calendar__day-header--week-number">
              WM
              <br />
              WK
            </div>
          )}
          {dayNames.map((day, i) => (
            <div key={i} className="ax-date-picker-calendar__day-header">
              {day}
            </div>
          ))}
        </div>

        {/* role="grid" with keyboard navigation */}
        <div
          ref={gridRef}
          role="grid"
          aria-labelledby={headingId}
          className="ax-date-picker-calendar__weeks"
          onKeyDown={handleGridKeyDown}
        >
          {weeks.map((week, weekIndex) => (
            <div
              key={weekIndex}
              role="row"
              className={cx(
                'ax-date-picker-calendar__week',
                showWeekNumbers && 'ax-date-picker-calendar__week--with-weeks',
              )}
            >
              {showWeekNumbers && (
                <div className="ax-date-picker-calendar__week-number" aria-hidden="true">
                  {getWeekNumber(week[0].date)}
                </div>
              )}
              {week.map((day, dayIndex) => {
                const sel = isDateSelected(day.date);
                const dis = isDateDisabled(day.date);
                const today = isToday(day.date);
                const rangeStart = isRangeStart(day.date);
                const rangeEnd = isRangeEnd(day.date);
                const inRange = isInRange(day.date);
                const isFocused = _sameDay(day.date, focusedDate);

                const fullLabel = day.date.toLocaleDateString(locale, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });
                // Compute the action hint for range mode so screen reader users know
                // what clicking this day will do (set start vs set end).
                let rangeActionHint: string | null = null;
                let currentRangeSummary: string | null = null;
                if (mode === 'range' && !dis) {
                  const rangeSel = selected as DateRange | undefined;
                  const pickingEnd = !!(rangeSel?.from && !rangeSel?.to);
                  if (!rangeStart && !rangeEnd) {
                    rangeActionHint = pickingEnd && rangeSel?.from && day.date >= rangeSel.from
                      ? 'Activate to set as new end date'
                      : 'Activate to set as new start date';
                  }
                  // For start/end endpoints, announce the full current range so users
                  // know what they're overwriting when they click.
                  if ((rangeStart || rangeEnd) && rangeSel?.from && rangeSel?.to) {
                    const fmt = (d: Date) => d.toLocaleDateString(locale, {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});
                    currentRangeSummary = `Current range: ${fmt(rangeSel.from)} to ${fmt(rangeSel.to)}`;
                  }
                }

                const a11yLabel = [
                  rangeStart ? 'Selected as start date' : rangeEnd ? 'Selected as end date' : inRange ? 'In range' : sel ? 'Selected' : null,
                  today ? 'Today' : null,
                  fullLabel,
                  showWeekNumbers && sel ? `Walmart Week ${getWeekNumber(day.date)}` : null,
                  rangeActionHint,
                  currentRangeSummary,
                  dis ? 'unavailable' : null,
                ].filter(Boolean).join(', ');

                return (
                  <div key={dayIndex} role="gridcell">
                    <button
                      type="button"
                      data-date={day.date.toDateString()}
                      tabIndex={isFocused ? 0 : -1}
                      className={cx(
                        'ax-date-picker-calendar__day',
                        !day.isCurrentMonth && 'ax-date-picker-calendar__day--outside',
                        sel &&
                          !rangeStart &&
                          !rangeEnd &&
                          !inRange &&
                          'ax-date-picker-calendar__day--selected',
                        dis && 'ax-date-picker-calendar__day--disabled',
                        today && 'ax-date-picker-calendar__day--today',
                        rangeStart && 'ax-date-picker-calendar__day--range-start',
                        rangeEnd && 'ax-date-picker-calendar__day--range-end',
                        inRange && 'ax-date-picker-calendar__day--in-range',
                      )}
                      onClick={() => { setFocusedDate(day.date); handleDayClick(day.date); }}
                      aria-disabled={dis || undefined}
                      aria-selected={sel}
                      aria-label={a11yLabel}
                    >
                      {day.date.getDate()}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
});

DatePickerCalendar.displayName = 'DatePickerCalendar';

