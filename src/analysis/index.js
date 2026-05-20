// @ts-check

import {
  extractHashtags,
  extractMentions,
  extractEmojis,
  countOccurrences,
} from './extractors.js';
import { aggregateSentiment } from './sentiment.js';
import { lengthDistribution, extremes, totalWordCount } from './stats.js';
import { meaningfulTokens } from './tokenize.js';

/**
 * @typedef {Object} AnalysisResult
 * @property {number} totalTweets
 * @property {number} totalWords
 * @property {number} avgLength
 * @property {Record<string, number>} hashtags
 * @property {Record<string, number>} mentions
 * @property {Record<string, number>} emojis
 * @property {Record<string, number>} words
 * @property {{ positive: number, neutral: number, negative: number }} sentimentScores
 * @property {{ short: number, medium: number, long: number }} lengths
 * @property {{ text: string, length: number }} longestTweet
 * @property {{ text: string, length: number }} shortestTweet
 */

/**
 * Parse raw input text into a list of non-empty tweets, one per line.
 * @param {string} text
 * @returns {string[]}
 */
export function parseTweets(text) {
  return text
    .split('\n')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

/**
 * Run the full analysis pipeline over a list of tweets.
 * @param {string[]} tweets
 * @returns {AnalysisResult}
 */
export function analyze(tweets) {
  const totalTweets = tweets.length;
  const totalWords = totalWordCount(tweets);
  const avgLength = totalTweets > 0 ? Math.round(totalWords / totalTweets) : 0;

  /** @type {string[]} */
  const allHashtags = [];
  /** @type {string[]} */
  const allMentions = [];
  /** @type {string[]} */
  const allEmojis = [];
  /** @type {string[]} */
  const allWords = [];

  for (const tweet of tweets) {
    allHashtags.push(...extractHashtags(tweet));
    allMentions.push(...extractMentions(tweet));
    allEmojis.push(...extractEmojis(tweet));
    allWords.push(...meaningfulTokens(tweet));
  }

  const { longest, shortest } = extremes(tweets);

  return {
    totalTweets,
    totalWords,
    avgLength,
    hashtags: countOccurrences(allHashtags),
    mentions: countOccurrences(allMentions),
    emojis: countOccurrences(allEmojis),
    words: countOccurrences(allWords),
    sentimentScores: aggregateSentiment(tweets),
    lengths: lengthDistribution(tweets),
    longestTweet: longest,
    shortestTweet: shortest,
  };
}
