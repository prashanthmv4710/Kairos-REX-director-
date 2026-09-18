// @refresh reset

/**
 * @module DateRangePicker
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
 * For prop API + usage notes, read `DateRangePicker.md` in this folder
 * or run `npm run ld-kit -- show DateRangePicker`.
 */

/**
 * @source AX
 * @ported-from notes/LD-AX-Starter-Kit V1/client/components/ui/DateRangePicker.tsx
 *
 * AX Date Range Picker — paired calendars + Cancel/Apply actions for
 * picking a `{from, to}` range.
 *
 * Adaptation: CSS module → plain `.css` w/ BEM classes; `UNSAFE_style` →
 * `style`; `Button` from the source resolves to `core/Button`.
 */
import * as React from 'react';

import {Button} from '../Button';
import {cx} from '../../common/cx';
import {DatePickerCalendar, type DateRange} from '../DatePickerCalendar';
import {TextField} from '../TextField';
import {CalendarIcon} from '../Icons';
import {VisuallyHidden} from '../VisuallyHidden';

import './DateRangePicker.css';

export type {DateRange};

/** Format a date as `mm/dd/yyyy` for the text inputs. */
function formatDateInput(date?: Date): string {
  if (!date) return '';
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${mm}/${dd}/${date.getFullYear()}`;
}

/** Parse a `mm/dd/yyyy` string into a Date, or `undefined` if invalid. */
function parseDateInput(text: string): Date | undefined {
  const match = text.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return undefined;
  const month = Number(match[1]) - 1;
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month, day);
  if (
    date.getMonth() !== month ||
    date.getDate() !== day ||
    date.getFullYear() !== year
  ) {
    return undefined;
  }
  return date;
}

export interface DateRangePickerProps {
  /** Selected date range. */
  value?: DateRange;
  /** Fired when the user clicks `Apply`. */
  onApply?: (range: DateRange | undefined) => void;
  /** Fired when the user clicks `Cancel`. */
  onCancel?: () => void;
  /** Disable specific dates. */
  disabled?: ((date: Date) => boolean) | Date | Date[];
  /** Minimum selectable date. */
  fromDate?: Date;
  /** Maximum selectable date. */
  toDate?: Date;
  /** Show week numbers. */
  showWeekNumbers?: boolean;
  /** First day of week (0=Sun…6=Sat). */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Default month. */
  defaultMonth?: Date;
  /** Action button and input labels. */
  labels?: {
    cancel?: string;
    apply?: string;
    startDate?: string;
    endDate?: string;
  };
  className?: string;
  style?: React.CSSProperties;
}

export const DateRangePicker = React.forwardRef<
  HTMLDivElement,
  DateRangePickerProps
>((props, ref) => {
  const {
    value,
    onApply,
    onCancel,
    disabled,
    fromDate,
    toDate,
    showWeekNumbers = false,
    weekStartsOn = 0,
    defaultMonth,
    labels = {},
    className,
    style,
  } = props;

  const {
    cancel: cancelLabel = 'Cancel',
    apply: applyLabel = 'Apply',
    startDate: startDateLabel = 'Choose start date (mm/dd/yyyy)',
    endDate: endDateLabel = 'Choose end date (mm/dd/yyyy)',
  } = labels;

  const [tempRange, setTempRange] = React.useState<DateRange | undefined>(value);

  const [startText, setStartText] = React.useState(() => formatDateInput(value?.from));
  const [endText, setEndText] = React.useState(() => formatDateInput(value?.to));

  // Keep the inputs in sync with the selection coming from the calendars.
  React.useEffect(() => {
    setStartText(formatDateInput(tempRange?.from));
    setEndText(formatDateInput(tempRange?.to));
  }, [tempRange]);

  const [currentMonth, setCurrentMonth] = React.useState<Date>(() => {
    if (defaultMonth) return defaultMonth;
    if (value?.from) return value.from;
    return new Date();
  });

  React.useEffect(() => {
    setTempRange(value);
  }, [value]);

  const firstMonth = currentMonth;
  const secondMonth = React.useMemo(() => {
    const m = new Date(currentMonth);
    m.setMonth(m.getMonth() + 1);
    return m;
  }, [currentMonth]);

  const handleDateSelect = React.useCallback((date: Date | undefined) => {
    if (!date) {
      setTempRange(undefined);
      return;
    }
    setTempRange((prev) => {
      if (!prev || (prev.from && prev.to)) return {from: date, to: undefined};
      if (prev.from && !prev.to) {
        if (date < prev.from) return {from: date, to: prev.from};
        return {from: prev.from, to: date};
      }
      return {from: date, to: undefined};
    });
  }, []);

  const handleStartInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value;
      setStartText(text);
      const parsed = parseDateInput(text);
      if (!parsed) return;
      setTempRange((prev) => {
        const to = prev?.to;
        if (to && parsed > to) return {from: parsed, to: undefined};
        return {from: parsed, to};
      });
      setCurrentMonth(parsed);
    },
    [],
  );

  const handleEndInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value;
      setEndText(text);
      const parsed = parseDateInput(text);
      if (!parsed) return;
      setTempRange((prev) => {
        const from = prev?.from;
        if (from && parsed < from) return {from: parsed, to: from};
        return {from, to: parsed};
      });
    },
    [],
  );

  const rangeDescId = React.useId ? React.useId() : React.useMemo(() => `drp-desc-${Math.random().toString(36).slice(2)}`, []);

  const rangeDescription = React.useMemo(() => {
    const fmt = (d: Date) =>
      d.toLocaleDateString(undefined, {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});
    if (tempRange?.from && tempRange?.to) {
      const totalDays = Math.round((tempRange.to.getTime() - tempRange.from.getTime()) / 86400000) + 1;
      return `Current range selected: ${fmt(tempRange.from)} to ${fmt(tempRange.to)}, ${totalDays} day${totalDays === 1 ? '' : 's'}.`;
    }
    if (tempRange?.from) {
      return `Start date selected: ${fmt(tempRange.from)}. No end date selected.`;
    }
    return 'No range selected.';
  }, [tempRange]);

  const handleApply = React.useCallback(
    () => onApply?.(tempRange),
    [onApply, tempRange],
  );

  const handleCancel = React.useCallback(() => {
    setTempRange(value);
    onCancel?.();
  }, [onCancel, value]);

  return (
    <div ref={ref} className={cx('ax-date-range-picker', className)} style={style}>
      <div className="ax-date-range-picker__inputs">
        <TextField
          UNSAFE_className="ax-date-range-picker__input"
          label={startDateLabel}
          value={startText}
          onChange={handleStartInputChange}
          textFieldProps={{placeholder: 'mm/dd/yyyy', inputMode: 'numeric'}}
          trailing={<CalendarIcon />}
        />
        <TextField
          UNSAFE_className="ax-date-range-picker__input"
          label={endDateLabel}
          value={endText}
          onChange={handleEndInputChange}
          textFieldProps={{placeholder: 'mm/dd/yyyy', inputMode: 'numeric'}}
          trailing={<CalendarIcon />}
        />
      </div>

      <div className="ax-date-range-picker__calendars">
        <div className="ax-date-range-picker__calendar">
          <DatePickerCalendar
            mode="range"
            selected={tempRange}
            onSelect={handleDateSelect}
            month={firstMonth}
            onMonthChange={setCurrentMonth}
            disabled={disabled}
            fromDate={fromDate}
            toDate={toDate}
            showWeekNumbers={showWeekNumbers}
            weekStartsOn={weekStartsOn}
            variant="embedded"
          />
        </div>
        <div className="ax-date-range-picker__calendar">
          <DatePickerCalendar
            mode="range"
            selected={tempRange}
            onSelect={handleDateSelect}
            month={secondMonth}
            disabled={disabled}
            fromDate={fromDate}
            toDate={toDate}
            showWeekNumbers={showWeekNumbers}
            weekStartsOn={weekStartsOn}
            variant="embedded"
            hideNavigation
          />
        </div>
      </div>

      <VisuallyHidden id={rangeDescId} aria-live="polite" aria-atomic="true">
        {rangeDescription}
      </VisuallyHidden>

      <div className="ax-date-range-picker__actions">
        <Button variant="secondary" size="medium" onClick={handleCancel}>
          {cancelLabel}
        </Button>
        <Button
          variant="primary"
          size="medium"
          onClick={handleApply}
          disabled={!tempRange?.from || !tempRange?.to}
          aria-describedby={rangeDescId}
        >
          {applyLabel}
        </Button>
      </div>
    </div>
  );
});

DateRangePicker.displayName = 'DateRangePicker';

