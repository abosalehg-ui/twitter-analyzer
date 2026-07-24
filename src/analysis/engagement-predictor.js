// @ts-check

import { normalizeArabic } from './tokenize.js';
import { extractEmojis, extractHashtags, extractMentions } from './extractors.js';
import { scoreTweet, classify } from './sentiment.js';
import { BAIT_PATTERNS } from '../data/bait-patterns.js';
import { SENSITIVE_PATTERNS } from '../data/sensitive-words.js';

/**
 * @typedef {Object} TweetFeatures
 * @property {number} length              char count
 * @property {number} wordCount
 * @property {number} hashtagCount
 * @property {number} mentionCount
 * @property {number} emojiCount
 * @property {number} linkCount
 * @property {boolean} hasMediaUrl        link likely to be twitter-native media
 * @property {boolean} hasQuestion        contains question marker
 * @property {boolean} hasCta             contains CTA verb (vote/share/check)
 * @property {boolean} isInBaitSweetspot  length 70-150
 * @property {number} baitHits            count of engagement-bait patterns matched
 * @property {number} toxicityHits
 * @property {number} spamHits
 * @property {number} politicalHits
 * @property {'positive'|'neutral'|'negative'} sentiment
 * @property {number} sentimentScore
 * @property {number} allCapsWords        words ALL CAPS (>=3 chars)
 *
 * @typedef {Object} EngagementPrediction
 * @property {Record<string, number>} probabilities  Action → 0..1 probability
 * @property {TweetFeatures} features
 */

const QUESTION_RE = /[?؟]/;
const CTA_AR = ['شاركني', 'علق', 'علّق', 'صوّت', 'صوت', 'رايكم', 'رأيكم', 'برايكم', 'برأيكم'];
const CTA_EN = ['vote', 'share your', 'tell me', 'let me know', 'reply with', 'comment'];
const LINK_RE = /https?:\/\/\S+/g;
const MEDIA_HOSTS = [
  'pic.twitter.com',
  'x.com/i/web/status',
  'twitter.com/i/web/status',
  'video.twimg.com',
];

/**
 * Lowercase + normalize Arabic.
 * @param {string} text
 */
function norm(text) {
  return normalizeArabic(text).toLowerCase();
}

/**
 * Count pattern matches against a normalized text.
 * @param {string} normText
 * @param {Record<string, string[]>} dict
 */
function countMatches(normText, dict) {
  let count = 0;
  for (const list of Object.values(dict)) {
    for (const word of list) {
      if (normText.includes(norm(word))) count++;
    }
  }
  return count;
}

/**
 * Extract all the features used by the engagement predictor.
 * @param {string} text
 * @returns {TweetFeatures}
 */
export function extractFeatures(text) {
  const normText = norm(text);
  const wordCount = (text.match(/\S+/g) || []).length;
  const hashtags = extractHashtags(text);
  const mentions = extractMentions(text);
  const emojis = extractEmojis(text);
  const links = text.match(LINK_RE) || [];
  const hasMediaUrl = links.some((l) => MEDIA_HOSTS.some((h) => l.includes(h)));

  const hasQuestion = QUESTION_RE.test(text);
  const hasCta = [...CTA_AR, ...CTA_EN].some((p) => normText.includes(norm(p)));

  const sentimentScore = scoreTweet(text);
  const sentiment = classify(sentimentScore);

  const baitHits = countMatches(normText, BAIT_PATTERNS);
  const toxicityHits = countMatches(normText, SENSITIVE_PATTERNS.toxicity);
  const spamHits = countMatches(normText, SENSITIVE_PATTERNS.spammy);
  const politicalHits = countMatches(normText, SENSITIVE_PATTERNS.political);

  const allCapsWords = (text.match(/\b[A-Z]{3,}\b/g) || []).length;

  return {
    length: text.length,
    wordCount,
    hashtagCount: hashtags.length,
    mentionCount: mentions.length,
    emojiCount: emojis.length,
    linkCount: links.length,
    hasMediaUrl,
    hasQuestion,
    hasCta,
    isInBaitSweetspot: text.length >= 70 && text.length <= 150,
    baitHits,
    toxicityHits,
    spamHits,
    politicalHits,
    sentiment,
    sentimentScore,
    allCapsWords,
  };
}

/**
 * Clamp to a [0,1] band.
 * @param {number} x
 */
function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

/**
 * Predict probability for each of the 15 actions tracked by xai-org/x-algorithm,
 * given the extracted features. Heuristic — values are relative not absolute.
 *
 * @param {TweetFeatures} f
 * @returns {Record<string, number>}
 */
export function predictProbabilities(f) {
  // Base "engagement potential" from length sweet spot
  const lengthBoost = f.isInBaitSweetspot
    ? 0.15
    : f.length < 30
      ? -0.1
      : f.length > 240
        ? -0.05
        : 0;
  const positiveBoost = f.sentiment === 'positive' ? 0.1 : f.sentiment === 'negative' ? -0.05 : 0;
  const baitPenalty = f.baitHits * 0.15;
  const toxPenalty = f.toxicityHits * 0.1;
  const spamPenalty = f.spamHits * 0.2;
  const linkPenalty = f.linkCount * (f.hasMediaUrl ? 0.02 : 0.08);
  const hashtagPenalty = Math.max(0, f.hashtagCount - 2) * 0.05;
  const mentionPenalty = Math.max(0, f.mentionCount - 2) * 0.04;

  // === Positive actions ===
  // like — broadest engagement
  const like = clamp01(
    0.35 +
      lengthBoost +
      positiveBoost +
      f.emojiCount * 0.02 -
      baitPenalty -
      toxPenalty -
      spamPenalty -
      linkPenalty -
      mentionPenalty
  );

  // reply — requires question or CTA
  let reply = 0.15;
  if (f.hasQuestion) reply += 0.25;
  if (f.hasCta) reply += 0.15;
  reply += positiveBoost * 0.5;
  reply -= baitPenalty + toxPenalty + spamPenalty;
  reply = clamp01(reply);

  // repost — driven by length sweet spot + positive tone, hurt by external links
  const repost = clamp01(
    0.2 +
      lengthBoost +
      positiveBoost -
      linkPenalty -
      baitPenalty -
      spamPenalty -
      hashtagPenalty -
      mentionPenalty
  );

  // share — like repost but lower base
  const share = clamp01(0.12 + lengthBoost * 0.7 + positiveBoost * 0.5 - linkPenalty - baitPenalty);

  // click — driven by presence of links AND interesting hook
  const click = clamp01(
    (f.linkCount > 0 ? 0.25 : 0.05) + (f.hasQuestion ? 0.05 : 0) - baitPenalty - spamPenalty
  );

  // profile_click — high when tweet is interesting & medium-length, no links
  const profile_click = clamp01(0.15 + (f.isInBaitSweetspot ? 0.1 : 0) - linkPenalty - baitPenalty);

  // video_view / photo_expand — depend on media url
  const video_view = clamp01(f.hasMediaUrl ? 0.4 : 0.02);
  const photo_expand = clamp01(f.hasMediaUrl ? 0.35 : 0.02);

  // dwell — proportional to length up to a point
  const dwell = clamp01(0.2 + Math.min(f.length, 200) / 1000 + positiveBoost - linkPenalty);

  // follow — driven by quality content, no bait, no spam
  const follow = clamp01(
    0.08 +
      (f.isInBaitSweetspot ? 0.04 : 0) +
      positiveBoost * 0.5 -
      baitPenalty -
      spamPenalty -
      toxPenalty
  );

  // === Negative actions === (higher when content is problematic)
  const not_interested = clamp01(
    0.05 +
      baitPenalty +
      spamPenalty * 0.7 +
      (f.linkCount > 2 ? 0.1 : 0) +
      (f.politicalHits > 0 ? 0.08 : 0)
  );
  const block_author = clamp01(0.01 + toxPenalty * 1.2 + spamPenalty * 0.5);
  const mute_author = clamp01(
    0.02 + baitPenalty * 0.8 + toxPenalty * 0.7 + (f.allCapsWords >= 3 ? 0.1 : 0)
  );
  const report = clamp01(toxPenalty * 1.5 + spamPenalty * 0.8);
  const hide = clamp01(0.03 + baitPenalty * 0.6 + spamPenalty * 0.5 + (f.linkCount > 2 ? 0.05 : 0));

  return {
    like,
    reply,
    repost,
    share,
    click,
    profile_click,
    video_view,
    photo_expand,
    dwell,
    follow,
    not_interested,
    block_author,
    mute_author,
    report,
    hide,
  };
}

/**
 * Full prediction wrapper.
 * @param {string} text
 * @returns {EngagementPrediction}
 */
export function predictEngagement(text) {
  const features = extractFeatures(text);
  const probabilities = predictProbabilities(features);
  return { features, probabilities };
}
