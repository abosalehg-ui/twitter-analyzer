// @ts-check

// Guards the Arabic-specific correctness bugs that the generic tests missed:
// dictionaries that could never match after normalization, substring matching
// that flagged innocent words, and \b-based regexes that are dead on Arabic.

import { describe, it, expect } from 'vitest';
import { normForMatch } from '../src/analysis/normalize.js';
import { tokenize, meaningfulTokens } from '../src/analysis/tokenize.js';
import { scoreTweet } from '../src/analysis/sentiment.js';
import { extractFeatures } from '../src/analysis/engagement-predictor.js';
import { scoreAlgorithm } from '../src/analysis/algorithm-score.js';
import { suggestRewrites } from '../src/optimizer/rewrite-suggestions.js';
import { extractHashtags } from '../src/analysis/extractors.js';
import { hashtagPatternSignal } from '../src/analysis/ai-detection.js';
import { readability } from '../src/analysis/readability.js';
import { POSITIVE_WORDS, NEGATIVE_WORDS, INTENSIFIERS } from '../src/data/sentiment-dict.js';
import { STOP_WORDS } from '../src/data/stopwords.js';

describe('dictionaries are stored in the normalized form tokens use', () => {
  const sets = { POSITIVE_WORDS, NEGATIVE_WORDS, INTENSIFIERS, STOP_WORDS };
  for (const [name, set] of Object.entries(sets)) {
    it(`${name}: every entry equals its own normalized key`, () => {
      const unmatched = [...set].filter((w) => normForMatch(w) !== w);
      expect(unmatched).toEqual([]);
    });
  }
});

describe('sentiment on Arabic forms that used to be dropped', () => {
  it('feminine (ة) form scores like the masculine one', () => {
    expect(scoreTweet('انا سعيدة')).toBeGreaterThan(0);
    expect(scoreTweet('انا سعيدة')).toBe(scoreTweet('انا سعيد'));
  });

  it('hamza-on-alef spellings match', () => {
    expect(scoreTweet('أحب هذا')).toBe(scoreTweet('احب هذا'));
  });

  it('stop words with hamza are filtered', () => {
    expect(meaningfulTokens('ذهبت إلى السوق')).not.toContain(tokenize('إلى')[0]);
  });
});

describe('sensitive-word matching is token-based, not substring', () => {
  it('"حيوانات أليفة" is not toxic', () => {
    expect(extractFeatures('عندي حيوانات أليفة في البيت').toxicityHits).toBe(0);
  });

  it('an innocent word does not zero the algorithm score', () => {
    const base = 'عندي قطط أليفة في البيت وأحبها كثير، صباحكم جميل يا أصدقاء ومتفائل بيوم حلو';
    const withAnimals = base.replace('قطط', 'حيوانات');
    expect(scoreAlgorithm(withAnimals).score).toBe(scoreAlgorithm(base).score);
  });

  it('"الرئيسية" and "software" are not political', () => {
    expect(extractFeatures('الصفحة الرئيسية').politicalHits).toBe(0);
    expect(extractFeatures('I love writing software').politicalHits).toBe(0);
  });

  it('still catches the real word, with or without a clitic prefix', () => {
    expect(extractFeatures('انت غبي').toxicityHits).toBe(1);
    expect(extractFeatures('والغبي ما فهم').toxicityHits).toBe(1);
    expect(extractFeatures('you are stupid').toxicityHits).toBe(1);
  });

  it('still matches multi-word and non-letter phrases', () => {
    expect(extractFeatures('follow back please').baitHits).toBeGreaterThan(0);
    expect(extractFeatures('f4f anyone').baitHits).toBeGreaterThan(0);
    expect(extractFeatures('اربح المال الآن').spamHits).toBeGreaterThan(0);
  });
});

describe('optimizer works on Arabic text', () => {
  it('positive rewrite replaces Arabic negative words', () => {
    const s = suggestRewrites('هذا المطعم سيء والخدمة فظيعة', 30).find(
      (x) => x.variant === 'positive'
    );
    expect(s?.text).toContain('صعب');
    expect(s?.text).not.toContain('سيء');
  });

  it('does not rewrite inside a longer word', () => {
    const s = suggestRewrites('السيئات كثيرة', 30).find((x) => x.variant === 'positive');
    expect(s?.text).toContain('السيئات');
  });

  it('shorter variant removes filler instead of truncating', () => {
    const long = 'هذا '.repeat(40) + 'جدا ' + 'النهاية';
    const s = suggestRewrites(long, 30).find((x) => x.variant === 'shorter');
    expect(s?.text.endsWith('النهاية')).toBe(true);
    expect(s?.text).not.toContain('…');
  });

  it('skips the shorter variant when there is nothing to remove', () => {
    const variants = suggestRewrites('كتبت تغريدة واضحة ومباشرة', 30).map((x) => x.variant);
    expect(variants).not.toContain('shorter');
  });
});

describe('entity patterns are consistent across modules', () => {
  it('hashtags keep Arabic-Indic digits', () => {
    expect(extractHashtags('#رؤية٢٠٣٠')).toEqual(['#رؤية٢٠٣٠']);
  });

  it('AI hashtag signal and the extractor agree on the count', () => {
    // 4+ hashtags → 0.85 in hashtagPatternSignal; must be the same hashtags we display
    const text = 'نص #أ١ #ب٢ #ج٣ #د٤';
    expect(extractHashtags(text)).toHaveLength(4);
    expect(hashtagPatternSignal(text)).toBe(0.85);
  });
});

describe('readability result shape', () => {
  it('exposes longWordRatio as a finite number', () => {
    expect(Number.isFinite(readability('هذه جملة قصيرة للتجربة فقط').longWordRatio)).toBe(true);
  });
});
