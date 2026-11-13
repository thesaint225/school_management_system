// subjectUtils.js - Shared helper for dynamically populating subject selection UI from Database
import { fetchSubjectsFromDb } from '../../api/subjectApi.js';

let cachedActiveSubjects = null;
const subjectsStore = [];

function validateSubjectItem(sub, label = 'Subject item') {
  if (!sub || typeof sub !== 'object' || Array.isArray(sub)) {
    throw new TypeError(`${label} must be a non-null object.`);
  }
  if (typeof sub.name !== 'string') {
    throw new TypeError(`${label} must have a string "name".`);
  }
  if (sub.name.trim().length === 0) {
    throw new RangeError(`${label} must have a non-empty string "name".`);
  }
}

/**
 * Returns a defensive deep clone of all subjects in the directory store.
 * @returns {Array<Object>}
 */
export function getSubjects() {
  return structuredClone(subjectsStore);
}

/**
 * Replaces the in-memory subjects directory store with validated, deep-cloned records.
 * @param {Array<Object>} subjectsList
 */
export function setSubjects(subjectsList) {
  if (!Array.isArray(subjectsList)) {
    throw new TypeError(`Expected an array of subjects for setSubjects, received ${typeof subjectsList}.`);
  }
  subjectsList.forEach((sub, idx) => validateSubjectItem(sub, `Subject item at index ${idx}`));
  const cloned = structuredClone(subjectsList);
  subjectsStore.length = 0;
  subjectsStore.push(...cloned);
}

/**
 * Adds a validated subject record to the in-memory subjects directory store.
 * @param {Object} newSubject
 * @returns {Object} Deep clone of the added subject
 */
export function addSubjectToStore(newSubject) {
  validateSubjectItem(newSubject, 'New subject');
  const cloned = structuredClone(newSubject);
  subjectsStore.push(cloned);
  invalidateSubjectCache();
  return structuredClone(cloned);
}

/**
 * Removes a subject record by ID from the in-memory store.
 * @param {number} id
 * @returns {boolean}
 */
export function removeSubjectById(id) {
  if (typeof id !== 'number' || !Number.isInteger(id)) {
    throw new TypeError(`Subject id must be an integer, received ${typeof id === 'number' ? id : typeof id}.`);
  }
  if (id < 1) {
    throw new RangeError(`Subject id must be a positive integer (>= 1), received ${id}.`);
  }
  const idx = subjectsStore.findIndex((s) => s.id === id);
  if (idx !== -1) {
    subjectsStore.splice(idx, 1);
    invalidateSubjectCache();
    return true;
  }
  return false;
}

/**
 * Safely replace the internal subject cache with a validated, deep-cloned array.
 * @param {Array<Object>} subjectsList
 */
export function setSubjectCache(subjectsList) {
  if (!Array.isArray(subjectsList)) {
    throw new TypeError(`Expected an array of subjects for setSubjectCache, received ${typeof subjectsList}.`);
  }
  subjectsList.forEach((sub, idx) => validateSubjectItem(sub, `Subject item at index ${idx}`));
  cachedActiveSubjects = structuredClone(subjectsList);
}

/**
 * Get active subjects from backend API (with caching for performance).
 * Returns a defensive deep clone so callers cannot mutate the internal cache.
 * @param {boolean} [forceRefresh=false] - If true, bypasses cache
 * @returns {Promise<Array<Object>>} Independent copy of active subject objects
 */
export async function getActiveSubjects(forceRefresh = false) {
  if (typeof forceRefresh !== 'boolean') {
    throw new TypeError(`forceRefresh must be a boolean, received ${typeof forceRefresh}.`);
  }

  if (!forceRefresh && cachedActiveSubjects && cachedActiveSubjects.length > 0) {
    return structuredClone(cachedActiveSubjects);
  }

  const subjects = await fetchSubjectsFromDb(true);
  if (Array.isArray(subjects) && subjects.length > 0) {
    cachedActiveSubjects = structuredClone(subjects);
    return structuredClone(cachedActiveSubjects);
  }

  // Fallback if backend temporarily unreachable
  return cachedActiveSubjects ? structuredClone(cachedActiveSubjects) : [];
}

/**
 * Clear cached subjects when a subject is added/updated/deactivated.
 */
export function invalidateSubjectCache() {
  cachedActiveSubjects = null;
}

/**
 * Dynamically populate a container with subject checkboxes from the backend database.
 * @param {HTMLElement} containerEl - Container element
 * @param {Array<string>} [selectedNames=[]] - Pre-selected subject names
 * @param {string} [inputName='subjects'] - Form checkbox name
 * @param {Function} [onChange] - Optional change event listener
 */
export async function populateSubjectCheckboxes(containerEl, selectedNames = [], inputName = 'subjects', onChange = null) {
  if (!containerEl) return;

  const subjects = await getActiveSubjects();
  const safeNames = Array.isArray(selectedNames)
    ? selectedNames
    : (selectedNames && typeof selectedNames[Symbol.iterator] === 'function' ? Array.from(selectedNames) : []);
  const selectedSet = new Set(safeNames);

  containerEl.replaceChildren();

  if (!subjects || subjects.length === 0) {
    const emptySpan = document.createElement('span');
    emptySpan.className = 'cal-empty-desc';
    emptySpan.textContent = 'No active subjects available. Please add subjects first.';
    containerEl.appendChild(emptySpan);
    return;
  }

  subjects.forEach((sub) => {
    const label = document.createElement('label');
    label.className = 'checkbox-item';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = inputName;
    input.value = sub.name;
    if (selectedSet.has(sub.name)) {
      input.checked = true;
    }

    const textSpan = document.createElement('span');
    textSpan.append(sub.name);
    if (sub.code) {
      textSpan.append(' ');
      const codeSpan = document.createElement('span');
      codeSpan.className = 'subject-code-tag-sm';
      codeSpan.textContent = `(${sub.code})`;
      textSpan.appendChild(codeSpan);
    }

    if (typeof onChange === 'function') {
      input.addEventListener('change', onChange);
      input.addEventListener('blur', onChange);
    }

    label.append(input, textSpan);
    containerEl.appendChild(label);
  });
}
