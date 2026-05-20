// @ts-check

import { describe, it, expect } from 'vitest';
import { analyzeTweet } from '../src/analysis/index.js';

describe('analyzeTweet', () => {
  it('returns a full SingleTweetAnalysis object', () => {
    const r = analyzeTweet('Just shipped a new feature 🚀 What do you think?');
    expect(r.text).toBeDefined();
    expect(r.length).toBeGreaterThan(0);
    expect(r.wordCount).toBeGreaterThan(0);
    expect(r.ai).toBeDefined();
    expect(r.algorithm).toBeDefined();
    expect(r.readability).toBeDefined();
    expect(r.tone).toBeDefined();
    expect(r.sentiment).toBeDefined();
    expect(r.analyzedAt).toMatch(/T.*Z$/);
  });

  it('extracts hashtags, mentions, emojis', () => {
    const r = analyzeTweet('hi @alice #js 😊');
    expect(r.hashtags).toContain('#js');
    expect(r.mentions).toContain('@alice');
    expect(r.emojis).toContain('😊');
  });

  it('handles Arabic input', () => {
    const r = analyzeTweet('أحب البرمجة #تطوير 😍');
    expect(r.hashtags).toContain('#تطوير');
    expect(r.emojis.length).toBeGreaterThan(0);
    expect(r.algorithm.score).toBeGreaterThanOrEqual(0);
  });

  it('trims whitespace', () => {
    const r = analyzeTweet('  hello world  ');
    expect(r.text).toBe('hello world');
  });

  it('produces sentiment label', () => {
    expect(analyzeTweet('this is amazing!').sentiment.label).toBe('positive');
    expect(analyzeTweet('this is terrible').sentiment.label).toBe('negative');
  });

  it('keywords are deduplicated meaningful tokens', () => {
    const r = analyzeTweet('coding coding coding is fun fun');
    expect(r.keywords.length).toBeGreaterThan(0);
    // Same word should not appear twice
    expect(new Set(r.keywords).size).toBe(r.keywords.length);
  });
});
