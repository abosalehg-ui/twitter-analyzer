// @ts-check

import { normForMatch, normList } from './normalize.js';
import { TONE_PATTERNS, TONE_KEYS } from '../data/tone-patterns.js';

/**
 * @typedef {Object} ToneResult
 * @property {keyof typeof TONE_PATTERNS | 'neutral'} primary
 * @property {Array<{ tone: string, hits: number }>} scores
 */

// Normalized (and deduplicated, so 'رائعة'/'رائعه' count once) at load time
// instead of on every analysis.
const TONE_KEYS_NORM = TONE_KEYS.map((tone) => ({
  tone,
  patterns: normList([...TONE_PATTERNS[tone].ar, ...TONE_PATTERNS[tone].en]),
}));

/**
 * Detect the dominant tone of a tweet. Returns the tone with the most matches,
 * or 'neutral' if no matches.
 *
 * @param {string} text
 * @returns {ToneResult}
 */
export function detectTone(text) {
  const norm = normForMatch(text);

  /** @type {Array<{ tone: string, hits: number }>} */
  const scores = [];
  for (const { tone, patterns } of TONE_KEYS_NORM) {
    let hits = 0;
    for (const key of patterns) {
      if (norm.includes(key)) hits++;
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
