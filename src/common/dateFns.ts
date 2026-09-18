export function formatDate(date: Date, formatStr: string): string {
  const y = date.getFullYear();
  const M = date.getMonth() + 1;
  const d = date.getDate();
  return formatStr
    .replace('yyyy', String(y).padStart(4, '0'))
    .replace('MM', String(M).padStart(2, '0'))
    .replace('dd', String(d).padStart(2, '0'));
}

export function parseDate(value: string, formatStr: string): Date {
  const yearIdx = formatStr.indexOf('yyyy');
  const monthIdx = formatStr.indexOf('MM');
  const dayIdx = formatStr.indexOf('dd');
  const y = yearIdx >= 0 ? parseInt(value.substring(yearIdx, yearIdx + 4), 10) : NaN;
  const m = monthIdx >= 0 ? parseInt(value.substring(monthIdx, monthIdx + 2), 10) : NaN;
  const d = dayIdx >= 0 ? parseInt(value.substring(dayIdx, dayIdx + 2), 10) : NaN;
  if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) return new Date(NaN);
  const date = new Date(y, m - 1, d);
  date.setFullYear(y);
  if (date.getMonth() !== m - 1 || date.getDate() !== d) return new Date(NaN);
  return date;
}

export function isValid(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

export function differenceInCalendarDays(a: Date, b: Date): number {
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utcA - utcB) / 86400000);
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function lastDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addDaysImpl(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function addDays(date: Date, n: number): Date {
  return addDaysImpl(date, n);
}

export function subDays(date: Date, n: number): Date {
  return addDaysImpl(date, -n);
}

export function addWeeks(date: Date, n: number): Date {
  return addDaysImpl(date, n * 7);
}

export function subWeeks(date: Date, n: number): Date {
  return addDaysImpl(date, -n * 7);
}

function addMonthsImpl(date: Date, n: number): Date {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + n, 1);
  d.setDate(Math.min(day, lastDayOfMonth(d).getDate()));
  return d;
}

export function addMonths(date: Date, n: number): Date {
  return addMonthsImpl(date, n);
}

export function subMonths(date: Date, n: number): Date {
  return addMonthsImpl(date, -n);
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

export function endOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + (6 - d.getDay()));
  return d;
}
