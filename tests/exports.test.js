// @ts-check

import { describe, it, expect } from 'vitest';
import { buildCsv, escapeCsvField } from '../src/export/csv.js';
import { buildJson } from '../src/export/json.js';
import { analyzeTweet } from '../src/analysis/index.js';

const fixture = analyzeTweet(
  'Just shipped a new feature 🚀 What do you think? "quoted, comma" included #js @alice'
);

describe('escapeCsvField', () => {
  it('escapes embedded quotes', () => {
    expect(escapeCsvField('he said "hi"')).toBe('"he said ""hi"""');
  });

  it('does not quote plain values', () => {
    expect(escapeCsvField('plain')).toBe('plain');
    expect(escapeCsvField(42)).toBe('42');
  });

  it('quotes values with newlines and commas', () => {
    expect(escapeCsvField('a,b')).toMatch(/^".*"$/);
    expect(escapeCsvField('line\nbreak')).toMatch(/^".*"$/s);
  });
});

describe('buildCsv (single-tweet)', () => {
  it('starts with header row', () => {
    expect(buildCsv(fixture).split('\n')[0]).toBe('section,key,value');
  });

  it('contains tweet, ai, algorithm, readability sections', () => {
    const csv = buildCsv(fixture);
    expect(csv).toContain('tweet,text');
    expect(csv).toContain('ai,score');
    expect(csv).toContain('algorithm,score');
    expect(csv).toContain('readability,score');
  });

  it('includes per-action probability rows', () => {
    const csv = buildCsv(fixture);
    expect(csv).toContain('p_like');
    expect(csv).toContain('p_reply');
    expect(csv).toContain('p_block_author');
  });

  it('includes hashtags and mentions', () => {
    const csv = buildCsv(fixture);
    expect(csv).toContain('hashtag,#js');
    expect(csv).toContain('mention,@alice');
  });
});

describe('buildJson (single-tweet)', () => {
  it('produces valid JSON', () => {
    expect(() => JSON.parse(buildJson(fixture))).not.toThrow();
  });

  it('wraps with v3 metadata', () => {
    const parsed = JSON.parse(buildJson(fixture));
    expect(parsed.version).toBe(3);
    expect(parsed.schema).toBe('single-tweet-analysis');
    expect(parsed.analysis).toBeDefined();
  });

  it('preserves analysis fields', () => {
    const parsed = JSON.parse(buildJson(fixture));
    expect(parsed.analysis.text).toBe(fixture.text);
    expect(parsed.analysis.ai.score).toBe(fixture.ai.score);
    expect(parsed.analysis.algorithm.score).toBe(fixture.algorithm.score);
  });

  it('generatedAt is a valid ISO timestamp', () => {
    const parsed = JSON.parse(buildJson(fixture));
    expect(new Date(parsed.generatedAt).toISOString()).toBe(parsed.generatedAt);
  });
});
