// apiValidator.js - Lightweight, Zero-Dependency Runtime Data Validation at API Trust Boundaries

/**
 * Custom Error thrown when an API response violates its expected schema contract.
 * Designed to provide clear debugging details while preventing sensitive student/financial
 * personal identifiable information (PII) from being printed to logs.
 */
export class ApiValidationError extends Error {
  /**
   * @param {string} message - Human-readable explanation of why validation failed
   * @param {string} endpoint - The API endpoint or operation where the error occurred
   * @param {Object} [details] - Non-sensitive context (e.g. field name, expected type, received type)
   */
  constructor(message, endpoint = 'Unknown API', details = {}) {
    super(`[ApiValidationError] ${endpoint}: ${message}`);
    this.name = 'ApiValidationError';
    this.endpoint = endpoint;
    this.details = details;
  }
}

// ============================================================================
// Section 1: Primitive Type & Structure Assertions
// ============================================================================

/**
 * Checks whether a value is a non-null, non-array object.
 * @param {*} value
 * @returns {boolean}
 */
export function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Asserts that a value is an object, throwing ApiValidationError if not.
 * @param {*} value
 * @param {string} fieldName
 * @param {string} endpoint
 * @returns {Object}
 */
export function assertObject(value, fieldName, endpoint) {
  if (!isObject(value)) {
    throw new ApiValidationError(
      `Field "${fieldName}" must be an object, received ${value === null ? 'null' : typeof value}.`,
      endpoint,
      { field: fieldName, expected: 'object', received: typeof value }
    );
  }
  return value;
}

/**
 * Asserts that a value is a valid string with optional constraints.
 * @param {*} value
 * @param {string} fieldName
 * @param {string} endpoint
 * @param {Object} [options]
 * @param {number} [options.minLength=0]
 * @param {RegExp} [options.pattern=null]
 * @param {boolean} [options.optional=false] - If true, undefined is allowed
 * @param {boolean} [options.nullable=false] - If true, null is allowed
 * @returns {string|null|undefined}
 */
export function assertString(value, fieldName, endpoint, { minLength = 0, pattern = null, optional = false, nullable = false } = {}) {
  if (value === undefined) {
    if (optional) return undefined;
    throw new ApiValidationError(`Missing required string field "${fieldName}".`, endpoint, { field: fieldName });
  }

  if (value === null) {
    if (nullable) return null;
    throw new ApiValidationError(`Field "${fieldName}" cannot be null.`, endpoint, { field: fieldName });
  }

  if (typeof value !== 'string') {
    throw new ApiValidationError(
      `Field "${fieldName}" must be a string, received ${typeof value}.`,
      endpoint,
      { field: fieldName, expected: 'string', received: typeof value }
    );
  }

  const trimmed = value.trim();
  if (minLength > 0 && trimmed.length < minLength) {
    throw new ApiValidationError(
      `Field "${fieldName}" must have at least ${minLength} characters (received empty/blank string).`,
      endpoint,
      { field: fieldName, minLength, receivedLength: trimmed.length }
    );
  }

  if (pattern && !pattern.test(value)) {
    throw new ApiValidationError(
      `Field "${fieldName}" does not match the expected pattern.`,
      endpoint,
      { field: fieldName }
    );
  }

  return value;
}

/**
 * Asserts that a value is a valid number with optional constraints.
 * @param {*} value
 * @param {string} fieldName
 * @param {string} endpoint
 * @param {Object} [options]
 * @param {number} [options.min=-Infinity]
 * @param {number} [options.max=Infinity]
 * @param {boolean} [options.integer=false]
 * @param {boolean} [options.optional=false]
 * @param {boolean} [options.nullable=false]
 * @returns {number|null|undefined}
 */
export function assertNumber(value, fieldName, endpoint, { min = -Infinity, max = Infinity, integer = false, optional = false, nullable = false } = {}) {
  if (value === undefined) {
    if (optional) return undefined;
    throw new ApiValidationError(`Missing required numeric field "${fieldName}".`, endpoint, { field: fieldName });
  }

  if (value === null) {
    if (nullable) return null;
    throw new ApiValidationError(`Field "${fieldName}" cannot be null.`, endpoint, { field: fieldName });
  }

  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new ApiValidationError(
      `Field "${fieldName}" must be a finite number, received ${typeof value === 'number' ? 'NaN' : typeof value}.`,
      endpoint,
      { field: fieldName, expected: 'number', received: typeof value }
    );
  }

  if (integer && !Number.isInteger(value)) {
    throw new ApiValidationError(
      `Field "${fieldName}" must be an integer, received float ${value}.`,
      endpoint,
      { field: fieldName, expected: 'integer', received: value }
    );
  }

  if (value < min || value > max) {
    throw new ApiValidationError(
      `Field "${fieldName}" must be between ${min} and ${max}, received ${value}.`,
      endpoint,
      { field: fieldName, min, max, received: value }
    );
  }

  return value;
}

/**
 * Asserts that a value is a boolean.
 * @param {*} value
 * @param {string} fieldName
 * @param {string} endpoint
 * @param {Object} [options]
 * @param {boolean} [options.optional=false]
 * @param {boolean} [options.nullable=false]
 * @returns {boolean|null|undefined}
 */
export function assertBoolean(value, fieldName, endpoint, { optional = false, nullable = false } = {}) {
  if (value === undefined) {
    if (optional) return undefined;
    throw new ApiValidationError(`Missing required boolean field "${fieldName}".`, endpoint, { field: fieldName });
  }

  if (value === null) {
    if (nullable) return null;
    throw new ApiValidationError(`Field "${fieldName}" cannot be null.`, endpoint, { field: fieldName });
  }

  if (typeof value !== 'boolean') {
    throw new ApiValidationError(
      `Field "${fieldName}" must be a boolean, received ${typeof value}.`,
      endpoint,
      { field: fieldName, expected: 'boolean', received: typeof value }
    );
  }

  return value;
}

/**
 * Asserts that a value is an array, and validates every item with itemValidator.
 * @param {*} value
 * @param {string} fieldName
 * @param {Function} itemValidator - function(item, index, endpoint) -> validatedItem
 * @param {string} endpoint
 * @param {Object} [options]
 * @param {number} [options.minLength=0]
 * @param {boolean} [options.optional=false]
 * @param {boolean} [options.nullable=false]
 * @returns {Array|null|undefined}
 */
export function assertArray(value, fieldName, itemValidator, endpoint, { minLength = 0, optional = false, nullable = false } = {}) {
  if (value === undefined) {
    if (optional) return undefined;
    throw new ApiValidationError(`Missing required array field "${fieldName}".`, endpoint, { field: fieldName });
  }

  if (value === null) {
    if (nullable) return null;
    throw new ApiValidationError(`Field "${fieldName}" cannot be null.`, endpoint, { field: fieldName });
  }

  if (!Array.isArray(value)) {
    throw new ApiValidationError(
      `Field "${fieldName}" must be an array, received ${typeof value}.`,
      endpoint,
      { field: fieldName, expected: 'array', received: typeof value }
    );
  }

  if (value.length < minLength) {
    throw new ApiValidationError(
      `Array "${fieldName}" must contain at least ${minLength} items (received ${value.length}).`,
      endpoint,
      { field: fieldName, minLength, receivedLength: value.length }
    );
  }

  if (typeof itemValidator === 'function') {
    return value.map((item, idx) => itemValidator(item, `${fieldName}[${idx}]`, endpoint));
  }

  return value;
}

/**
 * Asserts that a value is a date string (ISO YYYY-MM-DD or full ISO 8601 string).
 * @param {*} value
 * @param {string} fieldName
 * @param {string} endpoint
 * @param {Object} [options]
 * @param {boolean} [options.optional=false]
 * @param {boolean} [options.nullable=false]
 * @returns {string|null|undefined}
 */
export function assertDateString(value, fieldName, endpoint, { optional = false, nullable = false } = {}) {
  if (value === undefined && optional) return undefined;
  if (value === null && nullable) return null;

  assertString(value, fieldName, endpoint, { minLength: 4, optional, nullable });
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    throw new ApiValidationError(
      `Field "${fieldName}" must be a valid date string (e.g. "YYYY-MM-DD" or ISO 8601), received "${value}".`,
      endpoint,
      { field: fieldName, received: value }
    );
  }
  return value;
}

/**
 * Asserts that a value belongs to an allowed set of enum string values.
 * @param {*} value
 * @param {string} fieldName
 * @param {string[]} allowedValues
 * @param {string} endpoint
 * @param {Object} [options]
 * @param {boolean} [options.optional=false]
 * @param {boolean} [options.nullable=false]
 * @returns {string|null|undefined}
 */
export function assertEnum(value, fieldName, allowedValues, endpoint, { optional = false, nullable = false } = {}) {
  if (value === undefined && optional) return undefined;
  if (value === null && nullable) return null;

  assertString(value, fieldName, endpoint, { minLength: 1, optional, nullable });
  if (!allowedValues.includes(value)) {
    throw new ApiValidationError(
      `Field "${fieldName}" has invalid value "${value}". Allowed: [${allowedValues.join(', ')}].`,
      endpoint,
      { field: fieldName, allowedValues, received: value }
    );
  }
  return value;
}

// ============================================================================
// Section 2: Domain-Specific Resource Validators
// ============================================================================

/**
 * Validates a Student object against the backend Student entity contract.
 * @param {*} data
 * @param {string} [endpoint='API']
 * @returns {Object} Validated student record
 */
export function validateStudent(data, endpoint = 'Student API') {
  assertObject(data, 'Student', endpoint);

  const id = assertNumber(data.id, 'id', endpoint, { integer: true, min: 1 });
  const name = assertString(data.name, 'name', endpoint, { minLength: 1 });
  const gender = assertString(data.gender, 'gender', endpoint, { minLength: 1, optional: true });

  // In backend Student.java, studentClass is serialized as "class" via @JsonProperty("class")
  const studentClass = assertString(data.class || data.studentClass, 'class', endpoint, { minLength: 1, optional: true }) || 'Unassigned';

  const yearOfEnrollment = assertNumber(data.yearOfEnrollment, 'yearOfEnrollment', endpoint, {
    integer: true,
    min: 2000,
    max: 2050,
    optional: true,
    nullable: true,
  });

  const dateOfBirth = assertDateString(data.dateOfBirth, 'dateOfBirth', endpoint, { optional: true, nullable: true });
  const email = assertString(data.email, 'email', endpoint, { optional: true, nullable: true });
  const phone = assertString(data.phone, 'phone', endpoint, { optional: true, nullable: true });

  // Subjects list: array of strings
  const subjects = assertArray(
    data.subjects,
    'subjects',
    (item, itemPath) => assertString(item, itemPath, endpoint, { minLength: 1 }),
    endpoint,
    { optional: true, nullable: true }
  ) || [];

  const gpa = assertNumber(data.gpa, 'gpa', endpoint, { min: 0.0, max: 4.0, optional: true, nullable: true });
  const attendance = assertNumber(data.attendance, 'attendance', endpoint, { min: 0, max: 100, optional: true, nullable: true });

  // Daily attendance nested object
  let dailyAttendance = { status: 'Unmarked', timestamp: '--' };
  if (data.dailyAttendance !== undefined && data.dailyAttendance !== null) {
    assertObject(data.dailyAttendance, 'dailyAttendance', endpoint);
    dailyAttendance = {
      status: assertString(data.dailyAttendance.status, 'dailyAttendance.status', endpoint, { optional: true }) || 'Unmarked',
      timestamp: assertString(data.dailyAttendance.timestamp, 'dailyAttendance.timestamp', endpoint, { optional: true }) || '--',
    };
  }

  const feesStatus = assertString(data.feesStatus, 'feesStatus', endpoint, { optional: true, nullable: true }) || 'Pending';

  // Guardian nested object
  let guardian = { name: '', relation: 'Guardian', phone: '' };
  if (data.guardian !== undefined && data.guardian !== null) {
    assertObject(data.guardian, 'guardian', endpoint);
    guardian = {
      name: assertString(data.guardian.name, 'guardian.name', endpoint, { optional: true }) || '',
      relation: assertString(data.guardian.relation, 'guardian.relation', endpoint, { optional: true }) || 'Guardian',
      phone: assertString(data.guardian.phone, 'guardian.phone', endpoint, { optional: true }) || '',
    };
  }

  return {
    id,
    name,
    gender: gender || 'Other',
    class: studentClass,
    studentClass,
    yearOfEnrollment: yearOfEnrollment || new Date().getFullYear(),
    dateOfBirth: dateOfBirth || null,
    email: email || '',
    phone: phone || '',
    subjects,
    gpa: gpa !== undefined ? gpa : null,
    attendance: attendance !== undefined ? attendance : 100,
    dailyAttendance,
    feesStatus,
    guardian,
  };
}

/**
 * Validates an array of Student objects.
 * @param {*} data
 * @param {string} [endpoint='API']
 * @returns {Array<Object>}
 */
export function validateStudentList(data, endpoint = 'Student List API') {
  return assertArray(data, 'students', (item, _path) => validateStudent(item, endpoint), endpoint);
}

/**
 * Validates a Teacher object against the backend Teacher entity contract.
 * @param {*} data
 * @param {string} [endpoint='Teacher API']
 * @returns {Object}
 */
export function validateTeacher(data, endpoint = 'Teacher API') {
  assertObject(data, 'Teacher', endpoint);

  const id = assertNumber(data.id, 'id', endpoint, { integer: true, min: 1 });
  const teacherNumber = assertString(data.teacherNumber, 'teacherNumber', endpoint, { optional: true, nullable: true }) || `TCH-${String(id).padStart(3, '0')}`;
  const firstName = assertString(data.firstName, 'firstName', endpoint, { minLength: 1 });
  const lastName = assertString(data.lastName, 'lastName', endpoint, { minLength: 1 });

  const derivedName = `${firstName} ${lastName}`.trim();
  const name = assertString(data.name, 'name', endpoint, { optional: true }) || derivedName;

  const email = assertString(data.email, 'email', endpoint, { optional: true, nullable: true }) || '';
  const phone = assertString(data.phone, 'phone', endpoint, { optional: true, nullable: true }) || '';
  const gender = assertString(data.gender, 'gender', endpoint, { optional: true, nullable: true }) || 'Other';
  const dateOfBirth = assertDateString(data.dateOfBirth, 'dateOfBirth', endpoint, { optional: true, nullable: true });
  const hireDate = assertDateString(data.hireDate, 'hireDate', endpoint, { optional: true, nullable: true });
  const department = assertString(data.department, 'department', endpoint, { optional: true, nullable: true }) || 'General';
  const qualification = assertString(data.qualification, 'qualification', endpoint, { optional: true, nullable: true }) || '';
  const employmentStatus = assertString(data.employmentStatus, 'employmentStatus', endpoint, { optional: true, nullable: true }) || 'Full-time';

  const subjects = assertArray(
    data.subjects,
    'subjects',
    (item, itemPath) => assertString(item, itemPath, endpoint, { minLength: 1 }),
    endpoint,
    { optional: true, nullable: true }
  ) || [];

  const classes = assertArray(
    data.classes,
    'classes',
    (item, itemPath) => assertString(item, itemPath, endpoint, { minLength: 1 }),
    endpoint,
    { optional: true, nullable: true }
  ) || [];

  return {
    id,
    teacherNumber,
    firstName,
    lastName,
    name,
    email,
    phone,
    gender,
    dateOfBirth: dateOfBirth || null,
    hireDate: hireDate || null,
    department,
    qualification,
    employmentStatus,
    subjects,
    classes,
  };
}

/**
 * Validates an array of Teacher objects.
 * @param {*} data
 * @param {string} [endpoint='Teacher List API']
 * @returns {Array<Object>}
 */
export function validateTeacherList(data, endpoint = 'Teacher List API') {
  return assertArray(data, 'teachers', (item, _path) => validateTeacher(item, endpoint), endpoint);
}

/**
 * Validates a ClassResponseDto object against the backend contract.
 * @param {*} data
 * @param {string} [endpoint='Class API']
 * @returns {Object}
 */
export function validateClassResponse(data, endpoint = 'Class API') {
  assertObject(data, 'ClassResponseDto', endpoint);

  const id = assertNumber(data.id, 'id', endpoint, { integer: true, min: 1 });
  const name = assertString(data.name, 'name', endpoint, { minLength: 1 });
  const description = assertString(data.description, 'description', endpoint, { optional: true, nullable: true }) || '';
  const active = assertBoolean(data.active, 'active', endpoint, { optional: true }) ?? true;
  const studentCount = assertNumber(data.studentCount, 'studentCount', endpoint, { integer: true, min: 0, optional: true }) ?? 0;

  return {
    id,
    name,
    description,
    active,
    studentCount,
  };
}

/**
 * Validates an array of ClassResponseDto objects.
 * @param {*} data
 * @param {string} [endpoint='Class List API']
 * @returns {Array<Object>}
 */
export function validateClassResponseList(data, endpoint = 'Class List API') {
  return assertArray(data, 'classes', (item, _path) => validateClassResponse(item, endpoint), endpoint);
}

/**
 * Validates a Subject object against the backend Subject entity contract.
 * @param {*} data
 * @param {string} [endpoint='Subject API']
 * @returns {Object}
 */
export function validateSubject(data, endpoint = 'Subject API') {
  assertObject(data, 'Subject', endpoint);

  const id = assertNumber(data.id, 'id', endpoint, { integer: true, min: 1 });
  const name = assertString(data.name, 'name', endpoint, { minLength: 1 });
  const code = assertString(data.code, 'code', endpoint, { optional: true, nullable: true }) || '';
  const department = assertString(data.department, 'department', endpoint, { optional: true, nullable: true }) || '';
  const description = assertString(data.description, 'description', endpoint, { optional: true, nullable: true }) || '';
  const active = assertBoolean(data.active, 'active', endpoint, { optional: true }) ?? true;

  return {
    id,
    name,
    code,
    department,
    description,
    active,
  };
}

/**
 * Validates an array of Subject objects.
 * @param {*} data
 * @param {string} [endpoint='Subject List API']
 * @returns {Array<Object>}
 */
export function validateSubjectList(data, endpoint = 'Subject List API') {
  return assertArray(data, 'subjects', (item, _path) => validateSubject(item, endpoint), endpoint);
}

/**
 * Validates an AcademicTerm object against the backend contract.
 * @param {*} data
 * @param {string} [endpoint='Academic Term API']
 * @returns {Object}
 */
export function validateAcademicTerm(data, endpoint = 'Academic Term API') {
  assertObject(data, 'AcademicTerm', endpoint);

  const id = assertNumber(data.id, 'id', endpoint, { integer: true, min: 1 });
  const name = assertString(data.name, 'name', endpoint, { minLength: 1 });
  const termCode = assertString(data.termCode, 'termCode', endpoint, { optional: true, nullable: true }) || '';
  const academicYear = assertString(data.academicYear, 'academicYear', endpoint, { optional: true, nullable: true }) || '';
  const startDate = assertDateString(data.startDate, 'startDate', endpoint);
  const endDate = assertDateString(data.endDate, 'endDate', endpoint);
  const status = assertString(data.status, 'status', endpoint, { optional: true }) || 'Upcoming';
  const totalWeeks = assertNumber(data.totalWeeks, 'totalWeeks', endpoint, { integer: true, min: 1, optional: true, nullable: true }) || null;

  return {
    id,
    name,
    termCode,
    academicYear,
    startDate,
    endDate,
    status,
    totalWeeks,
  };
}

/**
 * Validates an array of AcademicTerm objects.
 * @param {*} data
 * @param {string} [endpoint='Academic Term List API']
 * @returns {Array<Object>}
 */
export function validateAcademicTermList(data, endpoint = 'Academic Term List API') {
  return assertArray(data, 'terms', (item, _path) => validateAcademicTerm(item, endpoint), endpoint);
}

/**
 * Validates a CalendarEvent object against the backend contract.
 * @param {*} data
 * @param {string} [endpoint='Calendar Event API']
 * @returns {Object}
 */
export function validateCalendarEvent(data, endpoint = 'Calendar Event API') {
  assertObject(data, 'CalendarEvent', endpoint);

  const id = assertNumber(data.id, 'id', endpoint, { integer: true, min: 1 });
  const title = assertString(data.title, 'title', endpoint, { minLength: 1 });
  const category = assertEnum(
    data.category,
    'category',
    ['term', 'event', 'exam', 'holiday', 'deadline'],
    endpoint,
    { optional: true }
  ) || 'event';

  const date = assertDateString(data.date, 'date', endpoint);
  const time = assertString(data.time, 'time', endpoint, { optional: true, nullable: true }) || '';
  const location = assertString(data.location, 'location', endpoint, { optional: true, nullable: true }) || '';
  const description = assertString(data.description, 'description', endpoint, { optional: true, nullable: true }) || '';
  const targetAudience = assertString(data.targetAudience, 'targetAudience', endpoint, { optional: true, nullable: true }) || '';
  const badge = assertString(data.badge, 'badge', endpoint, { optional: true, nullable: true }) || '';
  const eventCode = assertString(data.eventCode, 'eventCode', endpoint, { optional: true, nullable: true }) || '';

  return {
    id,
    title,
    category,
    date,
    time,
    location,
    description,
    targetAudience,
    badge,
    eventCode,
  };
}

/**
 * Validates an array of CalendarEvent objects.
 * @param {*} data
 * @param {string} [endpoint='Calendar Event List API']
 * @returns {Array<Object>}
 */
export function validateCalendarEventList(data, endpoint = 'Calendar Event List API') {
  return assertArray(data, 'events', (item, _path) => validateCalendarEvent(item, endpoint), endpoint);
}

/**
 * Validates a single SubjectScoreItem inside a student report.
 * @param {*} item
 * @param {string} path
 * @param {string} endpoint
 * @returns {Object}
 */
export function validateSubjectScoreItem(item, path, endpoint) {
  assertObject(item, path, endpoint);

  const subjectName = assertString(item.subjectName, `${path}.subjectName`, endpoint, { minLength: 1 });
  const caScore = assertNumber(item.caScore, `${path}.caScore`, endpoint, { min: 0, max: 100, optional: true, nullable: true });
  const examScore = assertNumber(item.examScore, `${path}.examScore`, endpoint, { min: 0, max: 100, optional: true, nullable: true });
  const totalScore = assertNumber(item.totalScore, `${path}.totalScore`, endpoint, { min: 0, max: 100, optional: true, nullable: true });
  const remark = assertString(item.remark, `${path}.remark`, endpoint, { optional: true, nullable: true }) || '';

  return {
    subjectName,
    caScore: caScore !== undefined ? caScore : null,
    examScore: examScore !== undefined ? examScore : null,
    totalScore: totalScore !== undefined ? totalScore : null,
    remark,
  };
}

/**
 * Validates a StudentReportDto object against the backend ResultController contract.
 * @param {*} data
 * @param {string} [endpoint='Report Card API']
 * @returns {Object}
 */
export function validateStudentReport(data, endpoint = 'Report Card API') {
  assertObject(data, 'StudentReportDto', endpoint);

  const studentId = assertNumber(data.studentId, 'studentId', endpoint, { integer: true, min: 1 });
  const studentName = assertString(data.studentName, 'studentName', endpoint, { minLength: 1 });
  const studentClass = assertString(data.studentClass, 'studentClass', endpoint, { minLength: 1 });

  const email = assertString(data.email, 'email', endpoint, { optional: true, nullable: true }) || '';
  const academicYear = assertString(data.academicYear, 'academicYear', endpoint, { optional: true, nullable: true }) || '';
  const term = assertString(data.term, 'term', endpoint, { optional: true, nullable: true }) || '';

  const totalMarks = assertNumber(data.totalMarks, 'totalMarks', endpoint, { min: 0, optional: true, nullable: true });
  const averageScore = assertNumber(data.averageScore, 'averageScore', endpoint, { min: 0, max: 100, optional: true, nullable: true });

  const evaluatedSubjectsCount = assertNumber(data.evaluatedSubjectsCount, 'evaluatedSubjectsCount', endpoint, {
    integer: true,
    min: 0,
    optional: true,
  }) ?? 0;

  const totalSubjectsCount = assertNumber(data.totalSubjectsCount, 'totalSubjectsCount', endpoint, {
    integer: true,
    min: 0,
    optional: true,
  }) ?? 0;

  const teacherRemark = assertString(data.teacherRemark, 'teacherRemark', endpoint, { optional: true, nullable: true }) || '';
  const headteacherRemark = assertString(data.headteacherRemark, 'headteacherRemark', endpoint, { optional: true, nullable: true }) || '';

  const subjectScores = assertArray(
    data.subjectScores,
    'subjectScores',
    (item, itemPath) => validateSubjectScoreItem(item, itemPath, endpoint),
    endpoint,
    { optional: true, nullable: true }
  ) || [];

  return {
    studentId,
    studentName,
    studentClass,
    email,
    academicYear,
    term,
    totalMarks: totalMarks !== undefined ? totalMarks : null,
    averageScore: averageScore !== undefined ? averageScore : null,
    evaluatedSubjectsCount,
    totalSubjectsCount,
    teacherRemark,
    headteacherRemark,
    subjectScores,
  };
}

/**
 * Validates an array of StudentReportDto objects.
 * @param {*} data
 * @param {string} [endpoint='All Reports API']
 * @returns {Array<Object>}
 */
export function validateStudentReportList(data, endpoint = 'All Reports API') {
  return assertArray(data, 'reports', (item, _path) => validateStudentReport(item, endpoint), endpoint);
}

/**
 * Validates the response from DELETE /api/classes/{id}.
 * Backend returns: { message: string, status: string, action: string, class?: ClassResponseDto }
 * or fallback { success: true }
 * @param {*} data
 * @param {string} [endpoint='Delete Class API']
 * @returns {Object}
 */
export function validateDeleteClassResult(data, endpoint = 'Delete Class API') {
  assertObject(data, 'DeleteClassResult', endpoint);

  const message = assertString(data.message, 'message', endpoint, { optional: true }) || 'Operation completed successfully';
  const status = assertString(data.status, 'status', endpoint, { optional: true }) || 'COMPLETED';
  const action = assertString(data.action, 'action', endpoint, { optional: true }) || 'PROCESSED';

  let classData = null;
  if (data.class) {
    classData = validateClassResponse(data.class, `${endpoint} (nested class)`);
  }

  return {
    message,
    status,
    action,
    class: classData,
    success: true,
  };
}
