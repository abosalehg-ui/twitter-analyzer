// @ts-check

// Kept dependency-free so data modules can import it without creating a cycle
// through tokenize.js (which itself imports the stop-word list).

const ARABIC_DIACRITICS = /[ً-ْٰـ]/g;
const ALEF_VARIANTS = /[آأإ]/g;
const TAA_MARBUTA = /ة/g;
const ALEF_MAKSURA = /ى/g;

/**
 * Normalize Arabic text: strip diacritics, unify alef forms, taa marbuta, alef maksura.
 * @param {string} text
 * @returns {string}
 */
export function normalizeArabic(text) {
  return text
    .replace(ARABIC_DIACRITICS, '')
    .replace(ALEF_VARIANTS, 'ا')
    .replace(TAA_MARBUTA, 'ه')
    .replace(ALEF_MAKSURA, 'ي');
}

/**
 * The canonical form every dictionary lookup compares against: Arabic-normalized
 * and lowercased. Dictionaries must go through this too, otherwise an entry like
 * 'سعيدة' can never equal the token 'سعيده' that tokenize() produces.
 * @param {string} text
 * @returns {string}
 */
export function normForMatch(text) {
  return normalizeArabic(text).toLowerCase();
}

/**
 * Normalize a word list into a deduplicated Set of match keys.
 * @param {Iterable<string>} words
 * @returns {Set<string>}
 */
export function normSet(words) {
  return new Set([...words].map(normForMatch));
}

/**
 * Normalize a word list into a deduplicated array of match keys.
 * @param {Iterable<string>} words
 * @returns {string[]}
 */
export function normList(words) {
  return [...normSet(words)];
}
