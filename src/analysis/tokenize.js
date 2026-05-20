// @ts-check

import { STOP_WORDS } from '../data/stopwords.js';

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
 * Tokenize text into a list of normalized lowercase word tokens.
 * Strips URLs, hashtags, mentions, and punctuation before splitting on Unicode word boundaries.
 * @param {string} text
 * @returns {string[]}
 */
export function tokenize(text) {
  const cleaned = text
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/#[ء-يa-zA-Z0-9_]+/g, ' ')
    .replace(/@[ء-يa-zA-Z0-9_]+/g, ' ');

  const normalized = normalizeArabic(cleaned).toLowerCase();
  const matches = normalized.match(/[\p{L}]+/gu);
  return matches ? matches : [];
}

/**
 * Tokenize and filter: drops stop words and tokens shorter than minLength.
 * @param {string} text
 * @param {number} [minLength=3]
 * @returns {string[]}
 */
export function meaningfulTokens(text, minLength = 3) {
  return tokenize(text).filter((t) => t.length >= minLength && !STOP_WORDS.has(t));
}
