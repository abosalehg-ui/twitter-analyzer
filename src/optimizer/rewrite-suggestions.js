// @ts-check

import { scoreAlgorithm } from '../analysis/algorithm-score.js';

/**
 * @typedef {Object} RewriteSuggestion
 * @property {'shorter'|'question'|'positive'} variant
 * @property {string} text                  proposed text
 * @property {string} explainKey            i18n key explaining the change
 * @property {number} predictedScore        0..100
 * @property {number} delta                 predictedScore - originalScore
 */

const QUESTION_SUFFIX_AR = ' — ما رأيكم؟';
const QUESTION_SUFFIX_EN = ' — what do you think?';
const POSITIVE_PREFIX_AR = '✨ ';
const POSITIVE_PREFIX_EN = '✨ ';

/**
 * Crude language detection: presence of Arabic letters.
 * @param {string} text
 */
function isArabic(text) {
  return /[؀-ۿ]/.test(text);
}

/**
 * Shorter variant: trim to ~120 chars at word boundary.
 * @param {string} text
 */
function makeShorter(text) {
  if (text.length <= 120) {
    // Already short — try to remove filler instead
    return text
      .replace(/\b(very|really|so|just|actually|basically|literally)\s/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  const cut = text.slice(0, 120);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim() + '…';
}

/**
 * Question variant: append a question if not already a question.
 * @param {string} text
 */
function makeQuestion(text) {
  if (/[?؟]\s*$/.test(text.trim())) return text;
  const suffix = isArabic(text) ? QUESTION_SUFFIX_AR : QUESTION_SUFFIX_EN;
  // Avoid pushing past 280 chars
  if (text.length + suffix.length > 280) {
    return makeShorter(text) + suffix;
  }
  return text.trim() + suffix;
}

/**
 * Positive variant: replace common negative words with neutral / positive alternatives
 * and prefix with a positive marker if mostly neutral.
 * @param {string} text
 */
function makePositive(text) {
  const replacements = [
    [/\b(hate)\b/gi, 'dislike'],
    [/\b(awful)\b/gi, 'tough'],
    [/\b(terrible)\b/gi, 'challenging'],
    [/\b(horrible)\b/gi, 'difficult'],
    [/\b(stupid)\b/gi, 'puzzling'],
    [/\b(worst)\b/gi, 'least favorable'],
    [/\bسيء\b/g, 'صعب'],
    [/\bسيئة\b/g, 'صعبة'],
    [/\bسيئه\b/g, 'صعبه'],
    [/\bأكره\b/g, 'لا أحبذ'],
    [/\bاكره\b/g, 'لا احبذ'],
    [/\bفظيع\b/g, 'صعب'],
  ];
  let out = text;
  for (const [re, rep] of replacements) {
    out = out.replace(/** @type {RegExp} */ (re), /** @type {string} */ (rep));
  }
  // Add a positive prefix marker if no emojis present
  if (!/\p{Extended_Pictographic}/u.test(out)) {
    out = (isArabic(out) ? POSITIVE_PREFIX_AR : POSITIVE_PREFIX_EN) + out;
  }
  return out.trim();
}

/**
 * Generate 3 rewrite suggestions and score each against the algorithm.
 * Suggestions that score WORSE than the original are still returned (UI can hide them).
 *
 * @param {string} text
 * @param {number} originalScore
 * @returns {RewriteSuggestion[]}
 */
export function suggestRewrites(text, originalScore) {
  /** @type {Array<{ variant: 'shorter'|'question'|'positive', text: string, explainKey: string }>} */
  const candidates = [
    { variant: 'shorter', text: makeShorter(text), explainKey: 'optimizer.shorter' },
    { variant: 'question', text: makeQuestion(text), explainKey: 'optimizer.question' },
    { variant: 'positive', text: makePositive(text), explainKey: 'optimizer.positive' },
  ];

  /** @type {RewriteSuggestion[]} */
  const out = [];
  for (const c of candidates) {
    if (c.text === text || c.text.trim().length === 0) continue;
    const scored = scoreAlgorithm(c.text);
    out.push({
      variant: c.variant,
      text: c.text,
      explainKey: c.explainKey,
      predictedScore: scored.score,
      delta: scored.score - originalScore,
    });
  }
  // Sort by predicted score descending
  out.sort((a, b) => b.predictedScore - a.predictedScore);
  return out;
}
