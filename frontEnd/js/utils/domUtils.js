// Shared DOM, Formatting, and HTTP Error Utilities
// Eliminates cross-domain duplication while keeping internal helpers private

function getFirstLetter(word) {
  return word ? word[0] : '';
}

/**
 * Computes uppercase initials from a person's full name (e.g. "Ama Mensah" -> "AM").
 * @param {string} name
 * @param {string} [fallback='ST']
 * @returns {string}
 */
export function getInitials(name, fallback = 'ST') {
  const words = (name || '').trim().split(/\s+/).filter(Boolean);
  const initials = words.map(getFirstLetter).join('');
  return (initials || fallback).toUpperCase();
}

/**
 * Sets or clears accessible field-level blur validation state and error text.
 * @param {HTMLElement|null} inputEl
 * @param {HTMLElement|null} errorEl
 * @param {string} message - Empty string when valid; actionable error message when invalid
 * @returns {boolean} true if valid, false if invalid
 */
export function setFieldError(inputEl, errorEl, message) {
  if (message) {
    if (inputEl) {
      inputEl.classList.add('is-invalid');
      inputEl.classList.remove('is-valid');
      inputEl.setAttribute('aria-invalid', 'true');
    }
    if (errorEl) {
      errorEl.textContent = message.startsWith('⚠️') ? message : `⚠️ ${message}`;
      errorEl.classList.add('visible');
    }
    return false;
  }

  if (inputEl) {
    inputEl.classList.remove('is-invalid');
    inputEl.classList.add('is-valid');
    inputEl.setAttribute('aria-invalid', 'false');
  }
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
  return true;
}

/**
 * Extracts a human-readable error message from a failed Fetch API Response.
 * @param {Response} response
 * @returns {Promise<string>}
 */
export async function extractApiErrorMessage(response) {
  let errorDetails = `HTTP ${response.status}`;
  try {
    const errorJson = await response.json();
    errorDetails = errorJson.message || JSON.stringify(errorJson);
  } catch {
    try {
      const text = await response.text();
      if (text) errorDetails = text;
    } catch {
      // Preserve default HTTP status string
    }
  }
  return errorDetails;
}

export const DomUtils = Object.freeze({
  getInitials,
  setFieldError,
  extractApiErrorMessage,
});

