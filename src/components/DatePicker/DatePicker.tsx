'use client';
// @refresh reset

/**
 * @module DatePicker
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
 * For prop API + usage notes, read `DatePicker.md` in this folder
 * or run `npm run ld-kit -- show DatePicker`.
 */

import * as React from 'react';
import {useA11yAnnouncement} from '../A11yAnnouncement';
import {FocusTrap} from '../FocusTrap';
import {IconButton, IconButtonButtonProps} from '../IconButton';
import {TextField} from '../TextField';
import {Divider} from '../Divider';
import {FormHelperText} from '../Form';
import {Body} from '../Text';

import {cx} from '../../common/cx';
import {applyCommonProps, useStableId, invariant, mergeRefs, MergeRefsItem} from '../../common/helpers';
import {
  CalendarIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from '../Icons';
import {useCSSTransition} from '../../hooks/hooks';
import './DatePicker.css';
import {
  formatDate as dfFormat,
  parseDate as dfParse,
  isValid,
  differenceInCalendarDays,
  isSameDay,
  isToday as isTodayDateFns,
  lastDayOfMonth,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from '../../common/dateFns';

// ---------------------------------------------------------------------------
// BaseDatePicker (inlined sub-component)
// ---------------------------------------------------------------------------

export interface BaseDatePickerProps
  extends Omit<
      React.ComponentPropsWithoutRef<'div'>,
      'className' | 'onSelect' | 'style'
    >,
    DatePickerCommonProps {
  /**
   * The accessible labels for the date picker.
   *
   * @default {
   *   calendarDaySelected: "Selected",
   *   calendarDayToday: "Today",
   *   calendarIconButton: `${label} calendar picker`,
   *   calendarNextMonthButton: "Next month",
   *   calendarPreviousMonthButton: "Previous month",
   * }
   */
  a11yLabels?: DatePickerCalendarA11yLabels & {
    calendarIconButton: string;
  };
  /**
   * If the date picker date field is disabled.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * The error for the date picker.
   */
  error?: React.ReactNode;
  /**
   * The date string format for the date picker date field.
   *
   * @default "MM/dd/yyyy"
   */
  format?: string;
  /**
   * The helper text for the date picker date field.
   */
  helperText?: React.ReactNode;
  /**
   * The id for the date picker.
   */
  id?: string;
  /**
   * If the date picker calendar is open.
   *
   * @default false
   */
  isOpen?: boolean;
  /**
   * The label for the date picker date field.
   */
  label: React.ReactNode;
  /**
   * The callback fired when the date picker calendar requests to close.
   */
  onClose: () => void;
  /**
   * The callback fired when the date picker calendar requests to open.
   */
  onOpen: () => void;
  /**
   * The callback fired when a date is selected in the date picker calendar.
   */
  onSelect: (value?: Date) => void;
  /**
   * If the date picker date field is read only.
   *
   * @default false
   */
  readOnly?: boolean;
  /**
   * The callback fired when date picker date field input is invalid.
   *
   * @default (error: DateFieldError) => {
   *   if (error instanceof DateFieldParseError) {
   *     return `Use the required format ${props.format}`;
   *   } else {
   *     return "Enter an available date within range";
   *   }
   */
  renderError?: (error: DateFieldError, value: string) => string;
  /**
   * The size for the date picker.
   *
   * @default "large"
   */
  size?: DatePickerDateFieldSize;
  /**
   * The props spread to the date picker date field's input element.
   *
   * @default {}
   */
  textFieldProps?: React.ComponentPropsWithRef<'input'>;
  /**
   * The selected date for the date picker.
   */
  value?: Date;
}

/**
 * @private
 */
export const BaseDatePicker: React.FunctionComponent<BaseDatePickerProps> = (
  props
) => {
  const {
    a11yLabels,
    disabledDateFilter,
    error: errorProp,
    format = 'MM/dd/yyyy',
    helperText,
    id,
    isOpen = false,
    label,
    maxDate,
    minDate,
    onClose,
    onOpen,
    onSelect,
    renderError,
    size,
    value,
    ...rest
  } = props;

  const {calendarDayFormatter} = useLocalizedFormatters();
  const [error, setError] = React.useState<string>('');
  const defaultRenderError = React.useCallback(
    (err: DateFieldError) => {
      if (err instanceof DateFieldParseError) {
        return `Use the required format ${format}`;
      }
      return 'Enter an available date within range';
    },
    [format]
  );
  const {formatDate, validateValue} = useDateField({
    disabledDateFilter,
    format,
    maxDate,
    minDate,
    onSelect,
    renderError: renderError ?? defaultRenderError,
    setError,
  });

  const [dateFieldValue, setDateFieldValue] = React.useState(
    value ? formatDate(value) : ''
  );

  const iconButtonA11yLabel = React.useMemo(
    () =>
      `${a11yLabels?.calendarIconButton || `${label} calendar picker`}${
        value
          ? `, ${
              a11yLabels?.calendarDaySelected ?? 'Selected'
            } ${calendarDayFormatter.format(value)}`
          : ''
      }`,
    [a11yLabels, calendarDayFormatter, label, value]
  );

  React.useEffect(() => {
    setDateFieldValue(value ? formatDate(value) : '');
    setError('');
  }, [formatDate, setDateFieldValue, value]);

  const triggerRef = React.useRef(null);
  const dateFieldLabelId = useStableId(id);
  const calendarId = useStableId();

  return (
    <div className={'ld-datepicker-container'}>
      <DatePickerDateField
        error={errorProp ?? error}
        helperText={helperText}
        iconButtonProps={{
          'aria-controls': calendarId,
          'aria-expanded': isOpen,
          a11yLabel: iconButtonA11yLabel,
          onClick: () => (isOpen ? onClose() : onOpen()),
          ref: triggerRef,
        }}
        id={dateFieldLabelId}
        label={label}
        onBlur={() => validateValue(dateFieldValue)}
        onChange={(event) => setDateFieldValue(event.target.value)}
        size={size}
        value={dateFieldValue}
        {...rest}
      />
      <DatePickerCalendar
        a11yLabelledBy={dateFieldLabelId}
        a11yLabels={
          a11yLabels
            ? {
                calendarDaySelected: a11yLabels.calendarDaySelected,
                calendarDayToday: a11yLabels.calendarDayToday,
                calendarNextMonthButton: a11yLabels.calendarNextMonthButton,
                calendarPreviousMonthButton:
                  a11yLabels.calendarPreviousMonthButton,
              }
            : undefined
        }
        error={errorProp ?? error}
        disabledDateFilter={disabledDateFilter}
        id={calendarId}
        isOpen={isOpen}
        maxDate={maxDate}
        minDate={minDate}
        onSelect={onSelect}
        onClose={onClose}
        size={size}
        triggerRef={triggerRef}
        value={value}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// DatePicker.service (inlined sub-component)
// ---------------------------------------------------------------------------

export interface DateFieldOptions extends DatePickerCommonProps {
  format: string;
  onSelect?: (value?: Date) => void;
  renderError: (error: DateFieldError, value: string) => string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export const useDateField = ({
  disabledDateFilter,
  format: formatString,
  maxDate,
  minDate,
  onSelect,
  renderError,
  setError,
}: DateFieldOptions) => {
  const formatDate = React.useCallback(
    (date: Date) => dfFormat(date, formatString),
    [formatString]
  );

  const validateValue = React.useCallback(
    (value: string) => {
      if (!value) {
        onSelect?.();
        return;
      }

      const parsedDate = dfParse(value, formatString);

      if (!isValid(parsedDate)) {
        setError(renderError(new DateFieldParseError(), value));
        onSelect?.();
        return;
      }

      if (
        (minDate && differenceInCalendarDays(parsedDate, minDate) < 0) ||
        (maxDate && differenceInCalendarDays(parsedDate, maxDate) > 0)
      ) {
        setError(renderError(new DateFieldOutOfRangeError(), value));
        onSelect?.();
        return;
      }

      if (disabledDateFilter?.(parsedDate)) {
        setError(renderError(new DateFieldDisabledDayError(), value));
        onSelect?.();
        return;
      }

      setError('');
      onSelect?.(parsedDate);
    },
    [
      disabledDateFilter,
      formatString,
      maxDate,
      minDate,
      onSelect,
      renderError,
      setError,
    ]
  );

  return {
    formatDate,
    validateValue,
  };
};

// ---------------------------------------------------------------------------
// DatePickerErrors (inlined sub-component)
// ---------------------------------------------------------------------------

export class DateFieldDisabledDayError extends Error {}
export class DateFieldParseError extends Error {}
export class DateFieldOutOfRangeError extends Error {}

export type DateFieldError =
  | DateFieldDisabledDayError
  | DateFieldParseError
  | DateFieldOutOfRangeError;

function usePointerOutside(refs: React.RefObject<HTMLElement | null>[], callback: () => void) {
  const savedCallback = React.useRef(callback);
  React.useEffect(() => { savedCallback.current = callback; });

  const savedRefs = React.useRef(refs);
  React.useEffect(() => { savedRefs.current = refs; });

  React.useEffect(() => {
    const handler = (e: PointerEvent) => {
      if (savedRefs.current.some(r => r.current?.contains(e.target as Node))) return;
      savedCallback.current();
    };
    document.addEventListener('pointerup', handler);
    return () => document.removeEventListener('pointerup', handler);
  }, []);
}

function useOnKeyDown(keys: string[], callback: () => void) {
  const savedCallback = React.useRef(callback);
  React.useEffect(() => { savedCallback.current = callback; });

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (keys.includes(e.key)) savedCallback.current(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

// ---------------------------------------------------------------------------
// BaseDatePickerCalendar (inlined sub-component)
// ---------------------------------------------------------------------------

export interface DatePickerCalendarA11yLabels {
  /**
   * The accessible label for a selected date picker calendar day.
   *
   * @default "Selected"
   */
  calendarDaySelected: string;
  /**
   * The accessible label for the date picker calendar day representing today.
   *
   * @default "Today"
   */
  calendarDayToday: string;
  /**
   * The accessible label for the date picker calendar next month button
   *
   * @default "Next month"
   */
  calendarNextMonthButton: string;
  /**
   * The accessible label for the date picker calendar previous month button
   *
   * @default "Previous month"
   */
  calendarPreviousMonthButton: string;
}

export interface BaseDatePickerCalendarProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onSelect'>,
    DatePickerCommonProps {
  /**
   * The accessible labels for the date picker calendar.
   */
  a11yLabels?: DatePickerCalendarA11yLabels;
  /**
   * The error for the date picker calendar.
   */
  error?: React.ReactNode;
  /**
   * The callback fired when a date is selected in the date picker calendar.
   */
  onSelect: (date: Date) => void;
  /**
   * The callback fired when the date picker calendar requests to close.
   */
  onClose: () => void;
  /**
   * The size for the date picker.
   *
   * @default "large"
   */
  size?: DatePickerDateFieldSize;
  /**
   * The trigger ref for the date picker calendar.
   */
  triggerRef: React.RefObject<HTMLElement>;
  /**
   * The selected date for the date picker calendar.
   */
  value?: Date;
}

/**
 * @private
 */
export const BaseDatePickerCalendar = React.forwardRef<
  HTMLDivElement,
  BaseDatePickerCalendarProps
>((props, ref) => {
  const {
    a11yLabels,
    className,
    disabledDateFilter,
    error,
    maxDate,
    minDate,
    onClose,
    onSelect,
    size = 'large',
    triggerRef,
    value: selectedDate,
    ...rest
  } = props;

  const {
    calendarFocus,
    calendarState: {
      calendarLabels: {calendarDayLabels, dayOfWeekLabels, monthLabel},
      focusedDate,
      isCalendarDayFocused,
      isNextMonthButtonDisabled,
      isPreviousMonthButtonDisabled,
    },
  } = useCalendar({
    maxDate,
    minDate,
    selectedDate,
  });

  const {
    getA11yLabel: getCalendarDayA11yLabel,
    getIsDisabled,
    getIsFocused,
    getIsSelected,
    getIsToday,
  } = useCalendarDayUtilities({
    calendarDaySelectedA11yLabel: a11yLabels?.calendarDaySelected,
    calendarDayTodayA11yLabel: a11yLabels?.calendarDayToday,
    disabledDateFilter,
    focusedDate,
    maxDate,
    minDate,
    selectedDate,
  });
  const calendarRef = React.useRef<HTMLDivElement>(null);
  const monthHeadingId = useStableId();

  usePointerOutside([calendarRef, triggerRef], () => onClose());
  useOnKeyDown(['Esc', 'Escape'], () => onClose());

  return (
    <div
      className={cx('ld-datepicker-basedatepickercalendar-container', size === 'large' && 'ld-datepicker-basedatepickercalendar-large', size === 'small' && 'ld-datepicker-basedatepickercalendar-small', className)}
      ref={mergeRefs(ref, calendarRef)}
      role="application"
      {...rest}
    >
      <FocusTrap onDeactivation={() => triggerRef.current?.focus()}>
        {!!error && (
          <FormHelperText
            hasError={!!error}
            UNSAFE_className={'ld-datepicker-basedatepickercalendar-errorText'}
          >
            {error}
          </FormHelperText>
        )}
        <DatePickerCalendarNavigation
          monthHeadingId={monthHeadingId}
          nextMonthButtonProps={{
            a11yLabel: a11yLabels?.calendarNextMonthButton,
            onClick: () => {
              calendarFocus.focusNextMonth({
                focusCalendarDay: false,
                shouldAnnounce: true,
              });
            },
            disabled: isNextMonthButtonDisabled,
          }}
          previousMonthButtonProps={{
            a11yLabel: a11yLabels?.calendarPreviousMonthButton,
            onClick: () => {
              calendarFocus.focusPreviousMonth({
                focusCalendarDay: false,
                shouldAnnounce: true,
              });
            },
            disabled: isPreviousMonthButtonDisabled,
          }}
          textLabel={monthLabel}
        />
        <Divider />
        <DatePickerCalendarMonth>
          <DatePickerCalendarHeader textLabels={dayOfWeekLabels} />
          <DatePickerCalendarBody
            aria-labelledby={monthHeadingId}
            onKeyDown={(event) => {
              const {key} = event;

              const keyDownHandlerMap = {
                ArrowDown: calendarFocus.focusNextWeek,
                ArrowLeft: calendarFocus.focusPreviousDay,
                ArrowRight: calendarFocus.focusNextDay,
                ArrowUp: calendarFocus.focusPreviousWeek,
                Home: calendarFocus.focusFirstDayOfWeek,
                End: calendarFocus.focusLastDayOfWeek,
                PageUp: calendarFocus.focusPreviousMonth,
                PageDown: calendarFocus.focusNextMonth,
              };

              if (!Object.keys(keyDownHandlerMap).includes(key)) {
                return;
              }

              event.preventDefault();
              keyDownHandlerMap[key as keyof typeof keyDownHandlerMap]({
                focusCalendarDay: true,
              });
            }}
          >
            {calendarDayLabels.map((week, weekIndex) => {
              return (
                <DatePickerCalendarWeek key={weekIndex}>
                  {week.map((day, index) => {
                    // Render empty gridcell for filler days to keep row alignment
                    if (day === null) {
                      return <DatePickerCalendarEmptyDay key={index} />;
                    }

                    const date = createYearSafeDate(
                      focusedDate.getFullYear(),
                      focusedDate.getMonth(),
                      day
                    );

                    const isDisabled = getIsDisabled(date);
                    const isFocusedDate = getIsFocused(date);
                    const isSelectedDate = getIsSelected(date);
                    const isToday = getIsToday(date);
                    const a11yLabel = getCalendarDayA11yLabel({
                      date,
                      isSelected: isSelectedDate,
                      isToday,
                    });

                    return (
                      <DatePickerCalendarSingleDay
                        a11yLabel={a11yLabel}
                        disabled={isDisabled}
                        isFocused={isFocusedDate && isCalendarDayFocused}
                        isSelected={isSelectedDate}
                        isToday={isToday}
                        key={index}
                        onClick={
                          isDisabled
                            ? undefined
                            : () => {
                                onSelect(date);
                                onClose();
                              }
                        }
                        tabIndex={isFocusedDate ? 0 : -1}
                      >
                        {day}
                      </DatePickerCalendarSingleDay>
                    );
                  })}
                </DatePickerCalendarWeek>
              );
            })}
          </DatePickerCalendarBody>
        </DatePickerCalendarMonth>
      </FocusTrap>
    </div>
  );
});

// ---------------------------------------------------------------------------
// DatePickerCalendar.service (inlined sub-component)
// ---------------------------------------------------------------------------

export interface FocusFunctionOptions {
  focusCalendarDay: boolean;
  shouldAnnounce?: boolean;
}

export const useCalendar = ({
  maxDate,
  minDate,
  selectedDate,
}: {
  maxDate?: Date;
  minDate?: Date;
  selectedDate?: Date;
}) => {
  const {announceAssertive} = useA11yAnnouncement();
  const {dayOfWeekFormatter, monthLabelFormatter} = useLocalizedFormatters();

  const constrainDate = React.useCallback(
    (date: Date) => {
      if (maxDate && differenceInCalendarDays(date, maxDate) > 0) {
        return maxDate;
      }
      if (minDate && differenceInCalendarDays(date, minDate) < 0) {
        return minDate;
      }
      return date;
    },
    [maxDate, minDate]
  );

  const [focusedDate, setFocusedDate] = React.useState(
    constrainDate(selectedDate ?? new Date())
  );
  const [isCalendarDayFocused, setIsCalendarDayFocused] = React.useState(true);
  const [shouldAnnounceMonth, setShouldAnnounceMonth] = React.useState(false);

  const constrainedSetFocusedDate = React.useCallback(
    (dateToFocus: Date) => {
      setFocusedDate(constrainDate(dateToFocus));
    },
    [constrainDate]
  );

  React.useEffect(() => {
    if (selectedDate) {
      constrainedSetFocusedDate(selectedDate);
    }
  }, [constrainedSetFocusedDate, selectedDate]);

  const focusFunctionFactory = React.useCallback(
    (relativeDateFn: (date: Date) => Date) => (focusCalendarDay: boolean) => {
      const nextFocusedDate = relativeDateFn(focusedDate);
      setIsCalendarDayFocused(focusCalendarDay);
      constrainedSetFocusedDate(nextFocusedDate);
    },
    [constrainedSetFocusedDate, focusedDate]
  );

  const focusNextDay = React.useCallback(
    ({focusCalendarDay}: FocusFunctionOptions) => {
      focusFunctionFactory((date: Date) => addDays(date, 1))(focusCalendarDay);
    },
    [focusFunctionFactory]
  );

  const focusPreviousDay = React.useCallback(
    ({focusCalendarDay}: FocusFunctionOptions) => {
      focusFunctionFactory((date: Date) => subDays(date, 1))(focusCalendarDay);
    },
    [focusFunctionFactory]
  );

  const focusFirstDayOfWeek = React.useCallback(
    ({focusCalendarDay}: FocusFunctionOptions) => {
      focusFunctionFactory(startOfWeek)(focusCalendarDay);
    },
    [focusFunctionFactory]
  );

  const focusLastDayOfWeek = React.useCallback(
    ({focusCalendarDay}: FocusFunctionOptions) => {
      focusFunctionFactory(endOfWeek)(focusCalendarDay);
    },
    [focusFunctionFactory]
  );

  const focusNextWeek = React.useCallback(
    ({focusCalendarDay}: FocusFunctionOptions) => {
      focusFunctionFactory((date: Date) => addWeeks(date, 1))(focusCalendarDay);
    },
    [focusFunctionFactory]
  );

  const focusPreviousWeek = React.useCallback(
    ({focusCalendarDay}: FocusFunctionOptions) => {
      focusFunctionFactory((date: Date) => subWeeks(date, 1))(focusCalendarDay);
    },
    [focusFunctionFactory]
  );

  const focusNextMonth = React.useCallback(
    ({focusCalendarDay, shouldAnnounce = false}: FocusFunctionOptions) => {
      focusFunctionFactory((date: Date) => addMonths(date, 1))(focusCalendarDay);
      setShouldAnnounceMonth(shouldAnnounce);
    },
    [focusFunctionFactory]
  );

  const focusPreviousMonth = React.useCallback(
    ({focusCalendarDay, shouldAnnounce = false}: FocusFunctionOptions) => {
      focusFunctionFactory((date: Date) => subMonths(date, 1))(focusCalendarDay);
      setShouldAnnounceMonth(shouldAnnounce);
    },
    [focusFunctionFactory]
  );

  const focusedMonthIndex = React.useMemo(
    () => focusedDate.getMonth(),
    [focusedDate]
  );

  const focusedYear = React.useMemo(
    () => focusedDate.getFullYear(),
    [focusedDate]
  );

  const isNextMonthButtonDisabled = React.useMemo(
    () =>
      focusedMonthIndex === maxDate?.getMonth() &&
      focusedYear === maxDate?.getFullYear(),
    [focusedMonthIndex, focusedYear, maxDate]
  );

  const isPreviousMonthButtonDisabled = React.useMemo(
    () =>
      focusedMonthIndex === minDate?.getMonth() &&
      focusedYear === minDate?.getFullYear(),
    [focusedMonthIndex, focusedYear, minDate]
  );

  const dayOfWeekLabels = React.useRef(
    Array.from(Array(7).keys()).map((index) => {
      const date = addDays(startOfWeek(new Date()), index);
      return dayOfWeekFormatter.format(date);
    })
  ).current;

  const monthLabel = React.useMemo(
    () =>
      monthLabelFormatter.format(
        createYearSafeDate(focusedYear, focusedMonthIndex)
      ),
    [focusedMonthIndex, focusedYear, monthLabelFormatter]
  );

  const calendarDayLabels = React.useMemo(() => {
    const firstDateOfMonth = createYearSafeDate(focusedYear, focusedMonthIndex);
    const lastDateOfMonth = lastDayOfMonth(firstDateOfMonth);

    const days = Array.from(Array(lastDateOfMonth.getDate()).keys()).map(
      (day) => day + 1
    );
    const fillerDaysBefore = Array.from(
      Array(firstDateOfMonth.getDay()).keys()
    ).map(() => null);
    const fillerDaysAfter = Array.from(
      Array(6 - lastDateOfMonth.getDay()).keys()
    ).map(() => null);
    const completeDays = [...fillerDaysBefore, ...days, ...fillerDaysAfter];

    const splitDays = completeDays.reduce(
      (acc: (number | null)[][], currItem, i) => {
        if (i % 7 === 0) {
          acc.push([]);
        }

        acc[acc.length - 1].push(currItem);
        return acc;
      },
      []
    );

    return splitDays;
  }, [focusedMonthIndex, focusedYear]);

  React.useEffect(() => {
    if (shouldAnnounceMonth) {
      announceAssertive(monthLabel);
      setShouldAnnounceMonth(false);
    }
  }, [announceAssertive, monthLabel, shouldAnnounceMonth]);

  return {
    calendarFocus: {
      focusNextMonth,
      focusPreviousMonth,
      focusNextWeek,
      focusPreviousDay,
      focusNextDay,
      focusPreviousWeek,
      focusFirstDayOfWeek,
      focusLastDayOfWeek,
    },
    calendarState: {
      calendarLabels: {
        calendarDayLabels,
        dayOfWeekLabels,
        monthLabel,
      },
      focusedDate,
      isCalendarDayFocused,
      isNextMonthButtonDisabled,
      isPreviousMonthButtonDisabled,
    },
  };
};

export const useCalendarDayUtilities = ({
  calendarDaySelectedA11yLabel = 'Selected',
  calendarDayTodayA11yLabel = 'Today',
  disabledDateFilter,
  focusedDate,
  maxDate,
  minDate,
  selectedDate,
}: {
  calendarDaySelectedA11yLabel?: string;
  calendarDayTodayA11yLabel?: string;
  disabledDateFilter?: DatePickerDisabledDateFilterSignature;
  focusedDate: Date;
  maxDate?: Date;
  minDate?: Date;
  selectedDate?: Date;
}) => {
  const {calendarDayFormatter} = useLocalizedFormatters();

  const getIsDisabled = React.useCallback(
    (date: Date) => {
      return (
        (minDate && differenceInCalendarDays(date, minDate) < 0) ||
        (maxDate && differenceInCalendarDays(date, maxDate) > 0) ||
        (disabledDateFilter && disabledDateFilter(date))
      );
    },
    [disabledDateFilter, maxDate, minDate]
  );

  const getIsFocused = React.useCallback(
    (date: Date) => isSameDay(date, focusedDate),
    [focusedDate]
  );

  const getIsSelected = React.useCallback(
    (date: Date) => (selectedDate ? isSameDay(date, selectedDate) : false),
    [selectedDate]
  );

  const getIsToday = React.useCallback(
    (date: Date) => isTodayDateFns(date),
    []
  );

  const getA11yLabel = React.useCallback(
    ({
      date,
      isSelected,
      isToday,
    }: {
      date: Date;
      isSelected: boolean;
      isToday: boolean;
    }) => {
      return `${
        (isSelected ? `${calendarDaySelectedA11yLabel}, ` : '') +
        (isToday ? `${calendarDayTodayA11yLabel}, ` : '') +
        calendarDayFormatter.format(date)
      }`;
    },
    [
      calendarDayFormatter,
      calendarDaySelectedA11yLabel,
      calendarDayTodayA11yLabel,
    ]
  );

  return {
    getA11yLabel,
    getIsDisabled,
    getIsFocused,
    getIsSelected,
    getIsToday,
  };
};

// ---------------------------------------------------------------------------
// DatePickerCalendar (inlined sub-component)
// ---------------------------------------------------------------------------

export interface DatePickerCalendarProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onSelect'>,
    BaseDatePickerCalendarProps {
  /**
   * The accessibility label reference IDs for the date picker calendar.
   */
  a11yLabelledBy: string;
  /**
   * If the date picker calendar is open.
   *
   * @default false
   */
  isOpen?: boolean;
}

/**
 * @private
 */
export const DatePickerCalendar: React.FunctionComponent<
  DatePickerCalendarProps
> = (props) => {
  const {
    a11yLabelledBy,
    a11yLabels,
    className,
    error,
    disabledDateFilter,
    isOpen = false,
    maxDate,
    minDate,
    onSelect,
    onClose,
    size,
    triggerRef,
    value,
    ...rest
  } = props;

  invariant(
    !!a11yLabelledBy,
    '`DatePickerCalendar` accessibility violation. `DatePickerCalendar` requires an `a11yLabelledBy`.'
  );

  const baseCalendarRef = React.useRef<HTMLDivElement>(null);

  const {shouldMount} = useCSSTransition({
    classNames: {
      enter: 'ld-datepicker-datepickercalendar-transitionEnter',
      enterActive: 'ld-datepicker-datepickercalendar-transitionEnterActive',
      exit: 'ld-datepicker-datepickercalendar-transitionExit',
      exitActive: 'ld-datepicker-datepickercalendar-transitionExitActive',
    },
    in: isOpen,
    mountOnEnter: true,
    nodeRef: baseCalendarRef,
    timeout: 100,
    unmountOnExit: true,
  });

  return (
    shouldMount &&
      <div
        aria-labelledby={a11yLabelledBy}
        aria-modal="true"
        className={className}
        role="dialog"
        {...rest}
      >
        <BaseDatePickerCalendar
          a11yLabels={a11yLabels}
          disabledDateFilter={disabledDateFilter}
          error={error}
          minDate={minDate}
          maxDate={maxDate}
          onSelect={onSelect}
          onClose={onClose}
          ref={baseCalendarRef}
          size={size}
          triggerRef={triggerRef}
          value={value}
        />
      </div>
  );
};

DatePickerCalendar.displayName = 'DatePickerCalendar';

// ---------------------------------------------------------------------------
// DatePickerCalendarBody (inlined sub-component)
// ---------------------------------------------------------------------------

export interface DatePickerCalendarBodyProps
  extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * The content for the date picker calendar body.
   */
  children: React.ReactNode;
}

/**
 * @private
 */
export const DatePickerCalendarBody: React.FunctionComponent<
  DatePickerCalendarBodyProps
> = (props) => {
  const {className, children, ...rest} = props;

  return (
    <div className={cx('ld-datepicker-datepickercalendarbody-container', className)}
      role="grid" {...rest}>
      {children}
    </div>
  );
};

DatePickerCalendarBody.displayName = 'DatePickerCalendarBody';

// ---------------------------------------------------------------------------
// DatePickerCalendarHeader (inlined sub-component)
// ---------------------------------------------------------------------------

export interface DatePickerCalendarHeaderProps
  extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * The text labels for the date picker calendar header.
   *
   * @default ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
   */
  textLabels?: string[];
}

/**
 * @private
 */
export const DatePickerCalendarHeader: React.FunctionComponent<
  DatePickerCalendarHeaderProps
> = (props): React.ReactElement => {
  const {
    className,
    textLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    ...rest
  } = props;

  return (
    <div
      aria-hidden="true"
      className={cx('ld-datepicker-datepickercalendarheader-container', className)}
      role="row"
      {...rest}
    >
      {textLabels.map((textLabel, index) => (
        <DatePickerCalendarHeaderDay key={textLabel + index} role="columnheader">
          {textLabel}
        </DatePickerCalendarHeaderDay>
      ))}
    </div>
  );
};

DatePickerCalendarHeader.displayName = 'DatePickerCalendarHeader';

// ---------------------------------------------------------------------------
// DatePickerCalendarHeaderDay (inlined sub-component)
// ---------------------------------------------------------------------------

export interface DatePickerCalendarHeaderDayProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'color'> {
  /**
   * The label for the date picker calendar header day.
   */
  children: string;
}

/**
 * @private
 */
export const DatePickerCalendarHeaderDay: React.FunctionComponent<
  DatePickerCalendarHeaderDayProps
> = (props): React.ReactElement => {
  const {children, className, ...rest} = props;

  return (
    <Body
      as="div"
      UNSAFE_className={cx('ld-datepicker-datepickercalendarheaderday-label', className)}
      size={"small"}
      weight={"alt"}
      {...rest}
    >
      {children}
    </Body>
  );
};

DatePickerCalendarHeaderDay.displayName = 'DatePickerCalendarHeaderDay';

// ---------------------------------------------------------------------------
// DatePickerCalendarMonth (inlined sub-component)
// ---------------------------------------------------------------------------

export interface DatePickerCalendarMonthProps
  extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * The content for the date picker calendar month.
   */
  children: React.ReactNode;
}

/**
 * @private
 */
export const DatePickerCalendarMonth: React.FunctionComponent<
  DatePickerCalendarMonthProps
> = (props) => {
  const {className, children, ...rest} = props;

  return (
    <div
      className={cx('ld-datepicker-datepickercalendarmonth-container', className)}
      role="presentation"
      {...rest}
    >
      {children}
    </div>
  );
};

DatePickerCalendarMonth.displayName = 'DatePickerCalendarMonth';

// ---------------------------------------------------------------------------
// DatePickerCalendarNavigation (inlined sub-component)
// ---------------------------------------------------------------------------

export interface DatePickerCalendarNavigationProps
  extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * The props spread to the date picker calendar navigation next month button.
   */
  nextMonthButtonProps: Pick<IconButtonButtonProps, 'disabled' | 'onClick'> &
    Partial<Pick<IconButtonButtonProps, 'a11yLabel'>>;
  /**
   * The props spread to the date picker calendar navigation previous month button.
   */
  previousMonthButtonProps: Pick<
    IconButtonButtonProps,
    'disabled' | 'onClick'
  > &
    Partial<Pick<IconButtonButtonProps, 'a11yLabel'>>;
  /**
   * The text label for the date picker calendar navigation.
   */
  textLabel: string;
  /**
   * The id applied to the month/year heading so the calendar grid can
   * reference it via `aria-labelledby`.
   */
  monthHeadingId?: string;
}

/**
 * @private
 */
export const DatePickerCalendarNavigation: React.FunctionComponent<
  DatePickerCalendarNavigationProps
> = (props) => {
  const {className, nextMonthButtonProps, previousMonthButtonProps, textLabel, monthHeadingId} =
    props;

  const {
    a11yLabel: nextMonthButtonA11yLabel = 'Next month',
    ...nextMonthButtonRest
  } = nextMonthButtonProps;

  const {
    a11yLabel: previousMonthButtonA11yLabel = 'Previous month',
    ...previousMonthButtonRest
  } = previousMonthButtonProps;

  return (
    <div
      className={cx('ld-datepicker-datepickercalendarnavigation-datePickerCalendarNavigationContainer', className)}
    >
      <IconButton
        a11yLabel={previousMonthButtonA11yLabel}
        size={"medium"}
        {...previousMonthButtonRest}
      >
        <ChevronLeftIcon />
      </IconButton>
      <Body
        id={monthHeadingId}
        size={"medium"}
        weight={"alt"}
        aria-live="polite"
        aria-atomic="true"
      >
        {textLabel}
      </Body>
      <IconButton
        a11yLabel={nextMonthButtonA11yLabel}
        size={"medium"}
        {...nextMonthButtonRest}
      >
        <ChevronRightIcon />
      </IconButton>
    </div>
  );
};

DatePickerCalendarNavigation.displayName = 'DatePickerCalendarNavigation';

// ---------------------------------------------------------------------------
// DatePickerCalendarSingleDay (inlined sub-component)
// ---------------------------------------------------------------------------

export interface DatePickerCalendarSingleDayProps
  extends React.ComponentPropsWithoutRef<'button'> {
  /**
   * The accessibility label for the date picker calendar single day.
   */
  a11yLabel: string;
  /**
   * The text label for the date picker calendar single day.
   */
  children: React.ReactNode;
  /**
   * If the date picker calendar single day is disabled.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * If the date picker calendar single day is focused.
   *
   * @default false;
   */
  isFocused?: boolean;
  /**
   * If the date picker calendar single day is selected.
   *
   * @default false;
   */
  isSelected?: boolean;
  /**
   * If the date picker calendar single day is today.
   *
   * @default false
   */
  isToday?: boolean;
}

/**
 * @private
 */
export const DatePickerCalendarSingleDay = React.forwardRef<
  HTMLButtonElement,
  DatePickerCalendarSingleDayProps
>((props, ref): React.ReactElement => {
  const {
    a11yLabel,
    children,
    className,
    disabled = false,
    isFocused = false,
    isToday = false,
    isSelected = false,
    ...rest
  } = props;

  invariant(
    !!a11yLabel,
    '`DatePickerCalendarSingleDay` accessibility violation. `DatePickerCalendarSingleDay` requires an `a11yLabel`.'
  );

  const calendarDayRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (isFocused) {
      calendarDayRef.current?.focus();
    }
  }, [isFocused]);

  return (
    <button
      aria-label={a11yLabel}
      className={cx('ld-datepicker-datepickercalendarsingleday-container', disabled && 'ld-datepicker-datepickercalendarsingleday-disabled', isSelected && 'ld-datepicker-datepickercalendarsingleday-isSelected', isToday && 'ld-datepicker-datepickercalendarsingleday-isToday', className)}
      aria-disabled={disabled || undefined}
      aria-selected={isSelected}
      aria-pressed={undefined}
      ref={mergeRefs(ref, calendarDayRef)}
      type="button"
      {...rest}
    >
      <span className={cx('ld-datepicker-datepickercalendarsingleday-indicator')}>
        <Body
          UNSAFE_className={cx('ld-datepicker-datepickercalendarsingleday-textLabel')}
          size={"small"}
        >
          {children}
        </Body>
      </span>
    </button>
  );
});

DatePickerCalendarSingleDay.displayName = 'DatePickerCalendarSingleDay';

// ---------------------------------------------------------------------------
// DatePickerCalendarEmptyDay (inlined sub-component)
// ---------------------------------------------------------------------------

/**
 * @private — filler cell for days outside the current month.
 * Renders an empty gridcell to keep ARIA grid row alignment correct.
 */
export const DatePickerCalendarEmptyDay: React.FunctionComponent = () => (
  <span aria-hidden="true" />
);

DatePickerCalendarEmptyDay.displayName = 'DatePickerCalendarEmptyDay';

// ---------------------------------------------------------------------------
// DatePickerCalendarWeek (inlined sub-component)
// ---------------------------------------------------------------------------

export interface DatePickerCalendarWeekProps
  extends React.ComponentPropsWithoutRef<'div'> {
  /**
   * The content for the date picker calendar week.
   */
  children: React.ReactNode;
}

/**
 * @private
 */
export const DatePickerCalendarWeek: React.FunctionComponent<
  DatePickerCalendarWeekProps
> = (props) => {
  const {className, children, ...rest} = props;

  return (
    <div className={cx('ld-datepicker-datepickercalendarweek-container', className)}
      role="row" {...rest}>
      {React.Children.map(children, (child, index) => {
        return (
          <div className={cx('ld-datepicker-datepickercalendarweek-itemContainer')}
            role="gridcell" key={index}>
            {child}
          </div>
        );
      })}
    </div>
  );
};

DatePickerCalendarWeek.displayName = 'DatePickerCalendarWeek';

// ---------------------------------------------------------------------------
// DatePickerDateField (inlined sub-component)
// ---------------------------------------------------------------------------

export type DatePickerDateFieldSize = 'large' | 'small';

export interface DatePickerDateFieldProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'> {
  /**
   * If the date picker date field is disabled.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * The error for the date picker date field.
   */
  error?: React.ReactNode;
  /**
   * The helper text for the date picker date field.
   */
  helperText?: React.ReactNode;
  /**
   * The props spread to the date picker date field's icon button element.
   */
  iconButtonProps: Omit<IconButtonButtonProps, 'children'>;
  /**
   * The id for the date picker date field.
   */
  id?: string;
  /**
   * The label for the date picker date field.
   */
  label: React.ReactNode;
  /**
   * The callback fired when the date picker date field requests to change.
   */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * If the date picker date field is read only.
   *
   * @default false
   */
  readOnly?: boolean;
  /**
   * The size for the date picker date field.
   *
   * @default "large"
   */
  size?: DatePickerDateFieldSize;
  /**
   * The props spread to the date picker date field's input element.
   *
   * @default {}
   */
  textFieldProps?: React.ComponentPropsWithoutRef<'input'>;
  /**
   * The value for the date picker date field.
   *
   * @default ""
   */
  value?: string;
}

/**
 * @private
 */
export const DatePickerDateField = React.forwardRef<
  HTMLInputElement,
  DatePickerDateFieldProps
>((props, ref) => {
  const {
    className,
    disabled = false,
    iconButtonProps,
    label,
    onBlur,
    readOnly = false,
    size = 'large',
    textFieldProps = {},
    ...rest
  } = props;

  const iconButtonSize = size === 'large' ? 'medium' : 'small';

  return (
    <TextField
      disabled={disabled}
      label={label}
      readOnly={readOnly}
      ref={ref}
      size={size}
      textFieldProps={{
        ...textFieldProps,
        type: 'text',
        // Route onBlur to the <input> element, NOT the container div.
        // If onBlur were on the container div, it would fire when focus moves
        // from the trigger button into the calendar popup (because the trigger
        // button is a child of the container). That would call validateValue →
        // onSelect → setIsOpen(false), immediately closing the calendar that
        // just opened.  Putting it on the input means it only fires when the
        // text input itself loses focus, which is the correct semantic.
        ...(onBlur != null && {onBlur: onBlur as unknown as React.FocusEventHandler<HTMLInputElement>}),
      }}
      trailing={
        <IconButton
          aria-controls={iconButtonProps['aria-controls']}
          aria-expanded={iconButtonProps['aria-expanded']}
          aria-haspopup="dialog"
          disabled={disabled || readOnly}
          size={iconButtonSize}
          a11yLabel={iconButtonProps.a11yLabel}
          onClick={iconButtonProps.onClick}
          ref={iconButtonProps.ref}
          UNSAFE_className={'ld-datepicker-datepickerdatefield-calendarIconButton'}
        >
          <CalendarIcon />
        </IconButton>
      }
      UNSAFE_className={className}
      {...rest}
    />
  );
});

DatePickerDateField.displayName = 'DatePickerDateField';

// ---------------------------------------------------------------------------
// DatePickerLocalizationProvider (inlined sub-component)
// ---------------------------------------------------------------------------

export interface DatePickerLocalizationProviderProps {
  /**
   * The content for the date picker localization provider.
   */
  children: React.ReactNode;
  /**
   * The locale for the date picker.
   */
  locale: string;
}

export const DatePickerLocalizationContext = React.createContext<{
  formatters: {
    calendarDayFormatter: Intl.DateTimeFormat;
    dayOfWeekFormatter: Intl.DateTimeFormat;
    monthLabelFormatter: Intl.DateTimeFormat;
    weekdayShortDateFormatter: Intl.DateTimeFormat;
  };
  locale: string;
}>({
  formatters: {
    calendarDayFormatter: new Intl.DateTimeFormat(),
    dayOfWeekFormatter: new Intl.DateTimeFormat(),
    monthLabelFormatter: new Intl.DateTimeFormat(),
    weekdayShortDateFormatter: new Intl.DateTimeFormat(),
  },
  locale: '',
});

/**
 * @private
 */
export const DatePickerLocalizationProvider: React.FunctionComponent<
  DatePickerLocalizationProviderProps
> = (props) => {
  const {children, locale} = props;

  const value = React.useRef({
    formatters: {
      calendarDayFormatter: new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        weekday: 'long',
        year: 'numeric',
      }),
      dayOfWeekFormatter: new Intl.DateTimeFormat(locale, {weekday: 'short'}),
      monthLabelFormatter: new Intl.DateTimeFormat(locale, {
        month: 'long',
        year: 'numeric',
      }),
      weekdayShortDateFormatter: (() => {
        const baseFormatter = new Intl.DateTimeFormat(locale, {
          day: 'numeric',
          month: 'numeric',
          weekday: 'long',
          year: 'numeric',
        });

        return {
          format: (date: Date) => {
            const parts = baseFormatter.formatToParts(date);
            const weekday = parts.find(
              (part) => part.type === 'weekday'
            )?.value;
            const day = parts.find((part) => part.type === 'day')?.value;
            const month = parts.find((part) => part.type === 'month')?.value;
            const year = parts.find((part) => part.type === 'year')?.value;

            return `${weekday}, ${month}/${day}/${year}`;
          },
        } as Intl.DateTimeFormat;
      })(),
    },
    locale,
  });

  return (
    <DatePickerLocalizationContext.Provider value={value.current}>
      {children}
    </DatePickerLocalizationContext.Provider>
  );
};

export const useLocale = () => React.useContext(DatePickerLocalizationContext);
export const useLocalizedFormatters = () => useLocale().formatters;

// ---------------------------------------------------------------------------
// types (inlined sub-component)
// ---------------------------------------------------------------------------

export type DatePickerDisabledDateFilterSignature = (date: Date) => boolean;

export interface DatePickerCommonProps {
  /**
   * The filter function to indicate disabled dates in the date picker.
   */
  disabledDateFilter?: DatePickerDisabledDateFilterSignature;
  /**
   * The maximum selectable date in the date picker.
   */
  maxDate?: Date;
  /**
   * The minimum selectable date in the date picker.
   */
  minDate?: Date;
}

// ---------------------------------------------------------------------------
// createYearSafeDate (inlined sub-component)
// ---------------------------------------------------------------------------

/**
 * The JS Date constructor maps year values from 0 to 99 to the years 1900
 * to 1999. All other values are the actual year.
 * @private
 *
 * See Date documentation:
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#interpretation_of_two-digit_years
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date#individual_date_and_time_component_values
 *
 * This utility wraps the Date constructor with signature `(year, month, day) => Date`,
 * but returns a Date object with the provided year in all cases, including when the
 * year is <100.
 */
export const createYearSafeDate = (year: number, month: number, day = 1) => {
  const date = new Date(year, month, day);
  date.setFullYear(year);

  return date;
};

export interface DatePickerProps extends BaseDatePickerProps {
  /**
   * The locale for the date picker.
   *
   * @default "en-US"
   */
  locale?: string;
}

/**
 * Date Pickers allow users to enter a single date with a calendar picker.
 * *
 */
export const DatePicker: React.FunctionComponent<DatePickerProps> = (props) => {
  const {locale = 'en-US', ...rest} = applyCommonProps(props);

  return (
    <DatePickerLocalizationProvider locale={locale}>
      <BaseDatePicker {...rest} />
    </DatePickerLocalizationProvider>
  );
};

DatePicker.displayName = 'DatePicker';
