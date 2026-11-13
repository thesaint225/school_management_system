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
import * as studentsMod from '../frontEnd/js/data/studentsData.js';
import {
  getStudents,
  getStudentById,
  setStudents,
  addStudent,
  updateStudentInStore,
  updateStudentDailyAttendance,
  removeStudentById,
} from '../frontEnd/js/data/studentsData.js';
import * as teachersMod from '../frontEnd/js/data/teachersData.js';
import {
  getTeachers,
  getTeacherById,
  setTeachers,
  addTeacher,
  updateTeacherInStore,
  removeTeacherById,
} from '../frontEnd/js/data/teachersData.js';
import { Student } from '../frontEnd/js/modules/students/index.js';
import { Teacher } from '../frontEnd/js/modules/teachers/index.js';
import { ClassRoom } from '../frontEnd/js/modules/classes/index.js';
import { Subject } from '../frontEnd/js/modules/subjects/index.js';
import { Attendance } from '../frontEnd/js/modules/attendance/index.js';
import { Calendar } from '../frontEnd/js/modules/calendar/index.js';
import { Results } from '../frontEnd/js/modules/results/index.js';
import { Api } from '../frontEnd/js/api/index.js';
import * as validatorMod from '../frontEnd/js/utils/apiValidator.js';
import * as dateUtilsMod from '../frontEnd/js/utils/dateUtils.js';
import { DomUtils } from '../frontEnd/js/utils/domUtils.js';
import { Icons, ICONS } from '../frontEnd/js/utils/icons.js';
import * as classRosterMod from '../frontEnd/js/modules/classes/classRoster.js';
import * as subjectRosterMod from '../frontEnd/js/modules/subjects/subjectRoster.js';
import * as studentRosterMod from '../frontEnd/js/modules/students/studentRoster.js';
import * as topAchieversMod from '../frontEnd/js/modules/students/topAchievers.js';

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
      expect(() => setSelectedDate('2026-02-31')).toThrow(RangeError);
      expect(() => setSelectedDate('2026-04-31')).toThrow(RangeError);

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
      expect(() => setAttendanceClassFilter(123)).toThrow(TypeError);
      expect(() => setAttendanceClassFilter('')).toThrow(RangeError);
      expect(() => setAttendanceClassFilter('   ')).toThrow(RangeError);
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

    test('cache setters and getters validate argument types and domain ranges', async () => {
      expect(() => setClassCache('not-an-array')).toThrow(TypeError);
      expect(() => setClassCache([null])).toThrow(TypeError);
      expect(() => setClassCache([{ id: 1, name: 123 }])).toThrow(TypeError);
      expect(() => setClassCache([{ id: 1, name: '   ' }])).toThrow(RangeError);

      expect(() => setSubjectCache(null)).toThrow(TypeError);
      expect(() => setSubjectCache([{ id: 1, name: 456 }])).toThrow(TypeError);
      expect(() => setSubjectCache([{ id: 1, name: '' }])).toThrow(RangeError);

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
      expect(() => updateCalendarItems([{ title: 123, date: '2026-09-15' }])).toThrow(TypeError);
      expect(() => updateCalendarItems([{ title: '   ', date: '2026-09-15' }])).toThrow(RangeError);
      expect(() => updateCalendarItems([{ title: 'Valid', date: 'bad-date' }])).toThrow(RangeError);
      expect(() => updateCalendarItems([{ title: 'Valid', date: '1' }])).toThrow(RangeError);
      expect(() => updateCalendarItems([{ title: 'Valid', date: '2026-02-31' }])).toThrow(RangeError);
      expect(() => updateCalendarItems([{ title: 'Valid', date: '2026-09-15', category: 'invalid-cat' }])).toThrow(RangeError);

      expect(() => updateAcademicTerms('invalid')).toThrow(TypeError);
      expect(() => updateAcademicTerms([])).toThrow(RangeError);
      expect(() =>
        updateAcademicTerms([
          { name: 'Inverted Term', startDate: '2026-12-18', endDate: '2026-09-08' },
        ]),
      ).toThrow(RangeError);
    });

    test('studentsData: raw array is private and getters/mutators deep-clone and validate records', () => {
      expect(studentsMod.students).toBeUndefined();

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

      // Verify addStudent, updateStudentInStore, and updateStudentDailyAttendance isolate state
      const newStudentInput = {
        id: 999,
        name: 'Test Student',
        class: 'Form 1A',
        subjects: ['Mathematics'],
        guardian: { name: 'Parent One' },
        dailyAttendance: { status: 'Present', timestamp: '08:00 AM' },
      };
      const added = addStudent(newStudentInput);
      newStudentInput.name = 'MUTATED INPUT AFTER ADD';
      added.subjects.push('Hacked Subject');

      expect(getStudentById(999).name).toBe('Test Student');
      expect(getStudentById(999).subjects).toEqual(['Mathematics']);

      updateStudentInStore(999, { name: 'Updated Student Name' });
      expect(getStudentById(999).name).toBe('Updated Student Name');

      updateStudentDailyAttendance(999, 'Late', '08:45 AM');
      expect(getStudentById(999).dailyAttendance).toEqual({
        status: 'Late',
        timestamp: '08:45 AM',
      });
      expect(() => updateStudentDailyAttendance(999, 'InvalidStatus', '08:45 AM')).toThrow(RangeError);

      expect(removeStudentById(999)).toBe(true);
      expect(getStudentById(999)).toBeNull();

      // Verify invalid IDs throw TypeError for wrong type and RangeError for out-of-range
      expect(() => getStudentById('1')).toThrow(TypeError);
      expect(() => getStudentById(0)).toThrow(RangeError);
      expect(() => getStudentById(-5)).toThrow(RangeError);
      expect(() => setStudents('not-an-array')).toThrow(TypeError);
      expect(() => removeStudentById('bad')).toThrow(TypeError);
      expect(() => removeStudentById(0)).toThrow(RangeError);
    });

    test('teachersData: raw array is private and setTeachers/getTeachers/addTeacher/updateTeacherInStore isolate state', () => {
      expect(teachersMod.teachers).toBeUndefined();

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

      // Test addTeacher and updateTeacherInStore
      const addedTeacher = addTeacher({
        id: 102,
        firstName: 'Ama',
        lastName: 'Mensah',
        subjects: ['Biology'],
        classes: ['Form 1B'],
      });
      addedTeacher.classes.push('Hacked Class');
      expect(getTeacherById(102).classes).toEqual(['Form 1B']);

      updateTeacherInStore(102, { department: 'Natural Sciences' });
      expect(getTeacherById(102).department).toBe('Natural Sciences');

      expect(() => getTeacherById('102')).toThrow(TypeError);
      expect(() => getTeacherById(0)).toThrow(RangeError);

      expect(removeTeacherById(101)).toBe(true);
      expect(removeTeacherById(102)).toBe(true);
      expect(getTeachers()).toHaveLength(0);
    });
  });

  // ==========================================================================
  // 5. ES Module Visibility & Frozen Domain Namespaces
  // ==========================================================================
  test.describe('5. ES Module Visibility & Frozen Domain Namespaces', () => {
    test('all domain and utility namespaces are frozen with Object.freeze()', () => {
      const namespaces = [
        Student,
        Teacher,
        ClassRoom,
        Subject,
        Attendance,
        Calendar,
        Results,
        Api,
        Api.students,
        Api.teachers,
        Api.classes,
        Api.subjects,
        Api.results,
        Api.calendar,
        validatorMod.Validator,
        dateUtilsMod.DateUtils,
        DomUtils,
        Icons,
        ICONS,
      ];

      namespaces.forEach((ns) => {
        expect(Object.isFrozen(ns)).toBe(true);
      });

      // Attempting to overwrite a method on a frozen namespace throws TypeError in ES module strict mode
      expect(() => {
        Student.getAll = () => [];
      }).toThrow(TypeError);
    });

    test('ClassRoom and Subject namespaces encapsulate directory stores with deep cloning and validation', () => {
      const initialClasses = [{ id: 10, name: 'Form 1A', active: true }];
      ClassRoom.setAll(initialClasses);
      initialClasses[0].name = 'MUTATED_CLASS';
      expect(ClassRoom.getAll()[0].name).toBe('Form 1A');

      const addedCls = ClassRoom.add({ id: 11, name: 'Form 1B', active: true });
      addedCls.name = 'MUTATED_ADDED';
      expect(ClassRoom.getAll()).toHaveLength(2);
      expect(ClassRoom.removeById(11)).toBe(true);
      expect(ClassRoom.getAll()).toHaveLength(1);
      expect(() => ClassRoom.removeById('bad')).toThrow(TypeError);
      expect(() => ClassRoom.removeById(0)).toThrow(RangeError);

      const initialSubjects = [{ id: 20, name: 'Chemistry', code: 'CHM101', active: true }];
      Subject.setAll(initialSubjects);
      initialSubjects[0].name = 'MUTATED_SUBJECT';
      expect(Subject.getAll()[0].name).toBe('Chemistry');

      const addedSub = Subject.add({ id: 21, name: 'Biology', code: 'BIO101', active: true });
      addedSub.name = 'MUTATED_ADDED_SUB';
      expect(Subject.getAll()).toHaveLength(2);
      expect(Subject.removeById(21)).toBe(true);
      expect(Subject.getAll()).toHaveLength(1);
      expect(() => Subject.removeById('bad')).toThrow(TypeError);
      expect(() => Subject.removeById(0)).toThrow(RangeError);
    });

    test('internal helper functions and options remain unexported (private to their ES modules)', () => {
      expect(validatorMod.isObject).toBeUndefined();
      expect(validatorMod.validateSubjectScoreItem).toBeUndefined();
      expect(dateUtilsMod.termRangeOptions).toBeUndefined();
      expect(classRosterMod.classCardHTML).toBeUndefined();
      expect(classRosterMod.renderClassGrid).toBeUndefined();
      expect(subjectRosterMod.subjectCardHTML).toBeUndefined();
      expect(subjectRosterMod.renderSubjectGrid).toBeUndefined();
      expect(studentRosterMod.studentInfo).toBeUndefined();
      expect(topAchieversMod.compareStudentGpa).toBeUndefined();
      expect(topAchieversMod.renderTopAchievers).toBeUndefined();
    });
  });
});

