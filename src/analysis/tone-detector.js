// @ts-check

import { normalizeArabic } from './tokenize.js';
import { TONE_PATTERNS, TONE_KEYS } from '../data/tone-patterns.js';

/**
 * @typedef {Object} ToneResult
 * @property {keyof typeof TONE_PATTERNS | 'neutral'} primary
 * @property {Array<{ tone: string, hits: number }>} scores
 */

/**
 * Detect the dominant tone of a tweet. Returns the tone with the most matches,
 * or 'neutral' if no matches.
 *
 * @param {string} text
 * @returns {ToneResult}
 */
export function detectTone(text) {
  const norm = normalizeArabic(text).toLowerCase();

  /** @type {Array<{ tone: string, hits: number }>} */
  const scores = [];
  for (const tone of TONE_KEYS) {
    const patterns = TONE_PATTERNS[tone];
    let hits = 0;
    for (const word of [...patterns.ar, ...patterns.en]) {
      if (norm.includes(normalizeArabic(word).toLowerCase())) hits++;
    }
    scores.push({ tone, hits });
  }

  // Sort descending
  scores.sort((a, b) => b.hits - a.hits);
  const top = scores[0];
  /** @type {keyof typeof TONE_PATTERNS | 'neutral'} */
  const primary = top.hits === 0 ? 'neutral' : /** @type {any} */ (top.tone);

  return { primary, scores };
}
