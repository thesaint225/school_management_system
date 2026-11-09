// teachersData.js - Dynamic in-memory teacher dataset
// The backend database is the single source of truth.
// Data is populated dynamically from Spring Boot REST API (GET /api/teachers).
export const teachers = [];

/**
 * Returns a defensive deep clone of all teacher records so callers cannot
 * mutate internal arrays (such as subjects or classes allocations).
 * @returns {Array<Object>}
 */
export function getTeachers() {
  return structuredClone(teachers);
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
    if (!teacher || typeof teacher !== 'object' || Array.isArray(teacher)) {
      throw new TypeError(`Teacher at index ${idx} must be a non-null object.`);
    }
    if (typeof teacher.id !== 'number' || !Number.isInteger(teacher.id) || teacher.id < 1) {
      throw new RangeError(`Teacher at index ${idx} must have a positive integer "id".`);
    }
  });
  const cloned = structuredClone(newTeachers);
  teachers.length = 0;
  teachers.push(...cloned);
}

/**
 * Removes a teacher record by ID after validating the input.
 * @param {number} id
 * @returns {boolean} True if removed, false otherwise
 */
export function removeTeacherById(id) {
  if (typeof id !== 'number' || !Number.isInteger(id) || id < 1) {
    throw new TypeError(`Teacher id must be a positive integer, received ${typeof id === 'number' ? id : typeof id}.`);
  }
  const idx = teachers.findIndex((t) => t.id === id);
  if (idx !== -1) {
    teachers.splice(idx, 1);
    return true;
  }
  return false;
}
