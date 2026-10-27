// classUtils.js - Shared helper for dynamically populating class selection UI from Database
import { fetchClassesFromDb } from '../../api/classApi.js';

let cachedActiveClasses = null;

/**
 * Get active classes from backend API (with caching for performance).
 * @param {boolean} forceRefresh - If true, bypasses cache
 * @returns {Promise<Array>} Array of active class objects
 */
export async function getActiveClasses(forceRefresh = false) {
  if (!forceRefresh && cachedActiveClasses && cachedActiveClasses.length > 0) {
    return cachedActiveClasses;
  }

  const classes = await fetchClassesFromDb(true);
  if (classes && classes.length > 0) {
    cachedActiveClasses = classes;
    return classes;
  }

  return cachedActiveClasses || [];
}

/**
 * Clear cached classes when a class is added/updated/deactivated.
 */
export function invalidateClassCache() {
  cachedActiveClasses = null;
}

/**
 * Dynamically populate a select element with class options from the backend database.
 * @param {HTMLSelectElement} selectEl - Target <select> element
 * @param {string} [selectedValue=''] - Pre-selected class name
 * @param {string} [placeholderText='Select class level'] - Default prompt option
 */
export async function populateClassSelectOptions(selectEl, selectedValue = '', placeholderText = 'Select class level') {
  if (!selectEl) {
    console.warn('[classUtils] populateClassSelectOptions: target selectEl element was not provided or not found in DOM.');
    return;
  }

  const classes = await getActiveClasses();

  selectEl.innerHTML = '';

  if (!classes || classes.length === 0) {
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = 'No active classes available';
    emptyOption.disabled = true;
    emptyOption.selected = true;
    selectEl.appendChild(emptyOption);
    return;
  }

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = placeholderText;
  defaultOption.disabled = true;
  if (!selectedValue) {
    defaultOption.selected = true;
  }
  selectEl.appendChild(defaultOption);

  classes.forEach((cls) => {
    const option = document.createElement('option');
    option.value = cls.name;
    option.textContent = `${cls.name} (${cls.studentCount || 0} students)`;
    if (selectedValue && cls.name.toLowerCase() === selectedValue.toLowerCase()) {
      option.selected = true;
    }
    selectEl.appendChild(option);
  });
}

/**
 * Dynamically populate a container with class checkboxes from the backend database.
 * @param {HTMLElement} containerEl - Container element
 * @param {Array<string>} [selectedNames=[]] - Pre-selected class names
 * @param {string} [inputName='classes'] - Form checkbox name
 * @param {Function} [onChange] - Optional change event listener
 */
export async function populateClassCheckboxes(containerEl, selectedNames = [], inputName = 'classes', onChange = null) {
  if (!containerEl) {
    console.warn('[classUtils] populateClassCheckboxes: containerEl element was not provided or not found in DOM.');
    return;
  }

  const classes = await getActiveClasses();
  const safeNames = Array.isArray(selectedNames)
    ? selectedNames
    : (selectedNames && typeof selectedNames[Symbol.iterator] === 'function' ? Array.from(selectedNames) : []);
  const selectedSet = new Set(safeNames);

  if (!classes || classes.length === 0) {
    containerEl.innerHTML = '<span class="cal-empty-desc">No active classes available. Please add classes first.</span>';
    return;
  }

  containerEl.innerHTML = classes.map((cls) => {
    const isChecked = selectedSet.has(cls.name) ? 'checked' : '';
    return `
      <label class="checkbox-item">
        <input type="checkbox" name="${inputName}" value="${cls.name}" ${isChecked}>
        <span>🏛️ ${cls.name}</span>
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

