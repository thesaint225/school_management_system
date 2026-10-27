import { test, expect } from '@playwright/test';
import {
  formatSchoolTime,
  formatTermRange,
  getSchoolAttendanceTime,
  formatAttendanceOfficialDate,
  formatCalendarHeaderDate,
  formatAgendaDate,
  toISODateString,
  calculateDaysBetween,
} from '../frontEnd/js/utils/dateUtils.js';

test.describe('Date & Timezone Utilities Validation Standards', () => {

  test.describe('1. formatSchoolTime & Attendance Time Formatters', () => {
    test('formats valid date and timestamp numbers in Africa/Accra timezone', () => {
      const d = new Date('2026-09-07T08:30:00Z');
      expect(formatSchoolTime(d)).toContain(':');
      expect(getSchoolAttendanceTime(d)).toContain('GMT');
      expect(formatAttendanceOfficialDate(d)).toContain('Monday');
    });

    test('throws RangeError when given an invalid date value', () => {
      expect(() => formatSchoolTime(new Date('invalid'))).toThrow(RangeError);
      expect(() => getSchoolAttendanceTime('invalid-date')).toThrow(RangeError);
      expect(() => formatAttendanceOfficialDate('not-a-date')).toThrow(RangeError);
    });
  });

  test.describe('2. formatTermRange', () => {
    test('formats a valid ascending date range', () => {
      const range = formatTermRange('2026-01-10', '2026-04-10');
      expect(typeof range).toBe('string');
      expect(range.length).toBeGreaterThan(0);
    });

    test('throws TypeError if either argument is missing', () => {
      expect(() => formatTermRange()).toThrow(TypeError);
      expect(() => formatTermRange('2026-01-10', null)).toThrow(TypeError);
      expect(() => formatTermRange(undefined, '2026-04-10')).toThrow(TypeError);
    });

    test('throws RangeError if date strings are invalid', () => {
      expect(() => formatTermRange('not-a-date', '2026-04-10')).toThrow(RangeError);
      expect(() => formatTermRange('2026-01-10', 'invalid')).toThrow(RangeError);
    });

    test('throws RangeError if startDate is after endDate', () => {
      expect(() => formatTermRange('2026-05-01', '2026-01-01')).toThrow(RangeError);
    });
  });

  test.describe('3. formatCalendarHeaderDate', () => {
    test('formats valid year and monthIndex', () => {
      expect(formatCalendarHeaderDate(2026, 8)).toBe('September 2026');
      expect(formatCalendarHeaderDate(2026, 0)).toBe('January 2026');
      expect(formatCalendarHeaderDate(2026, 11)).toBe('December 2026');
    });

    test('throws TypeError for non-integer years', () => {
      expect(() => formatCalendarHeaderDate('2026', 0)).toThrow(TypeError);
      expect(() => formatCalendarHeaderDate(2026.5, 0)).toThrow(TypeError);
      expect(() => formatCalendarHeaderDate(null, 0)).toThrow(TypeError);
    });

    test('throws RangeError for invalid monthIndex bounds', () => {
      expect(() => formatCalendarHeaderDate(2026, -1)).toThrow(RangeError);
      expect(() => formatCalendarHeaderDate(2026, 12)).toThrow(RangeError);
    });
  });

  test.describe('4. formatAgendaDate', () => {
    test('formats valid date string', () => {
      const formatted = formatAgendaDate('2026-10-14');
      expect(formatted).toContain('Oct');
      expect(formatted).toContain('14');
      expect(formatted).toContain('2026');
    });

    test('throws TypeError for missing or empty date', () => {
      expect(() => formatAgendaDate()).toThrow(TypeError);
      expect(() => formatAgendaDate('')).toThrow(TypeError);
      expect(() => formatAgendaDate(null)).toThrow(TypeError);
    });

    test('throws RangeError for invalid date string', () => {
      expect(() => formatAgendaDate('invalid-date')).toThrow(RangeError);
    });
  });

  test.describe('5. toISODateString', () => {
    test('formats valid year, monthIndex, and day into YYYY-MM-DD', () => {
      expect(toISODateString(2026, 8, 7)).toBe('2026-09-07');
      expect(toISODateString(2026, 0, 1)).toBe('2026-01-01');
      expect(toISODateString(2026, 11, 31)).toBe('2026-12-31');
    });

    test('throws TypeError for non-integer inputs', () => {
      expect(() => toISODateString('2026', 0, 1)).toThrow(TypeError);
      expect(() => toISODateString(2026, '0', 1)).toThrow(TypeError);
      expect(() => toISODateString(2026, 0, '1')).toThrow(TypeError);
    });

    test('throws RangeError for monthIndex or day outside permissible ranges', () => {
      expect(() => toISODateString(2026, -1, 10)).toThrow(RangeError);
      expect(() => toISODateString(2026, 12, 10)).toThrow(RangeError);
      expect(() => toISODateString(2026, 5, 0)).toThrow(RangeError);
      expect(() => toISODateString(2026, 5, 32)).toThrow(RangeError);
    });
  });

  test.describe('6. calculateDaysBetween', () => {
    test('calculates correct difference in days between two dates', () => {
      expect(calculateDaysBetween('2026-01-01', '2026-01-11')).toBe(10);
      expect(calculateDaysBetween(new Date('2026-01-01'), new Date('2026-01-05'))).toBe(4);
    });

    test('throws TypeError if arguments are missing', () => {
      expect(() => calculateDaysBetween('2026-01-01')).toThrow(TypeError);
      expect(() => calculateDaysBetween(null, '2026-01-01')).toThrow(TypeError);
    });

    test('throws RangeError if invalid dates are passed', () => {
      expect(() => calculateDaysBetween('invalid-date', '2026-01-05')).toThrow(RangeError);
      expect(() => calculateDaysBetween('2026-01-01', 'bad-date')).toThrow(RangeError);
    });
  });

});
