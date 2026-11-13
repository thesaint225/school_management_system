// Private internal student dataset — never exported directly
const students = [
  {
    id: 1,
    name: 'Ama Mensah',
    gender: 'Female',
    class: 'Form 1',
    yearOfEnrollment: 2024,
    dateOfBirth: '2009-04-15',
    email: 'ama.mensah@edumanage.edu',
    phone: '+233 24 123 4567',
    subjects: ['Mathematics', 'English', 'Integrated Science', 'ICT'],
    gpa: 3.85,
    attendance: 96,
    dailyAttendance: {
      status: 'Present',
      timestamp: '08:05 GMT',
    },
    feesStatus: 'Paid',
    guardian: {
      name: 'Mr. Kofi Mensah',
      relation: 'Father',
      phone: '+233 20 987 6543',
    },
  },
  {
    id: 2,
    name: 'Henri Miessan',
    gender: 'Male',
    class: 'Form 3',
    yearOfEnrollment: 2023,
    dateOfBirth: '2007-09-22',
    email: 'henri.miessan@edumanage.edu',
    phone: '+233 50 234 5678',
    subjects: ['Physics', 'Elective Maths', 'Chemistry', 'English'],
    gpa: 3.92,
    attendance: 98,
    dailyAttendance: {
      status: 'Present',
      timestamp: '07:55 GMT',
    },
    feesStatus: 'Paid',
    guardian: {
      name: 'Mrs. Cynthia Miessan',
      relation: 'Mother',
      phone: '+233 24 876 5432',
    },
  },
  {
    id: 3,
    name: 'Daniel Owusu',
    gender: 'Male',
    class: 'Form 2',
    yearOfEnrollment: 2024,
    dateOfBirth: '2008-11-05',
    email: 'daniel.owusu@edumanage.edu',
    phone: '+233 27 345 6789',
    subjects: ['Economics', 'Geography', 'Government', 'English'],
    gpa: 3.45,
    attendance: 91,
    dailyAttendance: {
      status: 'Late',
      timestamp: '08:35 GMT',
    },
    feesStatus: 'Pending',
    guardian: {
      name: 'Mr. Emmanuel Owusu',
      relation: 'Father',
      phone: '+233 55 765 4321',
    },
  },
  {
    id: 4,
    name: 'Madam Fausty',
    gender: 'Female',
    class: 'Form 3',
    yearOfEnrollment: 2022,
    dateOfBirth: '2006-03-18',
    email: 'fausty.mensah@edumanage.edu',
    phone: '+233 26 456 7890',
    subjects: ['Literature', 'French', 'History', 'English'],
    gpa: 3.78,
    attendance: 94,
    dailyAttendance: {
      status: 'Present',
      timestamp: '08:12 GMT',
    },
    feesStatus: 'Paid',
    guardian: {
      name: 'Dr. Kwame Appiah',
      relation: 'Uncle',
      phone: '+233 20 654 3210',
    },
  },
  {
    id: 5,
    name: 'Kwame Mensah',
    gender: 'Male',
    class: 'Form 1',
    yearOfEnrollment: 2025,
    dateOfBirth: '2010-01-30',
    email: 'kwame.mensah@edumanage.edu',
    phone: '+233 54 567 8901',
    subjects: ['General Science', 'Mathematics', 'Social Studies', 'ICT'],
    gpa: 3.6,
    attendance: 88,
    dailyAttendance: {
      status: 'Absent',
      timestamp: null,
    },
    feesStatus: 'Overdue',
    guardian: {
      name: 'Mrs. Grace Mensah',
      relation: 'Mother',
      phone: '+233 24 543 2109',
    },
  },
  {
    id: 6,
    name: 'Abena Asante',
    gender: 'Female',
    class: 'Form 2',
    yearOfEnrollment: 2024,
    dateOfBirth: '2008-07-12',
    email: 'abena.asante@edumanage.edu',
    phone: '+233 59 678 9012',
    subjects: ['Biology', 'Chemistry', 'Physics', 'Mathematics'],
    gpa: 3.95,
    attendance: 99,
    dailyAttendance: {
      status: 'Present',
      timestamp: '07:58 GMT',
    },
    feesStatus: 'Paid',
    guardian: {
      name: 'Mr. Osei Asante',
      relation: 'Father',
      phone: '+233 27 432 1098',
    },
  },
  {
    id: 7,
    name: 'Kojo Boateng',
    gender: 'Male',
    class: 'Form 3',
    yearOfEnrollment: 2023,
    dateOfBirth: '2007-06-25',
    email: 'kojo.boateng@edumanage.edu',
    phone: '+233 20 789 0123',
    subjects: ['Accounting', 'Costing', 'Business Management', 'Economics'],
    gpa: 3.5,
    attendance: 92,
    dailyAttendance: {
      status: 'Present',
      timestamp: '08:20 GMT',
    },
    feesStatus: 'Paid',
    guardian: {
      name: 'Mrs. Sarah Boateng',
      relation: 'Mother',
      phone: '+233 50 321 0987',
    },
  },
  {
    id: 8,
    name: 'Akosua Owusu',
    gender: 'Female',
    class: 'Form 1',
    yearOfEnrollment: 2025,
    dateOfBirth: '2010-08-19',
    email: 'akosua.owusu@edumanage.edu',
    phone: '+233 24 890 1234',
    subjects: ['Visual Arts', 'General Knowledge in Art', 'English', 'ICT'],
    gpa: 3.7,
    attendance: 95,
    dailyAttendance: {
      status: 'Present',
      timestamp: '08:14 GMT',
    },
    feesStatus: 'Pending',
    guardian: {
      name: 'Mr. Yaw Owusu',
      relation: 'Father',
      phone: '+233 26 210 9876',
    },
  },
  {
    id: 9,
    name: 'Michael Mensah',
    gender: 'Male',
    class: 'Form 2',
    yearOfEnrollment: 2024,
    dateOfBirth: '2008-12-03',
    email: 'michael.mensah@edumanage.edu',
    phone: '+233 55 901 2345',
    subjects: [
      'Technical Drawing',
      'Applied Electricity',
      'Mathematics',
      'Physics',
    ],
    gpa: 3.3,
    attendance: 89,
    dailyAttendance: {
      status: 'Late',
      timestamp: '08:40 GMT',
    },
    feesStatus: 'Paid',
    guardian: {
      name: 'Mr. Joseph Mensah',
      relation: 'Father',
      phone: '+233 24 109 8765',
    },
  },
  {
    id: 10,
    name: 'Adwoa Frimpong',
    gender: 'Female',
    class: 'Form 3',
    yearOfEnrollment: 2022,
    dateOfBirth: '2006-10-14',
    email: 'adwoa.frimpong@edumanage.edu',
    phone: '+233 28 012 3456',
    subjects: [
      'Home Economics',
      'Food & Nutrition',
      'Biology',
      'Management in Living',
    ],
    gpa: 3.88,
    attendance: 97,
    dailyAttendance: {
      status: 'Present',
      timestamp: '08:00 GMT',
    },
    feesStatus: 'Paid',
    guardian: {
      name: 'Mrs. Rita Frimpong',
      relation: 'Mother',
      phone: '+233 54 098 7654',
    },
  },
  {
    id: 11,
    name: 'Yaw Asare',
    gender: 'Male',
    class: 'Form 1',
    yearOfEnrollment: 2025,
    dateOfBirth: '2009-11-28',
    email: 'yaw.asare@edumanage.edu',
    phone: '+233 23 123 4567',
    subjects: ['Mathematics', 'English', 'Social Studies', 'ICT'],
    gpa: 3.15,
    attendance: 86,
    dailyAttendance: {
      status: 'Absent',
      timestamp: null,
    },
    feesStatus: 'Overdue',
    guardian: {
      name: 'Mr. Samuel Asare',
      relation: 'Father',
      phone: '+233 20 987 6540',
    },
  },
  {
    id: 12,
    name: 'Esi Appiah',
    gender: 'Female',
    class: 'Form 2',
    yearOfEnrollment: 2024,
    dateOfBirth: '2008-05-09',
    email: 'esi.appiah@edumanage.edu',
    phone: '+233 50 234 5671',
    subjects: ['Geography', 'Economics', 'Government', 'Mathematics'],
    gpa: 3.82,
    attendance: 96,
    dailyAttendance: {
      status: 'Present',
      timestamp: '08:10 GMT',
    },
    feesStatus: 'Paid',
    guardian: {
      name: 'Mrs. Joyce Appiah',
      relation: 'Mother',
      phone: '+233 24 876 5430',
    },
  },
  {
    id: 13,
    name: 'Kofi Addo',
    gender: 'Male',
    class: 'Form 3',
    yearOfEnrollment: 2023,
    dateOfBirth: '2007-02-17',
    email: 'kofi.addo@edumanage.edu',
    phone: '+233 27 345 6780',
    subjects: ['Elective Maths', 'Physics', 'Chemistry', 'Biology'],
    gpa: 3.9,
    attendance: 94,
    dailyAttendance: {
      status: 'Present',
      timestamp: '08:07 GMT',
    },
    feesStatus: 'Paid',
    guardian: {
      name: 'Mr. Seth Addo',
      relation: 'Father',
      phone: '+233 55 765 4320',
    },
  },
  {
    id: 14,
    name: 'Afia Boateng',
    gender: 'Female',
    class: 'Form 1',
    yearOfEnrollment: 2025,
    dateOfBirth: '2010-04-02',
    email: 'afia.boateng@edumanage.edu',
    phone: '+233 26 456 7891',
    subjects: ['Integrated Science', 'Mathematics', 'English', 'French'],
    gpa: 3.65,
    attendance: 93,
    dailyAttendance: {
      status: 'Present',
      timestamp: '08:09 GMT',
    },
    feesStatus: 'Pending',
    guardian: {
      name: 'Mrs. Patience Boateng',
      relation: 'Mother',
      phone: '+233 20 654 3219',
    },
  },
  {
    id: 15,
    name: 'Samuel Osei',
    gender: 'Male',
    class: 'Form 2',
    yearOfEnrollment: 2024,
    dateOfBirth: '2008-08-21',
    email: 'samuel.osei@edumanage.edu',
    phone: '+233 54 567 8902',
    subjects: ['Accounting', 'Business Management', 'Economics', 'ICT'],
    gpa: 3.75,
    attendance: 95,
    dailyAttendance: {
      status: 'Present',
      timestamp: '08:02 GMT',
    },
    feesStatus: 'Paid',
    guardian: {
      name: 'Mr. Peter Osei',
      relation: 'Father',
      phone: '+233 24 543 2108',
    },
  },
  {
    id: 16,
    name: 'Kwame Osei',
    gender: 'Male',
    class: 'Form 3',
    yearOfEnrollment: 2023,
    dateOfBirth: '2007-11-10',
    email: 'kwame.osei@edumanage.edu',
    phone: '+233 54 567 8903',
    subjects: ['Visual Arts', 'History', 'English', 'Social Studies'],
    gpa: 3.72,
    attendance: 95,
    dailyAttendance: {
      status: 'Present',
      timestamp: '08:15 GMT',
    },
    feesStatus: 'Paid',
    guardian: {
      name: 'Mr. Peter Osei',
      relation: 'Father',
      phone: '+233 24 543 2108',
    },
  },
];

const ALLOWED_ATTENDANCE_STATUSES = new Set(['Present', 'Late', 'Absent', 'Unmarked']);

function validateStudentId(id) {
  if (typeof id !== 'number' || !Number.isInteger(id)) {
    throw new TypeError(`Student id must be an integer, received ${typeof id === 'number' ? id : typeof id}.`);
  }
  if (id < 1) {
    throw new RangeError(`Student id must be a positive integer (>= 1), received ${id}.`);
  }
}

function validateStudentRecord(student, label = 'Student') {
  if (!student || typeof student !== 'object' || Array.isArray(student)) {
    throw new TypeError(`${label} must be a non-null object.`);
  }
  if (typeof student.id !== 'number' || !Number.isInteger(student.id)) {
    throw new TypeError(`${label} must have an integer "id", received ${typeof student.id}.`);
  }
  if (student.id < 1) {
    throw new RangeError(`${label} must have a positive integer "id", received ${student.id}.`);
  }
  if (typeof student.name !== 'string') {
    throw new TypeError(`${label} must have a string "name", received ${typeof student.name}.`);
  }
  if (student.name.trim().length === 0) {
    throw new RangeError(`${label} must have a non-empty string "name".`);
  }
}

/**
 * Returns a defensive deep clone of all student records so external callers
 * cannot accidentally mutate nested objects (guardian, dailyAttendance, subjects).
 * @returns {Array<Object>}
 */
export function getStudents() {
  return structuredClone(students);
}

/**
 * Returns a defensive deep clone of a single student by ID, or null if not found.
 * @param {number} id
 * @returns {Object|null}
 */
export function getStudentById(id) {
  validateStudentId(id);
  const found = students.find((s) => s.id === id);
  return found ? structuredClone(found) : null;
}

/**
 * Replaces the in-memory student records with a validated, deep-cloned array.
 * @param {Array<Object>} newStudents
 */
export function setStudents(newStudents) {
  if (!Array.isArray(newStudents)) {
    throw new TypeError(`Expected an array of students for setStudents, received ${typeof newStudents}.`);
  }
  newStudents.forEach((student, idx) => {
    validateStudentRecord(student, `Student at index ${idx}`);
  });
  const cloned = structuredClone(newStudents);
  students.length = 0;
  students.push(...cloned);
}

/**
 * Appends a single validated, deep-cloned student record to the store.
 * @param {Object} newStudent
 * @returns {Object} Deep clone of the added student
 */
export function addStudent(newStudent) {
  validateStudentRecord(newStudent, 'newStudent');
  const cloned = structuredClone(newStudent);
  students.push(cloned);
  return structuredClone(cloned);
}

/**
 * Updates an existing student record in the store with validated fields.
 * @param {number} id
 * @param {Object} updatedFields
 * @returns {Object|null} Deep clone of the updated student, or null if not found
 */
export function updateStudentInStore(id, updatedFields) {
  validateStudentId(id);
  if (!updatedFields || typeof updatedFields !== 'object' || Array.isArray(updatedFields)) {
    throw new TypeError(`updatedFields must be a non-null object, received ${typeof updatedFields}.`);
  }
  const idx = students.findIndex((s) => s.id === id);
  if (idx === -1) return null;

  const merged = {
    ...students[idx],
    ...structuredClone(updatedFields),
    id,
  };
  validateStudentRecord(merged, `Updated student #${id}`);
  students[idx] = merged;
  return structuredClone(merged);
}

/**
 * Updates a student's daily attendance status and timestamp in the store.
 * @param {number} id
 * @param {string} status - 'Present' | 'Late' | 'Absent' | 'Unmarked'
 * @param {string|null} [timestamp=null]
 * @returns {Object|null} Deep clone of the updated student, or null if not found
 */
export function updateStudentDailyAttendance(id, status, timestamp = null) {
  validateStudentId(id);
  if (typeof status !== 'string') {
    throw new TypeError(`Attendance status must be a string, received ${typeof status}.`);
  }
  if (!ALLOWED_ATTENDANCE_STATUSES.has(status)) {
    throw new RangeError(
      `Invalid attendance status "${status}". Allowed: ${Array.from(ALLOWED_ATTENDANCE_STATUSES).join(', ')}.`
    );
  }
  if (timestamp !== null && typeof timestamp !== 'string') {
    throw new TypeError(`Attendance timestamp must be a string or null, received ${typeof timestamp}.`);
  }

  const student = students.find((s) => s.id === id);
  if (!student) return null;

  student.dailyAttendance = {
    status,
    timestamp,
  };
  return structuredClone(student);
}

/**
 * Removes a student record by ID after validating the input.
 * @param {number} id
 * @returns {boolean} True if a student was removed, false otherwise
 */
export function removeStudentById(id) {
  validateStudentId(id);
  const idx = students.findIndex((s) => s.id === id);
  if (idx !== -1) {
    students.splice(idx, 1);
    return true;
  }
  return false;
}

export const StudentStore = Object.freeze({
  getAll: getStudents,
  getById: getStudentById,
  setAll: setStudents,
  add: addStudent,
  update: updateStudentInStore,
  updateAttendance: updateStudentDailyAttendance,
  removeById: removeStudentById,
});
