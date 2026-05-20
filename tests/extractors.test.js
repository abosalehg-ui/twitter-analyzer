// @ts-check

import { describe, it, expect } from 'vitest';
import {
  extractHashtags,
  extractMentions,
  extractEmojis,
  countOccurrences,
} from '../src/analysis/extractors.js';

describe('extractHashtags', () => {
  it('extracts English hashtags', () => {
    expect(extractHashtags('hello #world and #foo_bar')).toEqual(['#world', '#foo_bar']);
  });

  it('extracts Arabic hashtags', () => {
    expect(extractHashtags('تعلم #برمجة و #تطوير_ويب')).toEqual(['#برمجة', '#تطوير_ويب']);
  });

  it('returns empty array when none present', () => {
    expect(extractHashtags('no hashtags here')).toEqual([]);
  });
});

describe('extractMentions', () => {
  it('extracts English mentions', () => {
    expect(extractMentions('hi @alice and @bob')).toEqual(['@alice', '@bob']);
  });

  it('extracts Arabic mentions', () => {
    expect(extractMentions('شكراً @محمد')).toEqual(['@محمد']);
  });
});

describe('extractEmojis', () => {
  it('extracts common emojis', () => {
    expect(extractEmojis('hello 😊 world 🎉')).toEqual(['😊', '🎉']);
  });

  it('returns empty array when none', () => {
    expect(extractEmojis('plain text')).toEqual([]);
  });
});

describe('countOccurrences', () => {
  it('counts items', () => {
    expect(countOccurrences(['a', 'b', 'a', 'c', 'a'])).toEqual({ a: 3, b: 1, c: 1 });
  });

  it('returns empty object for empty input', () => {
    expect(countOccurrences([])).toEqual({});
  });
});
