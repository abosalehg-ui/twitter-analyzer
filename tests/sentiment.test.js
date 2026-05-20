// @ts-check

import { describe, it, expect } from 'vitest';
import { scoreTweet, classify, aggregateSentiment } from '../src/analysis/sentiment.js';

describe('scoreTweet', () => {
  it('scores positive words positively', () => {
    expect(scoreTweet('this is amazing')).toBeGreaterThan(0);
    expect(scoreTweet('رائع جداً')).toBeGreaterThan(0);
  });

  it('scores negative words negatively', () => {
    expect(scoreTweet('this is terrible')).toBeLessThan(0);
    expect(scoreTweet('سيء جداً')).toBeLessThan(0);
  });

  it('is case-insensitive (Hello/HELLO/love/LOVE)', () => {
    expect(scoreTweet('I LOVE this')).toBe(scoreTweet('i love this'));
    expect(scoreTweet('GREAT job')).toBe(scoreTweet('great job'));
  });

  it('does not match substring across words (loved should not double-count love)', () => {
    // both 'love' and 'loved' are in dictionary; tokenization separates them.
    // critically, the word "lovely" should NOT register as a hit (it isn't in dict).
    expect(scoreTweet('lovely day')).toBe(0);
  });

  it('weights positive emojis', () => {
    expect(scoreTweet('😊')).toBeGreaterThan(0);
    expect(scoreTweet('💔')).toBeLessThan(0);
  });

  it('returns 0 for neutral text', () => {
    expect(scoreTweet('this is a sentence')).toBe(0);
  });

  it('applies intensifier multiplier', () => {
    const base = scoreTweet('great');
    const intense = scoreTweet('very great');
    expect(intense).toBeGreaterThan(base);
  });

  it('handles empty string', () => {
    expect(scoreTweet('')).toBe(0);
  });
});

describe('classify', () => {
  it('maps positive score to positive', () => {
    expect(classify(5)).toBe('positive');
  });
  it('maps negative score to negative', () => {
    expect(classify(-3)).toBe('negative');
  });
  it('maps zero to neutral', () => {
    expect(classify(0)).toBe('neutral');
  });
});

describe('aggregateSentiment', () => {
  it('counts each tweet into one bucket', () => {
    const tweets = ['amazing day 😊', 'terrible loss', 'just a tweet'];
    const result = aggregateSentiment(tweets);
    expect(result.positive).toBe(1);
    expect(result.negative).toBe(1);
    expect(result.neutral).toBe(1);
  });

  it('handles empty array', () => {
    expect(aggregateSentiment([])).toEqual({ positive: 0, neutral: 0, negative: 0 });
  });

  it('sums to total tweets', () => {
    const tweets = ['great', 'bad', 'meh', 'love', 'hate'];
    const result = aggregateSentiment(tweets);
    expect(result.positive + result.negative + result.neutral).toBe(tweets.length);
  });
});
