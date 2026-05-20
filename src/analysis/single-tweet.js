// @ts-check

import { detectAi } from './ai-detection.js';
import { scoreAlgorithm } from './algorithm-score.js';
import { readability } from './readability.js';
import { detectTone } from './tone-detector.js';
import { extractHashtags, extractMentions, extractEmojis } from './extractors.js';
import { scoreTweet, classify } from './sentiment.js';
import { meaningfulTokens } from './tokenize.js';

/**
 * @typedef {Object} SingleTweetAnalysis
 * @property {string} text
 * @property {number} length
 * @property {number} wordCount
 * @property {string[]} hashtags
 * @property {string[]} mentions
 * @property {string[]} emojis
 * @property {string[]} keywords          top meaningful tokens
 * @property {{ score: number, label: 'positive'|'neutral'|'negative' }} sentiment
 * @property {import('./ai-detection.js').AiDetectionResult} ai
 * @property {import('./algorithm-score.js').AlgorithmScoreResult} algorithm
 * @property {import('./readability.js').ReadabilityResult} readability
 * @property {import('./tone-detector.js').ToneResult} tone
 * @property {string} analyzedAt          ISO timestamp
 */

/**
 * Run the full single-tweet pipeline.
 * @param {string} text
 * @returns {SingleTweetAnalysis}
 */
export function analyzeTweet(text) {
  const trimmed = text.trim();
  const sentimentScore = scoreTweet(trimmed);
  const sentimentLabel = classify(sentimentScore);

  const tokens = meaningfulTokens(trimmed);
  /** @type {Record<string, number>} */
  const counts = {};
  for (const tok of tokens) counts[tok] = (counts[tok] ?? 0) + 1;
  const keywords = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([w]) => w);

  return {
    text: trimmed,
    length: trimmed.length,
    wordCount: (trimmed.match(/\S+/g) || []).length,
    hashtags: extractHashtags(trimmed),
    mentions: extractMentions(trimmed),
    emojis: extractEmojis(trimmed),
    keywords,
    sentiment: { score: sentimentScore, label: sentimentLabel },
    ai: detectAi(trimmed),
    algorithm: scoreAlgorithm(trimmed),
    readability: readability(trimmed),
    tone: detectTone(trimmed),
    analyzedAt: new Date().toISOString(),
  };
}
