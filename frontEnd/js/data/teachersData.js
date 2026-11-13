// teachersData.js - Dynamic in-memory teacher dataset (Encapsulated)
// The backend database is the single source of truth.
// Data is populated dynamically from Spring Boot REST API (GET /api/teachers).
const teachers = [];

function validateTeacherId(id) {
  if (typeof id !== 'number' || !Number.isInteger(id)) {
    throw new TypeError(`Teacher id must be an integer, received ${typeof id === 'number' ? id : typeof id}.`);
  }
  if (id < 1) {
    throw new RangeError(`Teacher id must be a positive integer (>= 1), received ${id}.`);
  }
}

function validateTeacherRecord(teacher, label = 'Teacher') {
  if (!teacher || typeof teacher !== 'object' || Array.isArray(teacher)) {
    throw new TypeError(`${label} must be a non-null object.`);
  }
  if (typeof teacher.id !== 'number' || !Number.isInteger(teacher.id)) {
    throw new TypeError(`${label} must have an integer "id", received ${typeof teacher.id}.`);
  }
  if (teacher.id < 1) {
    throw new RangeError(`${label} must have a positive integer "id", received ${teacher.id}.`);
  }
}

/**
 * Returns a defensive deep clone of all teacher records so callers cannot
 * mutate internal arrays (such as subjects or classes allocations).
 * @returns {Array<Object>}
 */
export function getTeachers() {
  return structuredClone(teachers);
}

/**
 * Returns a defensive deep clone of a single teacher by ID, or null if not found.
 * @param {number} id
 * @returns {Object|null}
 */
export function getTeacherById(id) {
  validateTeacherId(id);
  const found = teachers.find((t) => t.id === id);
  return found ? structuredClone(found) : null;
}

/**
 * Replaces the in-memory teacher records with a validated, deep-cloned array.
 * @param {Array<Object>} newTeachers
 */
export function setTeachers(newTeachers) {
  if (!Array.isArray(newTeachers)) {
    throw new TypeError(`Expected an array of teachers for setTeachers, received ${typeof newTeachers}.`);
  }
  newTeachers.forEach((teacher, idx) => {
    validateTeacherRecord(teacher, `Teacher at index ${idx}`);
  });
  const cloned = structuredClone(newTeachers);
  teachers.length = 0;
  teachers.push(...cloned);
}

/**
 * Appends a single validated, deep-cloned teacher record to the store.
 * @param {Object} newTeacher
 * @returns {Object} Deep clone of the added teacher
 */
export function addTeacher(newTeacher) {
  validateTeacherRecord(newTeacher, 'newTeacher');
  const cloned = structuredClone(newTeacher);
  teachers.push(cloned);
  return structuredClone(cloned);
}

/**
 * Updates an existing teacher record in the store with validated fields.
 * @param {number} id
 * @param {Object} updatedFields
 * @returns {Object|null} Deep clone of the updated teacher, or null if not found
 */
export function updateTeacherInStore(id, updatedFields) {
  validateTeacherId(id);
  if (!updatedFields || typeof updatedFields !== 'object' || Array.isArray(updatedFields)) {
    throw new TypeError(`updatedFields must be a non-null object, received ${typeof updatedFields}.`);
  }
  const idx = teachers.findIndex((t) => t.id === id);
  if (idx === -1) return null;

  const merged = {
    ...teachers[idx],
    ...structuredClone(updatedFields),
    id,
  };
  validateTeacherRecord(merged, `Updated teacher #${id}`);
  teachers[idx] = merged;
  return structuredClone(merged);
}

/**
 * Removes a teacher record by ID after validating the input.
 * @param {number} id
 * @returns {boolean} True if removed, false otherwise
 */
export function removeTeacherById(id) {
  validateTeacherId(id);
  const idx = teachers.findIndex((t) => t.id === id);
  if (idx !== -1) {
    teachers.splice(idx, 1);
    return true;
  }
  return false;
}

export const TeacherStore = Object.freeze({
  getAll: getTeachers,
  getById: getTeacherById,
  setAll: setTeachers,
  add: addTeacher,
  update: updateTeacherInStore,
  removeById: removeTeacherById,
});
