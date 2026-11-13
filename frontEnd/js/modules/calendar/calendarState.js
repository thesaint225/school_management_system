// Calendar Module Centralized State (Encapsulated)
import { toISODateString, isValidISODateString } from '../../utils/dateUtils.js';

const ALLOWED_FILTERS = new Set(['all', 'term', 'event', 'exam', 'holiday', 'deadline']);

const today = new Date();

// Private internal state — never exported directly
const state = {
  viewYear: today.getFullYear(),
  viewMonth: today.getMonth(), // 0-indexed (0 = Jan, 8 = Sep, 9 = Oct, etc.)
  selectedDate: toISODateString(today.getFullYear(), today.getMonth(), today.getDate()),
  activeFilter: 'all',
};

/**
 * Returns a defensive shallow copy of the current calendar state.
 * Because all state properties are primitives, a shallow copy prevents
 * external callers from mutating internal state.
 * @returns {{ viewYear: number, viewMonth: number, selectedDate: string, activeFilter: string }}
 */
export function getCalendarState() {
  return { ...state };
}

/**
 * Sets the calendar's viewed year and 0-indexed month after validating bounds.
 * @param {number} year - 4-digit year (1970–2100)
 * @param {number} monthIndex - 0-indexed month (0 = Jan, 11 = Dec)
 */
export function setCalendarViewMonth(year, monthIndex) {
  if (typeof year !== 'number' || !Number.isInteger(year)) {
    throw new TypeError(`viewYear must be an integer, received ${typeof year === 'number' ? year : typeof year}.`);
  }
  if (typeof monthIndex !== 'number' || !Number.isInteger(monthIndex)) {
    throw new TypeError(`viewMonth must be an integer, received ${typeof monthIndex === 'number' ? monthIndex : typeof monthIndex}.`);
  }
  if (year < 1970 || year > 2100) {
    throw new RangeError(`viewYear must be between 1970 and 2100, received ${year}.`);
  }
  if (monthIndex < 0 || monthIndex > 11) {
    throw new RangeError(`viewMonth must be between 0 and 11, received ${monthIndex}.`);
  }
  state.viewYear = year;
  state.viewMonth = monthIndex;
}

/**
 * Navigates the calendar view forward (+1) or backward (-1) by one month.
 * @param {number} step - Must be 1 or -1
 * @returns {{ viewYear: number, viewMonth: number }}
 */
export function navigateCalendarMonth(step) {
  if (typeof step !== 'number' || !Number.isInteger(step)) {
    throw new TypeError(`Month navigation step must be an integer, received ${typeof step}.`);
  }
  if (step !== 1 && step !== -1) {
    throw new RangeError(`Month navigation step must be 1 or -1, received ${step}.`);
  }

  if (step === -1) {
    if (state.viewMonth === 0) {
      setCalendarViewMonth(state.viewYear - 1, 11);
    } else {
      setCalendarViewMonth(state.viewYear, state.viewMonth - 1);
    }
  } else {
    if (state.viewMonth === 11) {
      setCalendarViewMonth(state.viewYear + 1, 0);
    } else {
      setCalendarViewMonth(state.viewYear, state.viewMonth + 1);
    }
  }

  return { viewYear: state.viewYear, viewMonth: state.viewMonth };
}

/**
 * Updates the currently selected ISO date (YYYY-MM-DD).
 * @param {string} dateStr
 */
export function setSelectedDate(dateStr) {
  if (typeof dateStr !== 'string') {
    throw new TypeError(`selectedDate must be a string, received ${typeof dateStr}.`);
  }
  const trimmed = dateStr.trim();
  if (!isValidISODateString(trimmed)) {
    throw new RangeError(`selectedDate must be a valid YYYY-MM-DD calendar date, received "${dateStr}".`);
  }
  state.selectedDate = trimmed;
}

/**
 * Updates the active calendar category filter.
 * @param {string} filter
 */
export function setActiveFilter(filter) {
  if (typeof filter !== 'string') {
    throw new TypeError(`activeFilter must be a string, received ${typeof filter}.`);
  }
  if (!ALLOWED_FILTERS.has(filter)) {
    throw new RangeError(
      `Invalid calendar filter "${filter}". Allowed values: ${Array.from(ALLOWED_FILTERS).join(', ')}.`
    );
  }
  state.activeFilter = filter;
}

/**
 * Resets the calendar view and selected date to today's date.
 */
export function resetCalendarToToday() {
  const now = new Date();
  state.viewYear = now.getFullYear();
  state.viewMonth = now.getMonth();
  state.selectedDate = toISODateString(now.getFullYear(), now.getMonth(), now.getDate());
}

export const CalendarState = Object.freeze({
  get: getCalendarState,
  setViewMonth: setCalendarViewMonth,
  navigateMonth: navigateCalendarMonth,
  setSelectedDate,
  setActiveFilter,
  resetToToday: resetCalendarToToday,
});
