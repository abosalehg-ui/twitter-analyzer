// @ts-check

import { describe, it, expect } from 'vitest';
import { buildCsv, escapeCsvField } from '../src/export/csv.js';
import { buildJson } from '../src/export/json.js';
import { analyze } from '../src/analysis/index.js';

const fixture = analyze([
  'أحب البرمجة 😍 #برمجة',
  '@محمد شكراً 🙏',
  'this is "quoted, text" with, commas\nand newline',
]);

describe('buildCsv', () => {
  it('starts with the header row', () => {
    const csv = buildCsv(fixture);
    expect(csv.split('\n')[0]).toBe('section,key,value');
  });

  it('quotes fields containing commas', () => {
    const csv = buildCsv(fixture);
    // any value with a comma must be surrounded by quotes
    for (const line of csv.split('\n').slice(1)) {
      const parts = line.split(',');
      if (parts.length > 3) {
        // means a comma inside a value — that field must be quoted
        expect(line).toMatch(/"/);
      }
    }
  });

  it('escapes embedded quotes by doubling them (escapeCsvField)', () => {
    expect(escapeCsvField('he said "hi"')).toBe('"he said ""hi"""');
  });

  it('does not quote plain values', () => {
    expect(escapeCsvField('plain')).toBe('plain');
    expect(escapeCsvField(42)).toBe('42');
  });

  it('quotes values with newlines', () => {
    expect(escapeCsvField('line1\nline2')).toBe('"line1\nline2"');
  });

  it('contains all stats rows', () => {
    const csv = buildCsv(fixture);
    expect(csv).toMatch(/stats,.*,3/); // 3 tweets
  });

  it('includes hashtag and mention rows', () => {
    const csv = buildCsv(fixture);
    expect(csv).toContain('hashtag,#برمجة');
    expect(csv).toContain('mention,@محمد');
  });
});

describe('buildJson', () => {
  it('produces valid JSON', () => {
    const json = buildJson(fixture);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('wraps analysis with metadata', () => {
    const parsed = JSON.parse(buildJson(fixture));
    expect(parsed).toHaveProperty('generatedAt');
    expect(parsed).toHaveProperty('version', 1);
    expect(parsed).toHaveProperty('analysis');
  });

  it('preserves all analysis fields', () => {
    const parsed = JSON.parse(buildJson(fixture));
    expect(parsed.analysis.totalTweets).toBe(fixture.totalTweets);
    expect(parsed.analysis.hashtags).toEqual(fixture.hashtags);
    expect(parsed.analysis.sentimentScores).toEqual(fixture.sentimentScores);
  });

  it('generatedAt is a valid ISO timestamp', () => {
    const parsed = JSON.parse(buildJson(fixture));
    expect(new Date(parsed.generatedAt).toISOString()).toBe(parsed.generatedAt);
  });
});
