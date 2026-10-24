import { test, expect } from '@playwright/test';
import {
  ApiValidationError,
  assertObject,
  assertString,
  assertNumber,
  assertBoolean,
  assertArray,
  assertDateString,
  assertEnum,
  validateStudent,
  validateStudentList,
  validateTeacher,
  validateTeacherList,
  validateClassResponse,
  validateClassResponseList,
  validateSubject,
  validateSubjectList,
  validateAcademicTerm,
  validateAcademicTermList,
  validateCalendarEvent,
  validateCalendarEventList,
  validateStudentReport,
  validateStudentReportList,
  validateDeleteClassResult,
} from '../frontEnd/js/utils/apiValidator.js';

test.describe('Runtime API Data Validation Suite', () => {

  // --------------------------------------------------------------------------
  // 1. Primitive Validator Assertions
  // --------------------------------------------------------------------------
  test.describe('Primitive Assertions', () => {
    test('assertObject: validates objects and rejects primitives/arrays/null', () => {
      expect(assertObject({ id: 1 }, 'testObj', 'TEST')).toEqual({ id: 1 });

      expect(() => assertObject(null, 'testObj', 'TEST')).toThrow(ApiValidationError);
      expect(() => assertObject([1, 2], 'testObj', 'TEST')).toThrow(ApiValidationError);
      expect(() => assertObject('string', 'testObj', 'TEST')).toThrow(ApiValidationError);
      expect(() => assertObject(123, 'testObj', 'TEST')).toThrow(ApiValidationError);
      expect(() => assertObject(undefined, 'testObj', 'TEST')).toThrow(ApiValidationError);
    });

    test('assertString: validates strings and enforces minLength and nullability', () => {
      expect(assertString('hello', 'str', 'TEST', { minLength: 1 })).toBe('hello');
      expect(assertString(null, 'str', 'TEST', { nullable: true })).toBeNull();
      expect(assertString(undefined, 'str', 'TEST', { optional: true })).toBeUndefined();

      // Empty string when minLength is 1
      expect(() => assertString('   ', 'str', 'TEST', { minLength: 1 })).toThrow(ApiValidationError);
      // Non-string
      expect(() => assertString(123, 'str', 'TEST')).toThrow(ApiValidationError);
      // Null when not nullable
      expect(() => assertString(null, 'str', 'TEST', { nullable: false })).toThrow(ApiValidationError);
      // Undefined when required
      expect(() => assertString(undefined, 'str', 'TEST', { optional: false })).toThrow(ApiValidationError);
    });

    test('assertNumber: validates numbers, integers, ranges, and nullability', () => {
      expect(assertNumber(42, 'num', 'TEST')).toBe(42);
      expect(assertNumber(10, 'num', 'TEST', { integer: true, min: 1, max: 100 })).toBe(10);
      expect(assertNumber(null, 'num', 'TEST', { nullable: true })).toBeNull();
      expect(assertNumber(undefined, 'num', 'TEST', { optional: true })).toBeUndefined();

      // Floats when integer required
      expect(() => assertNumber(3.14, 'num', 'TEST', { integer: true })).toThrow(ApiValidationError);
      // Out of range
      expect(() => assertNumber(150, 'num', 'TEST', { min: 0, max: 100 })).toThrow(ApiValidationError);
      expect(() => assertNumber(-5, 'num', 'TEST', { min: 0 })).toThrow(ApiValidationError);
      // NaN or string numbers
      expect(() => assertNumber(NaN, 'num', 'TEST')).toThrow(ApiValidationError);
      expect(() => assertNumber('42', 'num', 'TEST')).toThrow(ApiValidationError);
    });

    test('assertBoolean: validates booleans', () => {
      expect(assertBoolean(true, 'bool', 'TEST')).toBe(true);
      expect(assertBoolean(false, 'bool', 'TEST')).toBe(false);
      expect(assertBoolean(null, 'bool', 'TEST', { nullable: true })).toBeNull();
      expect(assertBoolean(undefined, 'bool', 'TEST', { optional: true })).toBeUndefined();

      expect(() => assertBoolean('true', 'bool', 'TEST')).toThrow(ApiValidationError);
      expect(() => assertBoolean(1, 'bool', 'TEST')).toThrow(ApiValidationError);
    });

    test('assertArray: validates arrays and item validators', () => {
      const result = assertArray([1, 2, 3], 'arr', (item, path, endpoint) => assertNumber(item, path, endpoint, { integer: true }), 'TEST');
      expect(result).toEqual([1, 2, 3]);

      // Empty array is valid by default
      expect(assertArray([], 'arr', null, 'TEST')).toEqual([]);

      // Min length violation
      expect(() => assertArray([], 'arr', null, 'TEST', { minLength: 1 })).toThrow(ApiValidationError);
      // Non-array
      expect(() => assertArray({}, 'arr', null, 'TEST')).toThrow(ApiValidationError);
      expect(() => assertArray('not-array', 'arr', null, 'TEST')).toThrow(ApiValidationError);

      // Item validation failure inside array
      expect(() => assertArray([1, 'bad', 3], 'arr', (item, path, endpoint) => assertNumber(item, path, endpoint), 'TEST')).toThrow(ApiValidationError);
    });

    test('assertDateString: validates date strings', () => {
      expect(assertDateString('2026-05-15', 'date', 'TEST')).toBe('2026-05-15');
      expect(assertDateString('2026-05-15T08:30:00Z', 'date', 'TEST')).toBe('2026-05-15T08:30:00Z');

      expect(() => assertDateString('invalid-date', 'date', 'TEST')).toThrow(ApiValidationError);
      expect(() => assertDateString(123456789, 'date', 'TEST')).toThrow(ApiValidationError);
    });

    test('assertEnum: validates enum choices', () => {
      const allowed = ['Active', 'Upcoming', 'Completed'];
      expect(assertEnum('Active', 'status', allowed, 'TEST')).toBe('Active');
      expect(assertEnum('Completed', 'status', allowed, 'TEST')).toBe('Completed');

      expect(() => assertEnum('Unknown', 'status', allowed, 'TEST')).toThrow(ApiValidationError);
      expect(() => assertEnum(123, 'status', allowed, 'TEST')).toThrow(ApiValidationError);
    });
  });

  // --------------------------------------------------------------------------
  // 2. Student Domain Validation
  // --------------------------------------------------------------------------
  test.describe('Student Validation', () => {
    const validStudentFixture = {
      id: 1,
      name: 'Ama Mensah',
      gender: 'Female',
      class: 'Form 1A',
      yearOfEnrollment: 2024,
      dateOfBirth: '2008-04-12',
      email: 'ama.mensah@school.edu',
      phone: '+233 24 123 4567',
      subjects: ['Mathematics', 'English', 'ICT'],
      gpa: 3.85,
      attendance: 95,
      dailyAttendance: {
        status: 'Present',
        timestamp: '2026-10-24T08:30:00Z',
      },
      feesStatus: 'Paid',
      guardian: {
        name: 'Mr. Kwame Mensah',
        relation: 'Father',
        phone: '+233 24 999 8888',
      },
    };

    test('validates a complete, compliant Student object', () => {
      const validated = validateStudent(validStudentFixture, 'TEST');
      expect(validated.id).toBe(1);
      expect(validated.name).toBe('Ama Mensah');
      expect(validated.class).toBe('Form 1A');
      expect(validated.subjects).toEqual(['Mathematics', 'English', 'ICT']);
      expect(validated.guardian.relation).toBe('Father');
    });

    test('handles Student with studentClass attribute mapping and nullables', () => {
      const studentWithStudentClass = {
        id: 2,
        name: 'Kofi Annan',
        studentClass: 'Form 2B',
        gender: 'Male',
        gpa: null,
        attendance: 100,
        subjects: [],
      };

      const validated = validateStudent(studentWithStudentClass, 'TEST');
      expect(validated.id).toBe(2);
      expect(validated.class).toBe('Form 2B');
      expect(validated.gpa).toBeNull();
      expect(validated.subjects).toEqual([]);
      expect(validated.guardian.relation).toBe('Guardian'); // defaulted
    });

    test('rejects Student with missing required fields or wrong types', () => {
      // Missing id
      expect(() => validateStudent({ ...validStudentFixture, id: undefined })).toThrow(ApiValidationError);
      // String id instead of integer
      expect(() => validateStudent({ ...validStudentFixture, id: 'one' })).toThrow(ApiValidationError);
      // Empty name
      expect(() => validateStudent({ ...validStudentFixture, name: '   ' })).toThrow(ApiValidationError);
      // GPA out of range
      expect(() => validateStudent({ ...validStudentFixture, gpa: 4.8 })).toThrow(ApiValidationError);
      // Subjects not array
      expect(() => validateStudent({ ...validStudentFixture, subjects: 'Mathematics' })).toThrow(ApiValidationError);
    });

    test('validates an array of Students (validateStudentList)', () => {
      const list = [validStudentFixture, { ...validStudentFixture, id: 2, name: 'Yaw Boateng' }];
      const validatedList = validateStudentList(list, 'TEST');
      expect(validatedList).toHaveLength(2);
      expect(validatedList[1].name).toBe('Yaw Boateng');

      // Empty array is valid
      expect(validateStudentList([], 'TEST')).toEqual([]);

      // Array containing one invalid item throws
      const corruptList = [validStudentFixture, { id: 'bad-id' }];
      expect(() => validateStudentList(corruptList, 'TEST')).toThrow(ApiValidationError);
    });
  });

  // --------------------------------------------------------------------------
  // 3. Teacher Domain Validation
  // --------------------------------------------------------------------------
  test.describe('Teacher Validation', () => {
    const validTeacherFixture = {
      id: 1,
      teacherNumber: 'TCH-001',
      firstName: 'Kwame',
      lastName: 'Mensah',
      name: 'Kwame Mensah',
      email: 'k.mensah@school.edu',
      phone: '+233 24 111 2222',
      gender: 'Male',
      dateOfBirth: '1985-06-20',
      hireDate: '2015-09-01',
      department: 'Science',
      qualification: 'M.Ed Science Education',
      employmentStatus: 'Full-time',
      subjects: ['Physics', 'Integrated Science'],
      classes: ['Form 1A', 'Form 2B'],
    };

    test('validates a complete Teacher object', () => {
      const validated = validateTeacher(validTeacherFixture, 'TEST');
      expect(validated.id).toBe(1);
      expect(validated.name).toBe('Kwame Mensah');
      expect(validated.department).toBe('Science');
      expect(validated.subjects).toHaveLength(2);
    });

    test('derives full name if missing and defaults nullable fields', () => {
      const minimalTeacher = {
        id: 2,
        firstName: 'Abena',
        lastName: 'Osei',
      };
      const validated = validateTeacher(minimalTeacher, 'TEST');
      expect(validated.name).toBe('Abena Osei');
      expect(validated.teacherNumber).toBe('TCH-002');
      expect(validated.employmentStatus).toBe('Full-time');
      expect(validated.subjects).toEqual([]);
    });

    test('rejects Teacher missing firstName or with invalid id', () => {
      expect(() => validateTeacher({ ...validTeacherFixture, firstName: '' })).toThrow(ApiValidationError);
      expect(() => validateTeacher({ ...validTeacherFixture, id: -1 })).toThrow(ApiValidationError);
    });

    test('validates an array of Teachers (validateTeacherList)', () => {
      expect(validateTeacherList([validTeacherFixture], 'TEST')).toHaveLength(1);
      expect(() => validateTeacherList('not an array', 'TEST')).toThrow(ApiValidationError);
    });
  });

  // --------------------------------------------------------------------------
  // 4. Class Domain Validation
  // --------------------------------------------------------------------------
  test.describe('Class Validation', () => {
    const validClassFixture = {
      id: 1,
      name: 'Form 1A',
      description: 'Science and Technology focus stream',
      active: true,
      studentCount: 35,
    };

    test('validates ClassResponseDto object', () => {
      const validated = validateClassResponse(validClassFixture, 'TEST');
      expect(validated.name).toBe('Form 1A');
      expect(validated.studentCount).toBe(35);
      expect(validated.active).toBe(true);
    });

    test('rejects Class with missing name or negative studentCount', () => {
      expect(() => validateClassResponse({ ...validClassFixture, name: '' })).toThrow(ApiValidationError);
      expect(() => validateClassResponse({ ...validClassFixture, studentCount: -5 })).toThrow(ApiValidationError);
    });

    test('validates ClassResponseList and deleteOrDeactivateClass result', () => {
      expect(validateClassResponseList([validClassFixture], 'TEST')).toHaveLength(1);

      const deleteResult = {
        message: 'Class deactivated safely.',
        status: 'ARCHIVED',
        action: 'DEACTIVATED',
      };
      const validatedDelete = validateDeleteClassResult(deleteResult, 'TEST');
      expect(validatedDelete.status).toBe('ARCHIVED');
      expect(validatedDelete.success).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // 5. Subject Domain Validation
  // --------------------------------------------------------------------------
  test.describe('Subject Validation', () => {
    const validSubjectFixture = {
      id: 1,
      name: 'Mathematics',
      code: 'MTH-101',
      department: 'Mathematics',
      description: 'Core senior high school mathematics',
      active: true,
    };

    test('validates Subject entity object', () => {
      const validated = validateSubject(validSubjectFixture, 'TEST');
      expect(validated.name).toBe('Mathematics');
      expect(validated.code).toBe('MTH-101');
      expect(validated.active).toBe(true);
    });

    test('rejects Subject with blank name', () => {
      expect(() => validateSubject({ ...validSubjectFixture, name: '  ' })).toThrow(ApiValidationError);
    });

    test('validates Subject list', () => {
      expect(validateSubjectList([validSubjectFixture], 'TEST')).toHaveLength(1);
    });
  });

  // --------------------------------------------------------------------------
  // 6. Academic Calendar & Term Validation
  // --------------------------------------------------------------------------
  test.describe('Calendar & Academic Term Validation', () => {
    test('validates AcademicTerm', () => {
      const termFixture = {
        id: 1,
        termCode: 'T1-2026',
        name: 'Term 1',
        academicYear: '2026/2027',
        startDate: '2026-09-01',
        endDate: '2026-12-18',
        status: 'Active',
        totalWeeks: 15,
      };
      const validated = validateAcademicTerm(termFixture, 'TEST');
      expect(validated.name).toBe('Term 1');
      expect(validated.status).toBe('Active');

      // Invalid date format
      expect(() => validateAcademicTerm({ ...termFixture, startDate: 'not-a-date' })).toThrow(ApiValidationError);
    });

    test('validates CalendarEvent', () => {
      const eventFixture = {
        id: 1,
        eventCode: 'EVT-01',
        category: 'exam',
        title: 'Mid-Term Examinations',
        date: '2026-10-28',
        time: '08:30 AM',
        location: 'Assembly Hall',
        description: 'Compulsory examinations for all forms',
        targetAudience: 'All Students',
        badge: 'Exams',
      };
      const validated = validateCalendarEvent(eventFixture, 'TEST');
      expect(validated.title).toBe('Mid-Term Examinations');
      expect(validated.category).toBe('exam');

      // Invalid category enum
      expect(() => validateCalendarEvent({ ...eventFixture, category: 'party' })).toThrow(ApiValidationError);
    });
  });

  // --------------------------------------------------------------------------
  // 7. Results & Student Report Card Validation
  // --------------------------------------------------------------------------
  test.describe('Results & Student Report Validation', () => {
    const validReportFixture = {
      studentId: 1,
      studentName: 'Ama Mensah',
      studentClass: 'Form 1A',
      email: 'ama@school.edu',
      academicYear: '2026/2027',
      term: 'Term 1',
      totalMarks: 255.0,
      averageScore: 85.0,
      evaluatedSubjectsCount: 3,
      totalSubjectsCount: 3,
      teacherRemark: 'Excellent performance throughout the term.',
      headteacherRemark: 'Promoted with distinction.',
      subjectScores: [
        {
          subjectName: 'Mathematics',
          caScore: 28.0,
          examScore: 65.0,
          totalScore: 93.0,
          remark: 'Excellent',
        },
        {
          subjectName: 'English',
          caScore: 25.0,
          examScore: 55.0,
          totalScore: 80.0,
          remark: 'Very Good',
        },
      ],
    };

    test('validates a complete StudentReportDto object with nested scores', () => {
      const validated = validateStudentReport(validReportFixture, 'TEST');
      expect(validated.studentName).toBe('Ama Mensah');
      expect(validated.averageScore).toBe(85.0);
      expect(validated.subjectScores).toHaveLength(2);
      expect(validated.subjectScores[0].subjectName).toBe('Mathematics');
      expect(validated.subjectScores[0].totalScore).toBe(93.0);
    });

    test('rejects StudentReportDto if subject score has invalid numeric values', () => {
      const corruptReport = {
        ...validReportFixture,
        subjectScores: [
          {
            subjectName: 'Mathematics',
            caScore: 'thirty', // string instead of number
          },
        ],
      };
      expect(() => validateStudentReport(corruptReport)).toThrow(ApiValidationError);
    });

    test('rejects StudentReportDto if missing studentId or studentName', () => {
      expect(() => validateStudentReport({ ...validReportFixture, studentId: null })).toThrow(ApiValidationError);
      expect(() => validateStudentReport({ ...validReportFixture, studentName: '' })).toThrow(ApiValidationError);
    });

    test('validates list of reports (validateStudentReportList)', () => {
      const list = validateStudentReportList([validReportFixture], 'TEST');
      expect(list).toHaveLength(1);
      expect(() => validateStudentReportList('not-array', 'TEST')).toThrow(ApiValidationError);
    });
  });

  // --------------------------------------------------------------------------
  // 9. API Client Trust Boundary Integration (Mocking Network Responses)
  // --------------------------------------------------------------------------
  test.describe('API Clients Trust Boundary Integration', () => {
    const originalFetch = globalThis.fetch;

    test.afterEach(() => {
      globalThis.fetch = originalFetch;
    });

    test('fetchStudentsFromDb: returns validated students on valid response', async () => {
      const { fetchStudentsFromDb } = await import('../frontEnd/js/api/studentApi.js');
      const mockPayload = [
        {
          id: 10,
          name: 'Kwesi Appiah',
          gender: 'Male',
          class: 'Form 2A',
          yearOfEnrollment: 2024,
          attendance: 90,
          subjects: ['Mathematics'],
        },
      ];

      globalThis.fetch = async () => ({
        ok: true,
        status: 200,
        json: async () => mockPayload,
      });

      const result = await fetchStudentsFromDb();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Kwesi Appiah');
      expect(result[0].class).toBe('Form 2A');
    });

    test('fetchStudentsFromDb: safely returns null and prevents poisoning when backend returns malformed data', async () => {
      const { fetchStudentsFromDb } = await import('../frontEnd/js/api/studentApi.js');

      // Server returns an error object with 200 OK (common proxy/mock glitch)
      globalThis.fetch = async () => ({
        ok: true,
        status: 200,
        json: async () => ({ error: 'Database disconnected' }), // Not an array!
      });

      const result = await fetchStudentsFromDb();
      // Validator caught the non-array shape; function gracefully returns null for seed fallback
      expect(result).toBeNull();
    });

    test('registerStudentInDb: throws ApiValidationError if backend returns corrupt student shape', async () => {
      const { registerStudentInDb } = await import('../frontEnd/js/api/studentApi.js');

      globalThis.fetch = async () => ({
        ok: true,
        status: 200,
        json: async () => ({ invalidField: true }), // Missing id and name
      });

      await expect(registerStudentInDb({ name: 'Test' })).rejects.toThrow(ApiValidationError);
    });

    test('createClassInDb: throws ApiValidationError if class response misses name', async () => {
      const { createClassInDb } = await import('../frontEnd/js/api/classApi.js');

      globalThis.fetch = async () => ({
        ok: true,
        status: 201,
        json: async () => ({ id: 5, studentCount: 0 }), // Missing name
      });

      await expect(createClassInDb({ name: 'New Class' })).rejects.toThrow(ApiValidationError);
    });

    test('saveScoreToDb: validates returned student report card', async () => {
      const { saveScoreToDb } = await import('../frontEnd/js/api/resultApi.js');

      const validReport = {
        studentId: 1,
        studentName: 'Ama Mensah',
        studentClass: 'Form 1A',
        totalMarks: 95.0,
        averageScore: 95.0,
        evaluatedSubjectsCount: 1,
        totalSubjectsCount: 1,
        subjectScores: [
          {
            subjectName: 'Mathematics',
            caScore: 30.0,
            examScore: 65.0,
            totalScore: 95.0,
            remark: 'Excellent',
          },
        ],
      };

      globalThis.fetch = async () => ({
        ok: true,
        status: 200,
        json: async () => validReport,
      });

      const report = await saveScoreToDb({ studentId: 1, subjectName: 'Mathematics', caScore: 30, examScore: 65 });
      expect(report.studentName).toBe('Ama Mensah');
      expect(report.averageScore).toBe(95.0);
    });
  });
});

