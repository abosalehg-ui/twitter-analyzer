// @ts-check

import { ar } from './ar.js';
import { en } from './en.js';

const DICTS = { ar, en };

let currentLocale = 'ar';

/**
 * Set the active locale ('ar' | 'en'). Defaults to 'ar'.
 * @param {'ar' | 'en'} locale
 */
export function setLocale(locale) {
  if (DICTS[locale]) currentLocale = locale;
}

/**
 * Get the active locale.
 * @returns {string}
 */
export function getLocale() {
  return currentLocale;
}

/**
 * Translate a key in the active locale. Falls back to the key if missing.
 * @param {string} key
 * @returns {string}
 */
export function t(key) {
  const dict = DICTS[currentLocale] ?? DICTS.ar;
  return dict[key] ?? key;
}
