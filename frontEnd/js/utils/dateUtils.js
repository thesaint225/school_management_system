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
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE_ACCRA,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  }).format(date);
}

// 2. Academic Term Date Range Formatter
export function formatTermRange(startDate, endDate) {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const formatter = new Intl.DateTimeFormat('en-GH', termRangeOptions);
  return formatter.formatRange(start, end);
}

// 3. Roll call timestamp helper (e.g. "08:15 GMT")
export function getSchoolAttendanceTime(date = new Date()) {
  return (
    new Intl.DateTimeFormat('en-GB', {
      timeZone: TIMEZONE_ACCRA,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date) + ' GMT'
  );
}

// 4. Official Accra date display (e.g. "Monday, 7 Sep 2026")
export function formatAttendanceOfficialDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE_ACCRA,
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

// 5. Calendar month & year title (e.g. "September 2026")
export function formatCalendarHeaderDate(year, monthIndex) {
  const d = new Date(year, monthIndex, 1);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(d);
}

// 6. Agenda date header (e.g. "Wednesday, Oct 14, 2026")
export function formatAgendaDate(date) {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

// 7. Standard YYYY-MM-DD string representation
export function toISODateString(year, monthIndex, day) {
  const m = String(monthIndex + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

// 8. Calculate difference in calendar days between two dates
export function calculateDaysBetween(startDate, endDate) {
  const d1 = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const d2 = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const diffMs = d2.getTime() - d1.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
