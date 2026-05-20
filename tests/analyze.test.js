// @ts-check

import { describe, it, expect } from 'vitest';
import { analyze, parseTweets } from '../src/analysis/index.js';

describe('parseTweets', () => {
  it('splits lines and trims', () => {
    expect(parseTweets('one\n  two  \nthree')).toEqual(['one', 'two', 'three']);
  });

  it('drops empty lines', () => {
    expect(parseTweets('one\n\n\ntwo')).toEqual(['one', 'two']);
  });
});

describe('analyze (integration)', () => {
  const fixture = [
    'أحب البرمجة والتطوير 😍 #برمجة #تطوير',
    'اليوم كان يوماً رائعاً! تعلمت شيئاً جديداً 🎉',
    '@محمد شكراً على المساعدة 🙏',
    'I hate when this terrible bug appears 💔',
    'A balanced tweet with no strong feelings',
  ];

  it('counts tweets and words', () => {
    const result = analyze(fixture);
    expect(result.totalTweets).toBe(5);
    expect(result.totalWords).toBeGreaterThan(0);
  });

  it('extracts hashtags', () => {
    const result = analyze(fixture);
    expect(result.hashtags['#برمجة']).toBe(1);
    expect(result.hashtags['#تطوير']).toBe(1);
  });

  it('extracts mentions', () => {
    const result = analyze(fixture);
    expect(result.mentions['@محمد']).toBe(1);
  });

  it('detects sentiment across mixed-language tweets', () => {
    const result = analyze(fixture);
    expect(result.sentimentScores.positive).toBeGreaterThan(0);
    expect(result.sentimentScores.negative).toBeGreaterThan(0);
    expect(
      result.sentimentScores.positive +
        result.sentimentScores.neutral +
        result.sentimentScores.negative
    ).toBe(5);
  });

  it('extracts emojis', () => {
    const result = analyze(fixture);
    expect(Object.keys(result.emojis).length).toBeGreaterThan(0);
  });

  it('returns zeros for empty input', () => {
    const result = analyze([]);
    expect(result.totalTweets).toBe(0);
    expect(result.avgLength).toBe(0);
    expect(result.lengths).toEqual({ short: 0, medium: 0, long: 0 });
  });
});
