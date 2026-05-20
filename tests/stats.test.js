// @ts-check

import { describe, it, expect } from 'vitest';
import { bucketForLength, lengthDistribution, extremes, totalWordCount } from '../src/analysis/stats.js';

describe('bucketForLength', () => {
  it('classifies under 50 as short', () => {
    expect(bucketForLength(10)).toBe('short');
    expect(bucketForLength(49)).toBe('short');
  });

  it('classifies 50-149 as medium', () => {
    expect(bucketForLength(50)).toBe('medium');
    expect(bucketForLength(149)).toBe('medium');
  });

  it('classifies 150+ as long', () => {
    expect(bucketForLength(150)).toBe('long');
    expect(bucketForLength(500)).toBe('long');
  });
});

describe('lengthDistribution', () => {
  it('buckets correctly', () => {
    const tweets = ['short', 'a'.repeat(60), 'b'.repeat(200)];
    expect(lengthDistribution(tweets)).toEqual({ short: 1, medium: 1, long: 1 });
  });

  it('returns zeros for empty', () => {
    expect(lengthDistribution([])).toEqual({ short: 0, medium: 0, long: 0 });
  });
});

describe('extremes', () => {
  it('finds longest and shortest', () => {
    const tweets = ['short', 'medium length text', 'a very very long tweet body indeed'];
    const result = extremes(tweets);
    expect(result.longest.text).toBe('a very very long tweet body indeed');
    expect(result.shortest.text).toBe('short');
  });

  it('handles single tweet', () => {
    const result = extremes(['only one']);
    expect(result.longest.text).toBe('only one');
    expect(result.shortest.text).toBe('only one');
  });

  it('handles empty array', () => {
    expect(extremes([])).toEqual({
      longest: { text: '', length: 0 },
      shortest: { text: '', length: 0 },
    });
  });
});

describe('totalWordCount', () => {
  it('counts whitespace-separated words', () => {
    expect(totalWordCount(['hello world', 'foo bar baz'])).toBe(5);
  });

  it('handles empty array', () => {
    expect(totalWordCount([])).toBe(0);
  });

  it('handles tweets with extra whitespace', () => {
    expect(totalWordCount(['  hello   world  '])).toBe(2);
  });
});
