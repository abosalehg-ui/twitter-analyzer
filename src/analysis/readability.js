// @ts-check

import { normalizeArabic } from './tokenize.js';

/**
 * @typedef {Object} ReadabilityResult
 * @property {number} score        0..100 (higher = easier to read)
 * @property {'easy'|'medium'|'hard'} level
 * @property {number} avgWordLength
 * @property {number} avgSentenceLength
 * @property {number} longWordRatio    fraction of words >= 7 chars
 */

/**
 * Compute a simplified readability score. Inspired by Läsbarhetsindex (LIX)
 * but tuned for short bilingual social-media text.
 *
 * LIX = (words / sentences) + (longWords * 100 / words)
 * lower LIX → easier; we invert + normalize to 0..100 where 100 = easiest.
 *
 * @param {string} text
 * @returns {ReadabilityResult}
 */
export function readability(text) {
  const cleaned = normalizeArabic(text)
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[#@]\S+/g, ' ');

  const words = cleaned.match(/[\p{L}]+/gu) || [];
  const sentences = cleaned.split(/[.!?؟\n]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = Math.max(1, sentences.length);
  const wordCount = words.length;

  if (wordCount === 0) {
    return { score: 50, level: 'medium', avgWordLength: 0, avgSentenceLength: 0, longWordRatio: 0 };
  }

  const totalChars = words.reduce((sum, w) => sum + w.length, 0);
  const avgWordLength = totalChars / wordCount;
  const avgSentenceLength = wordCount / sentenceCount;
  const longWords = words.filter((w) => w.length >= 7).length;
  const longWordRatio = longWords / wordCount;

  // LIX value
  const lix = avgSentenceLength + longWordRatio * 100;
  // typical LIX: <30 easy, 30-50 medium, >50 hard
  let score;
  if (lix <= 25) score = 95;
  else if (lix <= 35) score = 80;
  else if (lix <= 45) score = 65;
  else if (lix <= 55) score = 45;
  else if (lix <= 65) score = 30;
  else score = 15;

  /** @type {'easy'|'medium'|'hard'} */
  const level = score >= 70 ? 'easy' : score >= 45 ? 'medium' : 'hard';

  return {
    score,
    level,
    avgWordLength: Math.round(avgWordLength * 10) / 10,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    longWordRatio: Math.round(longWordRatio * 100) / 100,
  };
}
