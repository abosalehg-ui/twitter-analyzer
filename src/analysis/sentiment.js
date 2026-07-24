// @ts-check

import { tokenize } from './tokenize.js';
import { extractEmojis } from './extractors.js';
import {
  POSITIVE_WORDS,
  NEGATIVE_WORDS,
  INTENSIFIERS,
  EMOJI_SENTIMENT,
} from '../data/sentiment-dict.js';

/**
 * Score a single tweet. Tokens are normalized (lowercase, diacritics stripped) by tokenize().
 * Word matches count 1 point; emoji matches count 2 points; an intensifier preceding a
 * sentiment token multiplies that token's score by 2.
 *
 * @param {string} tweet
 * @returns {number} positive minus negative score (negative number = negative sentiment)
 */
export function scoreTweet(tweet) {
  const tokens = tokenize(tweet);
  let score = 0;

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    const prev = i > 0 ? tokens[i - 1] : null;
    const multiplier = prev && INTENSIFIERS.has(prev) ? 2 : 1;

    if (POSITIVE_WORDS.has(tok)) score += 1 * multiplier;
    else if (NEGATIVE_WORDS.has(tok)) score -= 1 * multiplier;
  }

  for (const emoji of extractEmojis(tweet)) {
    if (EMOJI_SENTIMENT.positive.has(emoji)) score += 2;
    else if (EMOJI_SENTIMENT.negative.has(emoji)) score -= 2;
  }

  return score;
}

/**
 * Classify score into one of three categories.
 * @param {number} score
 * @returns {'positive' | 'neutral' | 'negative'}
 */
export function classify(score) {
  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}
