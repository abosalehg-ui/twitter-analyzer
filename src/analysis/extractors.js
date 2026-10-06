// @ts-check

// Single source of truth for entity patterns. Every module that counts, strips or
// matches these imports them from here, so all panels agree on the same text.
// \p{L}\p{N} covers Arabic letters beyond ء-ي and Arabic-Indic digits (#رؤية٢٠٣٠).
// All are /g: use them with match()/replace() only — test() would be stateful.
export const HASHTAG_RE = /#[\p{L}\p{N}_]+/gu;
export const MENTION_RE = /@[\p{L}\p{N}_]+/gu;
export const LINK_RE = /https?:\/\/\S+/g;
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
 * Extract all links.
 * @param {string} text
 * @returns {string[]}
 */
export function extractLinks(text) {
  return text.match(LINK_RE) ?? [];
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
