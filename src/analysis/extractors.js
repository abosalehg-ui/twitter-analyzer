// @ts-check

const HASHTAG_RE = /#[ء-يa-zA-Z0-9_]+/g;
const MENTION_RE = /@[ء-يa-zA-Z0-9_]+/g;
const EMOJI_RE = /\p{Extended_Pictographic}/gu;

/**
 * Extract all hashtags from text.
 * @param {string} text
 * @returns {string[]}
 */
export function extractHashtags(text) {
  return text.match(HASHTAG_RE) ?? [];
}

/**
 * Extract all @mentions from text.
 * @param {string} text
 * @returns {string[]}
 */
export function extractMentions(text) {
  return text.match(MENTION_RE) ?? [];
}

/**
 * Extract all emoji (Extended_Pictographic) from text.
 * @param {string} text
 * @returns {string[]}
 */
export function extractEmojis(text) {
  return text.match(EMOJI_RE) ?? [];
}

/**
 * Count occurrences of items into a Map<string, number>.
 * @param {string[]} items
 * @returns {Record<string, number>}
 */
export function countOccurrences(items) {
  /** @type {Record<string, number>} */
  const counts = {};
  for (const item of items) {
    counts[item] = (counts[item] ?? 0) + 1;
  }
  return counts;
}
