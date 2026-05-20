// @ts-check

const STORAGE_KEY = 'twitter-analyzer:last-input';

/**
 * Persist the last textarea input. Silently no-ops if storage is unavailable
 * (private mode, quota exceeded, etc.).
 * @param {string} text
 */
export function saveInput(text) {
  try {
    if (text && text.trim().length > 0) {
      localStorage.setItem(STORAGE_KEY, text);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

/**
 * Load the last saved input, or empty string if none / unavailable.
 * @returns {string}
 */
export function loadInput() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

/**
 * Remove the stored input.
 */
export function clearInput() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
