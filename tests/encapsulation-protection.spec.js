import { test, expect } from '@playwright/test';
import {
  getCalendarState,
  setCalendarViewMonth,
  navigateCalendarMonth,
  setSelectedDate,
  setActiveFilter,
  resetCalendarToToday,
} from '../frontEnd/js/modules/calendar/calendarState.js';
import {
  getAttendanceState,
  setAttendanceSearchQuery,
  setAttendanceClassFilter,
  setAttendanceStatusFilter,
  setAttendanceGenderFilter,
  setAttendancePageSize,
  setAttendanceCurrentPage,
  resetAttendanceState,
} from '../frontEnd/js/modules/attendance/attendanceState.js';
import {
  setClassCache,
  getActiveClasses,
  invalidateClassCache,
} from '../frontEnd/js/modules/classes/classUtils.js';
import {
  setSubjectCache,
  getActiveSubjects,
  invalidateSubjectCache,
} from '../frontEnd/js/modules/subjects/subjectUtils.js';
import {
  getCalendarItems,
  getAcademicTerms,
  updateCalendarItems,
  updateAcademicTerms,
} from '../frontEnd/js/data/calendarData.js';
import {
  getStudents,
  getStudentById,
  setStudents,
  removeStudentById,
} from '../frontEnd/js/data/studentsData.js';
import {
  getTeachers,
  setTeachers,
  removeTeacherById,
} from '../frontEnd/js/data/teachersData.js';

test.describe('JavaScript Encapsulation & State Protection Suite', () => {

  // ==========================================================================
  // 1. Calendar State Encapsulation & Validation
  // ==========================================================================
  test.describe('1. calendarState Encapsulation', () => {
    test.beforeEach(() => {
      resetCalendarToToday();
      setActiveFilter('all');
    });

    test('getCalendarState returns an isolated copy; external mutation does not affect internal state', () => {
      const snapshot = getCalendarState();
      const originalYear = snapshot.viewYear;
      const originalMonth = snapshot.viewMonth;

      // Attempt external mutation on returned object
      snapshot.viewYear = 1900;
      snapshot.viewMonth = 99;
      snapshot.activeFilter = 'corrupted';
      snapshot.selectedDate = 'invalid-date';

      const freshSnapshot = getCalendarState();
      expect(freshSnapshot.viewYear).toBe(originalYear);
      expect(freshSnapshot.viewMonth).toBe(originalMonth);
      expect(freshSnapshot.activeFilter).toBe('all');
    });

    test('setCalendarViewMonth and navigateCalendarMonth update valid state and handle year rollover', () => {
      setCalendarViewMonth(2026, 0); // January 2026
      expect(getCalendarState().viewYear).toBe(2026);
      expect(getCalendarState().viewMonth).toBe(0);

      // Step backward from Jan 2026 -> Dec 2025
      navigateCalendarMonth(-1);
      expect(getCalendarState().viewYear).toBe(2025);
      expect(getCalendarState().viewMonth).toBe(11);

      // Step forward from Dec 2025 -> Jan 2026
      navigateCalendarMonth(1);
      expect(getCalendarState().viewYear).toBe(2026);
      expect(getCalendarState().viewMonth).toBe(0);
    });

    test('calendarState mutators reject invalid types (TypeError) and out-of-range values (RangeError) without corrupting state', () => {
      setCalendarViewMonth(2026, 8);
      setSelectedDate('2026-09-15');
      setActiveFilter('exam');

      // Invalid viewMonth / viewYear
      expect(() => setCalendarViewMonth('2026', 8)).toThrow(TypeError);
      expect(() => setCalendarViewMonth(2026, '8')).toThrow(TypeError);
      expect(() => setCalendarViewMonth(2026, 8.5)).toThrow(TypeError);
      expect(() => setCalendarViewMonth(2026, -1)).toThrow(RangeError);
      expect(() => setCalendarViewMonth(2026, 12)).toThrow(RangeError);
      expect(() => setCalendarViewMonth(1800, 5)).toThrow(RangeError);

      // Invalid navigateCalendarMonth step
      expect(() => navigateCalendarMonth('1')).toThrow(TypeError);
      expect(() => navigateCalendarMonth(0)).toThrow(RangeError);
      expect(() => navigateCalendarMonth(2)).toThrow(RangeError);

      // Invalid selectedDate
      expect(() => setSelectedDate(null)).toThrow(TypeError);
      expect(() => setSelectedDate(20260915)).toThrow(TypeError);
      expect(() => setSelectedDate('not-a-date')).toThrow(RangeError);
      expect(() => setSelectedDate('2026-13-45')).toThrow(RangeError);

      // Invalid activeFilter
      expect(() => setActiveFilter(123)).toThrow(TypeError);
      expect(() => setActiveFilter('unknown-category')).toThrow(RangeError);

      // Verify state remained untouched after failed mutations
      const afterFailedAttempts = getCalendarState();
      expect(afterFailedAttempts.viewYear).toBe(2026);
      expect(afterFailedAttempts.viewMonth).toBe(8);
      expect(afterFailedAttempts.selectedDate).toBe('2026-09-15');
      expect(afterFailedAttempts.activeFilter).toBe('exam');
    });
  });

  // ==========================================================================
  // 2. Attendance State Encapsulation & Validation
  // ==========================================================================
  test.describe('2. attendanceState Encapsulation', () => {
    test.beforeEach(() => {
      resetAttendanceState();
    });

    test('getAttendanceState returns an isolated copy; external mutation does not affect internal state', () => {
      const stateCopy = getAttendanceState();
      stateCopy.searchQuery = 'hacked';
      stateCopy.currentPage = 999;
      stateCopy.pageSize = -50;

      const fresh = getAttendanceState();
      expect(fresh.searchQuery).toBe('');
      expect(fresh.currentPage).toBe(1);
      expect(fresh.pageSize).toBe(6);
    });

    test('attendance filter mutators update state and automatically reset currentPage to 1', () => {
      setAttendanceCurrentPage(3);
      expect(getAttendanceState().currentPage).toBe(3);

      setAttendanceSearchQuery('Ama');
      expect(getAttendanceState().searchQuery).toBe('Ama');
      expect(getAttendanceState().currentPage).toBe(1);

      setAttendanceCurrentPage(2);
      setAttendanceStatusFilter('Present');
      expect(getAttendanceState().statusFilter).toBe('Present');
      expect(getAttendanceState().currentPage).toBe(1);
    });

    test('attendanceState mutators throw TypeError and RangeError on invalid inputs and preserve state', () => {
      setAttendanceClassFilter('Form 2');
      setAttendanceStatusFilter('Late');
      setAttendanceGenderFilter('Female');
      setAttendancePageSize(10);
      setAttendanceCurrentPage(2);

      expect(() => setAttendanceSearchQuery(null)).toThrow(TypeError);
      expect(() => setAttendanceClassFilter('')).toThrow(TypeError);
      expect(() => setAttendanceStatusFilter(123)).toThrow(TypeError);
      expect(() => setAttendanceStatusFilter('Skipped')).toThrow(RangeError);
      expect(() => setAttendanceGenderFilter('InvalidGender')).toThrow(RangeError);
      expect(() => setAttendancePageSize('10')).toThrow(TypeError);
      expect(() => setAttendancePageSize(0)).toThrow(RangeError);
      expect(() => setAttendancePageSize(-5)).toThrow(RangeError);
      expect(() => setAttendancePageSize(500)).toThrow(RangeError);
      expect(() => setAttendanceCurrentPage(0)).toThrow(RangeError);
      expect(() => setAttendanceCurrentPage(1.5)).toThrow(TypeError);

      // Verify state was preserved
      const preserved = getAttendanceState();
      expect(preserved.classFilter).toBe('Form 2');
      expect(preserved.statusFilter).toBe('Late');
      expect(preserved.genderFilter).toBe('Female');
      expect(preserved.pageSize).toBe(10);
      expect(preserved.currentPage).toBe(2);
    });
  });

  // ==========================================================================
  // 3. Class & Subject Cache Encapsulation (Defensive Deep Cloning)
  // ==========================================================================
  test.describe('3. classUtils & subjectUtils Cache Protection', () => {
    test.afterEach(() => {
      invalidateClassCache();
      invalidateSubjectCache();
    });

    test('mutating returned array or objects from getActiveClasses does not corrupt internal cache', async () => {
      const seedClasses = [
        { id: 1, name: 'Form 1A', studentCount: 25, active: true },
        { id: 2, name: 'Form 2A', studentCount: 30, active: true },
      ];
      setClassCache(seedClasses);

      // Mutating caller's input array after setClassCache should not affect cache
      seedClasses[0].name = 'EXTERNAL_MUTATION_AFTER_SET';
      seedClasses.push({ id: 99, name: 'Ghost Class' });

      const firstRead = await getActiveClasses(false);
      expect(firstRead).toHaveLength(2);
      expect(firstRead[0].name).toBe('Form 1A');

      // Mutating the array and objects returned by getActiveClasses()
      firstRead[0].name = 'CORRUPTED_CLASS_NAME';
      firstRead[0].studentCount = -999;
      firstRead.pop();

      // Subsequent read must still return pristine cached data
      const secondRead = await getActiveClasses(false);
      expect(secondRead).toHaveLength(2);
      expect(secondRead[0].name).toBe('Form 1A');
      expect(secondRead[0].studentCount).toBe(25);
    });

    test('mutating returned array or objects from getActiveSubjects does not corrupt internal cache', async () => {
      const seedSubjects = [
        { id: 1, name: 'Mathematics', code: 'MATH101', active: true },
        { id: 2, name: 'Physics', code: 'PHY101', active: true },
      ];
      setSubjectCache(seedSubjects);

      // Mutate input after setting cache
      seedSubjects[0].name = 'MUTATED_INPUT';

      const firstRead = await getActiveSubjects(false);
      expect(firstRead).toHaveLength(2);
      expect(firstRead[0].name).toBe('Mathematics');

      // Mutate returned copy
      firstRead[0].name = 'HACKED_SUBJECT';
      firstRead.length = 0;

      const secondRead = await getActiveSubjects(false);
      expect(secondRead).toHaveLength(2);
      expect(secondRead[0].name).toBe('Mathematics');
    });

    test('cache setters and getters validate argument types', async () => {
      expect(() => setClassCache('not-an-array')).toThrow(TypeError);
      expect(() => setClassCache([null])).toThrow(TypeError);
      expect(() => setClassCache([{ id: 1, name: '   ' }])).toThrow(TypeError);

      expect(() => setSubjectCache(null)).toThrow(TypeError);
      expect(() => setSubjectCache([{ id: 1, name: '' }])).toThrow(TypeError);

      await expect(getActiveClasses('true')).rejects.toThrow(TypeError);
      await expect(getActiveSubjects(1)).rejects.toThrow(TypeError);
    });
  });

  // ==========================================================================
  // 4. Data Stores Encapsulation (calendarData, studentsData, teachersData)
  // ==========================================================================
  test.describe('4. Domain Data Store Protection (Nested Objects & Arrays)', () => {
    test('calendarData: getCalendarItems and getAcademicTerms protect internal records from external mutation', () => {
      const items = getCalendarItems();
      const originalCount = items.length;
      const originalFirstTitle = items[0].title;

      // Mutate returned array and item object
      items[0].title = 'CORRUPTED EVENT TITLE';
      items.pop();

      const freshItems = getCalendarItems();
      expect(freshItems).toHaveLength(originalCount);
      expect(freshItems[0].title).toBe(originalFirstTitle);

      // Validate mutator rejection on bad inputs
      expect(() => updateCalendarItems(null)).toThrow(TypeError);
      expect(() => updateCalendarItems([])).toThrow(RangeError);
      expect(() => updateCalendarItems([{ title: 'Valid', date: 'bad-date' }])).toThrow(RangeError);

      expect(() => updateAcademicTerms('invalid')).toThrow(TypeError);
      expect(() => updateAcademicTerms([])).toThrow(RangeError);
    });

    test('studentsData: getStudents and getStudentById deep-clone nested guardian, dailyAttendance, and subjects', () => {
      const student1 = getStudentById(1);
      expect(student1).not.toBeNull();
      const originalGuardianName = student1.guardian.name;
      const originalSubjectsCount = student1.subjects.length;
      const originalAttendanceStatus = student1.dailyAttendance.status;

      // Mutate nested structures on the returned student object
      student1.name = 'MUTATED STUDENT';
      student1.guardian.name = 'MUTATED GUARDIAN';
      student1.subjects.push('Unauthorized Subject');
      student1.dailyAttendance.status = 'CorruptedStatus';

      // Verify internal record is completely unaffected
      const checkAgain = getStudentById(1);
      expect(checkAgain.name).not.toBe('MUTATED STUDENT');
      expect(checkAgain.guardian.name).toBe(originalGuardianName);
      expect(checkAgain.subjects).toHaveLength(originalSubjectsCount);
      expect(checkAgain.dailyAttendance.status).toBe(originalAttendanceStatus);

      // Verify invalid IDs throw TypeError
      expect(() => getStudentById('1')).toThrow(TypeError);
      expect(() => getStudentById(0)).toThrow(TypeError);
      expect(() => getStudentById(-5)).toThrow(TypeError);
      expect(() => setStudents('not-an-array')).toThrow(TypeError);
      expect(() => removeStudentById('bad')).toThrow(TypeError);
    });

    test('teachersData: setTeachers and getTeachers isolate internal teacher class and subject allocations', () => {
      const sampleTeachers = [
        {
          id: 101,
          firstName: 'Kofi',
          lastName: 'Boateng',
          name: 'Kofi Boateng',
          subjects: ['Mathematics', 'Physics'],
          classes: ['Form 1A', 'Form 2A'],
        },
      ];

      setTeachers(sampleTeachers);

      // Mutate input array after passing to setTeachers
      sampleTeachers[0].classes.push('Form 3B');

      const retrieved = getTeachers();
      expect(retrieved).toHaveLength(1);
      expect(retrieved[0].classes).toEqual(['Form 1A', 'Form 2A']);

      // Mutate returned copy
      retrieved[0].subjects.length = 0;
      expect(getTeachers()[0].subjects).toEqual(['Mathematics', 'Physics']);

      expect(removeTeacherById(101)).toBe(true);
      expect(getTeachers()).toHaveLength(0);
    });
  });
});

