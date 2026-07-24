// @ts-check

import { describe, it, expect } from 'vitest';
import { suggestRewrites } from '../src/optimizer/rewrite-suggestions.js';
import { scoreAlgorithm } from '../src/analysis/algorithm-score.js';

describe('suggestRewrites', () => {
  it('returns suggestions with predicted scores', () => {
    const text = 'this is a thought I had today and I wanted to share something with everyone here';
    const original = scoreAlgorithm(text).score;
    const suggestions = suggestRewrites(text, original);
    expect(Array.isArray(suggestions)).toBe(true);
    for (const s of suggestions) {
      expect(['shorter', 'question', 'positive']).toContain(s.variant);
      expect(s.text).toBeTruthy();
      expect(s.predictedScore).toBeGreaterThanOrEqual(0);
      expect(s.predictedScore).toBeLessThanOrEqual(100);
      expect(typeof s.delta).toBe('number');
    }
  });

  it('does not return an identical-to-original suggestion', () => {
    const text = 'hello world';
    const original = scoreAlgorithm(text).score;
    const suggestions = suggestRewrites(text, original);
    for (const s of suggestions) {
      expect(s.text).not.toBe(text);
    }
  });

  it('question variant ends with a question mark', () => {
    const text = 'just shipped a new feature today';
    const original = scoreAlgorithm(text).score;
    const suggestions = suggestRewrites(text, original);
    const q = suggestions.find((s) => s.variant === 'question');
    if (q) expect(/[?؟]\s*$/.test(q.text)).toBe(true);
  });

  it('sorts suggestions by predicted score descending', () => {
    const text = 'hello world this is a test of the optimizer system today friend';
    const suggestions = suggestRewrites(text, scoreAlgorithm(text).score);
    for (let i = 1; i < suggestions.length; i++) {
      expect(suggestions[i - 1].predictedScore).toBeGreaterThanOrEqual(
        suggestions[i].predictedScore
      );
    }
  });
});
