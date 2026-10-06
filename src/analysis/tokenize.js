// @ts-check

import { STOP_WORDS } from '../data/stopwords.js';
import { normalizeArabic } from './normalize.js';
import { HASHTAG_RE, MENTION_RE, LINK_RE } from './extractors.js';

export { normalizeArabic } from './normalize.js';

/**
 * Tokenize text into a list of normalized lowercase word tokens.
 * Strips URLs, hashtags, mentions, and punctuation before splitting on Unicode word boundaries.
 * @param {string} text
 * @returns {string[]}
 */
export function tokenize(text) {
  const cleaned = text.replace(LINK_RE, ' ').replace(HASHTAG_RE, ' ').replace(MENTION_RE, ' ');

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
