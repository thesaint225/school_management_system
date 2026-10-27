// Shared Date & Timezone Utilities (Standard Timezone: Africa/Accra GMT)

export const TIMEZONE_ACCRA = 'Africa/Accra';

export const termRangeOptions = {
  timeZone: TIMEZONE_ACCRA,
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

// 1. Live School Clock Formatter
export function formatSchoolTime(date = new Date()) {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) {
    throw new RangeError('formatSchoolTime: Expected a valid Date object or timestamp.');
  }
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE_ACCRA,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  }).format(d);
}

// 2. Academic Term Date Range Formatter
export function formatTermRange(startDate, endDate) {
  if (!startDate || !endDate) {
    throw new TypeError('formatTermRange requires both startDate and endDate.');
  }
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  if (!(start instanceof Date) || Number.isNaN(start.getTime())) {
    throw new RangeError(`formatTermRange: Invalid startDate "${startDate}".`);
  }
  if (!(end instanceof Date) || Number.isNaN(end.getTime())) {
    throw new RangeError(`formatTermRange: Invalid endDate "${endDate}".`);
  }
  if (start.getTime() > end.getTime()) {
    throw new RangeError('formatTermRange: startDate must be before or equal to endDate.');
  }

  const formatter = new Intl.DateTimeFormat('en-GH', termRangeOptions);
  return formatter.formatRange(start, end);
}

// 3. Roll call timestamp helper (e.g. "08:15 GMT")
export function getSchoolAttendanceTime(date = new Date()) {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) {
    throw new RangeError('getSchoolAttendanceTime: Expected a valid Date object or timestamp.');
  }
  return (
    new Intl.DateTimeFormat('en-GB', {
      timeZone: TIMEZONE_ACCRA,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(d) + ' GMT'
  );
}

// 4. Official Accra date display (e.g. "Monday, 7 Sep 2026")
export function formatAttendanceOfficialDate(date = new Date()) {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) {
    throw new RangeError('formatAttendanceOfficialDate: Expected a valid Date object or timestamp.');
  }
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE_ACCRA,
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

// 5. Calendar month & year title (e.g. "September 2026")
export function formatCalendarHeaderDate(year, monthIndex) {
  if (typeof year !== 'number' || !Number.isInteger(year)) {
    throw new TypeError(`formatCalendarHeaderDate: Year must be an integer, received ${typeof year}.`);
  }
  if (typeof monthIndex !== 'number' || !Number.isInteger(monthIndex)) {
    throw new TypeError(`formatCalendarHeaderDate: monthIndex must be an integer, received ${typeof monthIndex}.`);
  }
  if (monthIndex < 0 || monthIndex > 11) {
    throw new RangeError(`formatCalendarHeaderDate: monthIndex must be an integer between 0 and 11, received ${monthIndex}.`);
  }

  const d = new Date(year, monthIndex, 1);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(d);
}

// 6. Agenda date header (e.g. "Wednesday, Oct 14, 2026")
export function formatAgendaDate(date) {
  if (!date) {
    throw new TypeError('formatAgendaDate: A date string or Date object is required.');
  }
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) {
    throw new RangeError(`formatAgendaDate: Invalid date value "${date}".`);
  }

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

// 7. Standard YYYY-MM-DD string representation
export function toISODateString(year, monthIndex, day) {
  if (typeof year !== 'number' || !Number.isInteger(year)) {
    throw new TypeError(`toISODateString: Year must be an integer, received ${typeof year}.`);
  }
  if (typeof monthIndex !== 'number' || !Number.isInteger(monthIndex)) {
    throw new TypeError(`toISODateString: monthIndex must be an integer, received ${typeof monthIndex}.`);
  }
  if (monthIndex < 0 || monthIndex > 11) {
    throw new RangeError(`toISODateString: monthIndex must be between 0 and 11, received ${monthIndex}.`);
  }
  if (typeof day !== 'number' || !Number.isInteger(day)) {
    throw new TypeError(`toISODateString: day must be an integer, received ${typeof day}.`);
  }
  if (day < 1 || day > 31) {
    throw new RangeError(`toISODateString: day must be between 1 and 31, received ${day}.`);
  }

  const m = String(monthIndex + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

// 8. Calculate difference in calendar days between two dates
export function calculateDaysBetween(startDate, endDate) {
  if (!startDate || !endDate) {
    throw new TypeError('calculateDaysBetween requires both startDate and endDate.');
  }
  const d1 = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const d2 = typeof endDate === 'string' ? new Date(endDate) : endDate;

  if (!(d1 instanceof Date) || Number.isNaN(d1.getTime())) {
    throw new RangeError(`calculateDaysBetween: Invalid startDate "${startDate}".`);
  }
  if (!(d2 instanceof Date) || Number.isNaN(d2.getTime())) {
    throw new RangeError(`calculateDaysBetween: Invalid endDate "${endDate}".`);
  }

  const diffMs = d2.getTime() - d1.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
