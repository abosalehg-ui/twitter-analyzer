// @ts-check

import { describe, it, expect } from 'vitest';
import {
  detectAi,
  burstinessSignal,
  lexicalDiversitySignal,
  clicheSignal,
  emojiDensitySignal,
  typoSignal,
} from '../src/analysis/ai-detection.js';

describe('detectAi', () => {
  it('returns a structured result with score 0..100', () => {
    const r = detectAi('hello world this is a test tweet');
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
    expect(Array.isArray(r.signals)).toBe(true);
    expect(r.signals.length).toBeGreaterThan(0);
  });

  it('flags low confidence on very short text', () => {
    expect(detectAi('hi').confidence).toBe('low');
  });

  it('flags high confidence on long text', () => {
    const long =
      'this is a fairly comprehensive sentence that goes on for quite a while ' +
      'so that we have enough characters to give the heuristics something to work with';
    expect(detectAi(long).confidence).toBe('high');
  });

  it('returns higher AI score for an LLM-flavored tweet', () => {
    const aiLike =
      'It is important to note that we must delve into the complexities of this multifaceted issue; furthermore, the implications are profound.';
    const human = 'yo this bug is killing me 😭 ngl idk what to do anymore lol';
    const ai = detectAi(aiLike);
    const hm = detectAi(human);
    expect(ai.score).toBeGreaterThan(hm.score);
  });

  it('detects cliche phrases (Arabic + English)', () => {
    const en = clicheSignal('we should delve into this and it is worth noting that...');
    expect(en.matches.length).toBeGreaterThan(0);
    const ar = clicheSignal('تجدر الإشارة إلى أن هذا الأمر يستحق التأمل.');
    expect(ar.matches.length).toBeGreaterThan(0);
  });

  it('detects human signals (slang)', () => {
    const r = typoSignal('lol that was lit ngl');
    expect(r.matches.length).toBeGreaterThan(0);
  });
});

describe('signal primitives', () => {
  it('burstiness: uniform sentences score high (AI-like)', () => {
    const uniform = 'this sentence is alpha. this sentence is beta. this sentence is gamma.';
    expect(burstinessSignal(uniform)).toBeGreaterThan(0.5);
  });

  it('burstiness: varied sentences score low (human-like)', () => {
    const bursty = 'wow! this is a much longer sentence that goes on and on and on without stopping much. ok bye.';
    expect(burstinessSignal(bursty)).toBeLessThan(0.7);
  });

  it('emojiDensity: many emojis lower the score', () => {
    expect(emojiDensitySignal('hi 😊 there 🎉 friend 💖')).toBeLessThan(0.5);
  });

  it('emojiDensity: zero emojis on long text raises the score', () => {
    expect(emojiDensitySignal('this is a moderately long tweet without any emojis at all here')).toBeGreaterThan(0.5);
  });

  it('lexicalDiversity: very high TTR is suspicious', () => {
    // all-unique words → very high TTR
    const unique = 'alpha beta gamma delta epsilon zeta eta theta iota kappa';
    const score = lexicalDiversitySignal(unique);
    expect(score).toBeGreaterThan(0.6);
  });
});
