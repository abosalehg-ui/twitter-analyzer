// @ts-check

import { predictEngagement } from './engagement-predictor.js';
import {
  ACTION_WEIGHTS,
  ACTION_KEYS,
  POSITIVE_ACTIONS,
  NEGATIVE_ACTIONS,
  MAX_RAW_SCORE,
} from '../data/algorithm-weights.js';

/**
 * @typedef {Object} ActionContribution
 * @property {string} action
 * @property {number} probability    0..1 predicted probability
 * @property {number} weight         weight (positive or negative)
 * @property {number} contribution   probability * weight
 *
 * @typedef {Object} AlgorithmScoreResult
 * @property {number} score                         0..100 normalized
 * @property {number} rawScore                      raw Σ weight × p
 * @property {'low'|'medium'|'good'|'excellent'} reach
 * @property {ActionContribution[]} contributions
 * @property {ActionContribution[]} positives
 * @property {ActionContribution[]} negatives
 * @property {string[]} recommendations             actionable improvement keys (i18n)
 * @property {import('./engagement-predictor.js').TweetFeatures} features
 */

/**
 * Build actionable recommendation keys based on feature patterns.
 * Returns i18n keys to be looked up by the renderer.
 * @param {import('./engagement-predictor.js').TweetFeatures} f
 * @returns {string[]}
 */
function buildRecommendations(f) {
  /** @type {string[]} */
  const recs = [];

  if (f.length < 30) recs.push('algo.rec.tooShort');
  if (f.length > 240) recs.push('algo.rec.tooLong');
  if (f.length >= 30 && f.length < 70) recs.push('algo.rec.expandToSweetspot');

  if (f.linkCount > 0 && !f.hasMediaUrl) recs.push('algo.rec.externalLinks');
  if (f.linkCount > 2) recs.push('algo.rec.tooManyLinks');

  if (f.hashtagCount > 2) recs.push('algo.rec.tooManyHashtags');
  if (f.hashtagCount === 0 && f.length > 80) recs.push('algo.rec.addHashtag');

  if (f.mentionCount > 3) recs.push('algo.rec.tooManyMentions');

  if (!f.hasQuestion && !f.hasCta && f.length > 50) recs.push('algo.rec.addQuestion');

  if (f.baitHits > 0) recs.push('algo.rec.removeBait');
  if (f.toxicityHits > 0) recs.push('algo.rec.removeToxicity');
  if (f.spamHits > 0) recs.push('algo.rec.removeSpam');

  if (f.emojiCount === 0 && f.length > 60) recs.push('algo.rec.addEmoji');
  if (f.emojiCount > 6) recs.push('algo.rec.tooManyEmojis');

  if (f.allCapsWords >= 3) recs.push('algo.rec.lessCaps');

  if (f.sentiment === 'negative') recs.push('algo.rec.improveSentiment');

  if (recs.length === 0) recs.push('algo.rec.allGood');
  return recs;
}

/**
 * Map raw score to a reach bucket.
 * @param {number} score
 */
function reachBucket(score) {
  if (score >= 75) return /** @type {const} */ ('excellent');
  if (score >= 55) return /** @type {const} */ ('good');
  if (score >= 35) return /** @type {const} */ ('medium');
  return /** @type {const} */ ('low');
}

/**
 * Compute the algorithm compatibility score for a tweet.
 *
 * Model: Final Score = Σ (weight_i × P(action_i))
 * where weights match xai-org/x-algorithm public docs (positive actions
 * have positive weights; negative have negative; magnitudes calibrated).
 *
 * @param {string} text
 * @returns {AlgorithmScoreResult}
 */
export function scoreAlgorithm(text) {
  const { features, probabilities } = predictEngagement(text);

  /** @type {ActionContribution[]} */
  const contributions = ACTION_KEYS.map((action) => {
    const probability = probabilities[action] ?? 0;
    const weight = ACTION_WEIGHTS[action];
    return {
      action,
      probability,
      weight,
      contribution: probability * weight,
    };
  });

  const rawScore = contributions.reduce((sum, c) => sum + c.contribution, 0);

  // Normalize: 0 raw → 0/100; MAX_RAW_SCORE → 100/100; negative → clipped to 0
  const score = Math.max(0, Math.min(100, Math.round((rawScore / MAX_RAW_SCORE) * 100)));

  const positives = contributions
    .filter((c) => POSITIVE_ACTIONS.includes(/** @type {any} */ (c.action)))
    .sort((a, b) => b.contribution - a.contribution);
  const negatives = contributions
    .filter((c) => NEGATIVE_ACTIONS.includes(/** @type {any} */ (c.action)))
    .sort((a, b) => a.contribution - b.contribution);

  return {
    score,
    rawScore,
    reach: reachBucket(score),
    contributions,
    positives,
    negatives,
    recommendations: buildRecommendations(features),
    features,
  };
}
