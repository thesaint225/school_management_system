// subjectUtils.js - Shared helper for dynamically populating subject selection UI from Database
import { fetchSubjectsFromDb } from '../../api/subjectApi.js';

let cachedActiveSubjects = null;

/**
 * Safely replace the internal subject cache with a validated, deep-cloned array.
 * @param {Array<Object>} subjectsList
 */
export function setSubjectCache(subjectsList) {
  if (!Array.isArray(subjectsList)) {
    throw new TypeError(`Expected an array of subjects for setSubjectCache, received ${typeof subjectsList}.`);
  }
  subjectsList.forEach((sub, idx) => {
    if (!sub || typeof sub !== 'object' || Array.isArray(sub)) {
      throw new TypeError(`Subject item at index ${idx} must be a non-null object.`);
    }
    if (typeof sub.name !== 'string' || sub.name.trim().length === 0) {
      throw new TypeError(`Subject item at index ${idx} must have a non-empty string "name".`);
    }
  });
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
