// @ts-check

import { describe, it, expect } from 'vitest';
import { scoreAlgorithm } from '../src/analysis/algorithm-score.js';
import { ACTION_KEYS } from '../src/data/algorithm-weights.js';
import {
  extractFeatures,
  predictProbabilities,
} from '../src/analysis/engagement-predictor.js';

describe('scoreAlgorithm', () => {
  it('returns score in 0..100 range and reach bucket', () => {
    const r = scoreAlgorithm('Just shipped a new feature! Excited to share it 🚀 What do you think?');
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
    expect(['low', 'medium', 'good', 'excellent']).toContain(r.reach);
  });

  it('emits a probability per tracked action (15 total)', () => {
    const r = scoreAlgorithm('hello world');
    expect(r.contributions.length).toBe(ACTION_KEYS.length);
    expect(ACTION_KEYS.length).toBe(15);
  });

  it('penalizes engagement bait', () => {
    const bait = scoreAlgorithm('RT to win this giveaway! Follow and like to enter!');
    const clean = scoreAlgorithm('Just launched a new project, sharing the journey here. Curious to hear your take?');
    expect(clean.score).toBeGreaterThan(bait.score);
  });

  it('penalizes external links when length is matched', () => {
    // Both texts are in sweet-spot length; only the link differs.
    const withLink = scoreAlgorithm(
      'Check this interesting article about productivity hacks https://example.com/article-xyz'
    );
    const withoutLink = scoreAlgorithm(
      'Check this interesting article about productivity hacks — a fantastic read overall mate'
    );
    expect(withoutLink.score).toBeGreaterThan(withLink.score);
  });

  it('rewards questions (drives replies)', () => {
    const question = scoreAlgorithm('What is your favorite productivity hack lately?');
    const statement = scoreAlgorithm('My favorite productivity hack lately is time blocking.');
    expect(question.score).toBeGreaterThanOrEqual(statement.score);
  });

  it('penalizes toxicity', () => {
    const toxic = scoreAlgorithm('this is so stupid and dumb, what an idiot');
    const neutral = scoreAlgorithm('this is so different from what I expected, interesting take');
    expect(neutral.score).toBeGreaterThan(toxic.score);
  });

  it('produces recommendations including allGood for great tweets', () => {
    const r = scoreAlgorithm(
      'Just realized something powerful about consistency — what tiny daily habit changed your life? 🌱'
    );
    expect(Array.isArray(r.recommendations)).toBe(true);
    expect(r.recommendations.length).toBeGreaterThan(0);
  });

  it('flags too-short tweets', () => {
    const r = scoreAlgorithm('hi');
    expect(r.recommendations).toContain('algo.rec.tooShort');
  });

  it('flags too many hashtags', () => {
    const r = scoreAlgorithm('cool thing today #a #b #c #d #e');
    expect(r.recommendations).toContain('algo.rec.tooManyHashtags');
  });
});

describe('feature extraction', () => {
  it('counts hashtags, mentions, emojis', () => {
    const f = extractFeatures('hi #a #b @user 😊 😎');
    expect(f.hashtagCount).toBe(2);
    expect(f.mentionCount).toBe(1);
    expect(f.emojiCount).toBe(2);
  });

  it('detects questions', () => {
    expect(extractFeatures('What do you think?').hasQuestion).toBe(true);
    expect(extractFeatures('ما رأيكم؟').hasQuestion).toBe(true);
    expect(extractFeatures('I think this.').hasQuestion).toBe(false);
  });

  it('flags sweet-spot length 70-150', () => {
    expect(extractFeatures('x'.repeat(100)).isInBaitSweetspot).toBe(true);
    expect(extractFeatures('x'.repeat(50)).isInBaitSweetspot).toBe(false);
    expect(extractFeatures('x'.repeat(200)).isInBaitSweetspot).toBe(false);
  });

  it('counts links', () => {
    expect(extractFeatures('hi http://x.com and https://y.com here').linkCount).toBe(2);
  });
});

describe('predictProbabilities', () => {
  it('returns probabilities clamped to 0..1', () => {
    const f = extractFeatures('hello world');
    const p = predictProbabilities(f);
    for (const v of Object.values(p)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it('increases reply probability when a question is present', () => {
    const q = predictProbabilities(extractFeatures('What is your take on this idea?'));
    const s = predictProbabilities(extractFeatures('This is my take on this idea.'));
    expect(q.reply).toBeGreaterThan(s.reply);
  });
});
