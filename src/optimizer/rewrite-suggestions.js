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

// Filler words that can be dropped without changing what the tweet says.
const FILLERS_EN = ['very', 'really', 'so', 'just', 'actually', 'basically', 'literally'];
const FILLERS_AR = ['جدا', 'جداً', 'فعلا', 'فعلاً', 'حقا', 'حقاً', 'بصراحة', 'بصراحه', 'يعني'];

/**
 * Build a whole-word matcher for Arabic or mixed text.
 *
 * `\b` cannot be used here: without the `u` flag (and even with it) JS treats
 * Arabic letters as non-word characters, so `/\bسيء\b/` never matches anything.
 * Letter-class lookarounds give a real word boundary for every script.
 *
 * @param {string} word
 * @param {string} [flags='g']
 */
function wordRe(word, flags = 'g') {
  return new RegExp(`(?<![\\p{L}\\p{M}])${word}(?![\\p{L}\\p{M}])`, flags + 'u');
}

const FILLER_RES = [...FILLERS_EN, ...FILLERS_AR].map((w) => wordRe(w, 'gi'));

/**
 * Shorter variant: drop filler words. The text is never truncated — cutting a
 * tweet off at N characters deletes its ending, which is not a suggestion anyone
 * can post. When there is no filler to remove, the result equals the input and
 * suggestRewrites() skips it.
 * @param {string} text
 */
function makeShorter(text) {
  let out = text;
  for (const re of FILLER_RES) out = out.replace(re, '');
  return out
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/ +([،,.!?؟])/g, '$1')
    .trim();
}

/**
 * Question variant: append a question if not already a question.
 * @param {string} text
 */
function makeQuestion(text) {
  if (/[?؟]\s*$/.test(text.trim())) return text;
  const suffix = isArabic(text) ? QUESTION_SUFFIX_AR : QUESTION_SUFFIX_EN;
  // Never push past 280 chars: the only fix would be truncating the tweet.
  if (text.trim().length + suffix.length > 280) return text;
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
    [wordRe('سيء'), 'صعب'],
    [wordRe('سيئ'), 'صعب'],
    [wordRe('سيئة'), 'صعبة'],
    [wordRe('سيئه'), 'صعبه'],
    [wordRe('أكره'), 'لا أحبذ'],
    [wordRe('اكره'), 'لا احبذ'],
    [wordRe('فظيع'), 'صعب'],
    [wordRe('فظيعة'), 'صعبة'],
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
