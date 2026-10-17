// subjectUtils.js - Shared helper for dynamically populating subject selection UI from Database
import { fetchSubjectsFromDb } from '../../api/subjectApi.js';

let cachedActiveSubjects = null;

/**
 * Get active subjects from backend API (with caching for performance).
 * @param {boolean} forceRefresh - If true, bypasses cache
 * @returns {Promise<Array>} Array of active subject objects
 */
export async function getActiveSubjects(forceRefresh = false) {
  if (!forceRefresh && cachedActiveSubjects && cachedActiveSubjects.length > 0) {
    return cachedActiveSubjects;
  }

  const subjects = await fetchSubjectsFromDb(true);
  if (subjects && subjects.length > 0) {
    cachedActiveSubjects = subjects;
    return subjects;
  }

  // Fallback if backend temporarily unreachable
  return cachedActiveSubjects || [];
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
  const selectedSet = new Set(selectedNames || []);

  if (!subjects || subjects.length === 0) {
    containerEl.innerHTML = '<span class="cal-empty-desc">No active subjects available. Please add subjects first.</span>';
    return;
  }

  containerEl.innerHTML = subjects.map((sub) => {
    const isChecked = selectedSet.has(sub.name) ? 'checked' : '';
    const codeTag = sub.code ? ` <span class="subject-code-tag-sm">(${sub.code})</span>` : '';
    return `
      <label class="checkbox-item">
        <input type="checkbox" name="${inputName}" value="${sub.name}" ${isChecked}>
        <span>${sub.name}${codeTag}</span>
      </label>
    `;
  }).join('');

  if (onChange) {
    const checkboxes = containerEl.querySelectorAll(`input[name="${inputName}"]`);
    checkboxes.forEach((cb) => {
      cb.addEventListener('change', onChange);
      cb.addEventListener('blur', onChange);
    });
  }
}
