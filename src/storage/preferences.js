// @ts-check

const LOCALE_KEY = 'twitter-analyzer:locale';
const THEME_KEY = 'twitter-analyzer:theme';

/**
 * @returns {'ar' | 'en'}
 */
export function loadLocale() {
  try {
    const v = localStorage.getItem(LOCALE_KEY);
    if (v === 'ar' || v === 'en') return v;
  } catch {
    // ignore
  }
  return 'ar';
}

/**
 * @param {'ar' | 'en'} locale
 */
export function saveLocale(locale) {
  try {
    localStorage.setItem(LOCALE_KEY, locale);
  } catch {
    // ignore
  }
}

/**
 * @returns {'dark' | 'light'}
 */
export function loadTheme() {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === 'dark' || v === 'light') return v;
  } catch {
    // ignore
  }
  return 'dark';
}

/**
 * @param {'dark' | 'light'} theme
 */
export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
}
