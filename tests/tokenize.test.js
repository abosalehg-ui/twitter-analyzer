// @ts-check

import { describe, it, expect } from 'vitest';
import { tokenize, meaningfulTokens, normalizeArabic } from '../src/analysis/tokenize.js';

describe('normalizeArabic', () => {
  it('strips diacritics', () => {
    expect(normalizeArabic('مَرْحَبًا')).toBe('مرحبا');
  });

  it('unifies alef variants', () => {
    expect(normalizeArabic('آمَل')).toBe('امل');
    expect(normalizeArabic('أصبح')).toBe('اصبح');
    expect(normalizeArabic('إنسان')).toBe('انسان');
  });

  it('converts taa marbuta and alef maksura', () => {
    expect(normalizeArabic('مدرسة')).toBe('مدرسه');
    expect(normalizeArabic('على')).toBe('علي');
  });
});

describe('tokenize', () => {
  it('returns lowercased tokens', () => {
    expect(tokenize('Hello WORLD')).toEqual(['hello', 'world']);
  });

  it('strips hashtags and mentions', () => {
    expect(tokenize('hello #world @bob there')).toEqual(['hello', 'there']);
  });

  it('strips URLs', () => {
    expect(tokenize('check https://example.com out')).toEqual(['check', 'out']);
  });

  it('handles Arabic text', () => {
    const tokens = tokenize('أحب البرمجة كثيراً');
    expect(tokens).toContain('احب');
    expect(tokens).toContain('البرمجه');
    expect(tokens).toContain('كثيرا');
  });

  it('handles mixed Arabic/English/emoji', () => {
    expect(tokenize('hello مرحبا 😊 world')).toEqual(['hello', 'مرحبا', 'world']);
  });

  it('returns empty array for empty input', () => {
    expect(tokenize('')).toEqual([]);
    expect(tokenize('   ')).toEqual([]);
    expect(tokenize('🎉😊')).toEqual([]);
  });
});

describe('meaningfulTokens', () => {
  it('drops stop words', () => {
    expect(meaningfulTokens('the cat is on the mat')).toEqual(['cat', 'mat']);
  });

  it('drops short tokens by default', () => {
    expect(meaningfulTokens('a b cd efg')).toEqual(['efg']);
  });

  it('drops Arabic stop words after normalization', () => {
    const tokens = meaningfulTokens('في البيت مع العائله');
    expect(tokens).not.toContain('في');
    expect(tokens).not.toContain('مع');
    expect(tokens).toContain('البيت');
  });
});
