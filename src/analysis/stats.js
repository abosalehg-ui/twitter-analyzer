// @ts-check

/**
 * @typedef {{ short: number, medium: number, long: number }} LengthBuckets
 * @typedef {{ text: string, length: number }} TweetRef
 */

/**
 * Bucket a tweet length into short/medium/long by character count.
 * @param {number} length
 * @returns {'short' | 'medium' | 'long'}
 */
export function bucketForLength(length) {
  if (length < 50) return 'short';
  if (length < 150) return 'medium';
  return 'long';
}

/**
 * Compute length-bucket histogram for a list of tweets.
 * @param {string[]} tweets
 * @returns {LengthBuckets}
 */
export function lengthDistribution(tweets) {
  const buckets = { short: 0, medium: 0, long: 0 };
  for (const tweet of tweets) {
    buckets[bucketForLength(tweet.length)]++;
  }
  return buckets;
}

/**
 * Find the longest and shortest tweets by character count.
 * Returns null refs for an empty array.
 * @param {string[]} tweets
 * @returns {{ longest: TweetRef, shortest: TweetRef }}
 */
export function extremes(tweets) {
  if (tweets.length === 0) {
    return { longest: { text: '', length: 0 }, shortest: { text: '', length: 0 } };
  }
  let longest = { text: tweets[0], length: tweets[0].length };
  let shortest = { text: tweets[0], length: tweets[0].length };
  for (const tweet of tweets) {
    if (tweet.length > longest.length) longest = { text: tweet, length: tweet.length };
    if (tweet.length < shortest.length) shortest = { text: tweet, length: tweet.length };
  }
  return { longest, shortest };
}

/**
 * Word count across all tweets (whitespace-delimited, matches old behavior).
 * @param {string[]} tweets
 * @returns {number}
 */
export function totalWordCount(tweets) {
  let total = 0;
  for (const tweet of tweets) {
    const words = tweet.trim().split(/\s+/).filter(Boolean);
    total += words.length;
  }
  return total;
}
