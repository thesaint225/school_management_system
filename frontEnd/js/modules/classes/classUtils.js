// classUtils.js - Shared helper for dynamically populating class selection UI from Database
import { fetchClassesFromDb } from '../../api/classApi.js';

let cachedActiveClasses = null;

/**
 * Safely replace the internal class cache with a validated, deep-cloned array.
 * @param {Array<Object>} classesList
 */
export function setClassCache(classesList) {
  if (!Array.isArray(classesList)) {
    throw new TypeError(`Expected an array of classes for setClassCache, received ${typeof classesList}.`);
  }
  classesList.forEach((cls, idx) => {
    if (!cls || typeof cls !== 'object' || Array.isArray(cls)) {
      throw new TypeError(`Class item at index ${idx} must be a non-null object.`);
    }
    if (typeof cls.name !== 'string' || cls.name.trim().length === 0) {
      throw new TypeError(`Class item at index ${idx} must have a non-empty string "name".`);
    }
  });
  cachedActiveClasses = structuredClone(classesList);
}

/**
 * Get active classes from backend API (with caching for performance).
 * Returns a defensive deep clone so callers cannot mutate the internal cache.
 * @param {boolean} [forceRefresh=false] - If true, bypasses cache
 * @returns {Promise<Array<Object>>} Independent copy of active class objects
 */
export async function getActiveClasses(forceRefresh = false) {
  if (typeof forceRefresh !== 'boolean') {
    throw new TypeError(`forceRefresh must be a boolean, received ${typeof forceRefresh}.`);
  }

  if (!forceRefresh && cachedActiveClasses && cachedActiveClasses.length > 0) {
    return structuredClone(cachedActiveClasses);
  }

  const classes = await fetchClassesFromDb(true);
  if (Array.isArray(classes) && classes.length > 0) {
    cachedActiveClasses = structuredClone(classes);
    return structuredClone(cachedActiveClasses);
  }

  return cachedActiveClasses ? structuredClone(cachedActiveClasses) : [];
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

  const currentVal = selectedValue || selectEl.value || '';
  const classes = await getActiveClasses();

  selectEl.replaceChildren();

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
  if (!currentVal) {
    defaultOption.selected = true;
  }
  selectEl.appendChild(defaultOption);

  let hasSelected = false;
  classes.forEach((cls) => {
    const option = document.createElement('option');
    option.value = cls.name;
    option.textContent = `${cls.name} (${cls.studentCount || 0} students)`;
    if (currentVal && cls.name.toLowerCase() === currentVal.toLowerCase()) {
      option.selected = true;
      hasSelected = true;
    }
    selectEl.appendChild(option);
  });

  if (currentVal && !hasSelected) {
    defaultOption.selected = true;
  }
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

  containerEl.replaceChildren();

  if (!classes || classes.length === 0) {
    const emptySpan = document.createElement('span');
    emptySpan.className = 'cal-empty-desc';
    emptySpan.textContent = 'No active classes available. Please add classes first.';
    containerEl.appendChild(emptySpan);
    return;
  }

  classes.forEach((cls) => {
    const label = document.createElement('label');
    label.className = 'checkbox-item';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = inputName;
    input.value = cls.name;
    if (selectedSet.has(cls.name)) {
      input.checked = true;
    }

    const span = document.createElement('span');
    span.textContent = `🏛️ ${cls.name}`;

    if (typeof onChange === 'function') {
      input.addEventListener('change', onChange);
      input.addEventListener('blur', onChange);
    }

    label.append(input, span);
    containerEl.appendChild(label);
  });
}

