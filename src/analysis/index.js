// @ts-check

// Public API for single-tweet analysis (v3.0).
// The previous multi-tweet aggregate pipeline has been replaced by single-tweet
// deep analysis. Use analyzeTweet(text) → SingleTweetAnalysis.

export { analyzeTweet } from './single-tweet.js';
/** @typedef {import('./single-tweet.js').SingleTweetAnalysis} AnalysisResult */
