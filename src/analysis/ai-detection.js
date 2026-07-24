// @ts-check

import { normalizeArabic } from './tokenize.js';
import { extractEmojis } from './extractors.js';
import { AI_CLICHE_PHRASES, HUMAN_SIGNALS, AI_PUNCTUATION } from '../data/ai-cliches.js';

/**
 * @typedef {Object} SignalResult
 * @property {string} key
 * @property {number} raw       Raw value 0..1 (higher = more AI-like)
 * @property {number} weight    Weight (sum of all weights = 1)
 * @property {number} contribution  raw * weight * 100
 *
 * @typedef {Object} AiDetectionResult
 * @property {number} score                  Final 0..100 score (AI likelihood)
 * @property {'low'|'medium'|'high'} confidence
 * @property {SignalResult[]} signals
 * @property {string[]} matchedCliches       Cliche phrases found (for UI display)
 * @property {string[]} matchedHumanSignals  Human signals found (for UI display)
 */

const SIGNAL_WEIGHTS = {
  burstiness: 0.18,
  lexical_diversity: 0.14,
  formality: 0.12,
  punctuation_perfection: 0.12,
  cliches: 0.15,
  emoji_density: 0.08,
  typo_absence: 0.08,
  hashtag_pattern: 0.07,
  sentence_starters: 0.06,
};

/**
 * Lowercase + normalize Arabic for matching.
 * @param {string} text
 */
function normForMatch(text) {
  return normalizeArabic(text).toLowerCase();
}

/**
 * Split text into sentences (rough — splits on . ! ? ؟ ! ، newlines).
 * @param {string} text
 * @returns {string[]}
 */
function splitSentences(text) {
  return text
    .split(/[.!?؟\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Burstiness: coefficient of variation of sentence lengths.
 * LLMs produce more uniform sentence lengths (low CV); humans are bursty (high CV).
 * Inverted to 0..1 where 1 = very AI-like (uniform).
 * @param {string} text
 */
export function burstinessSignal(text) {
  const sentences = splitSentences(text);
  if (sentences.length < 2) return 0.5; // not enough to judge
  const lengths = sentences.map((s) => s.length);
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  if (mean === 0) return 0.5;
  const variance = lengths.reduce((acc, x) => acc + (x - mean) ** 2, 0) / lengths.length;
  const std = Math.sqrt(variance);
  const cv = std / mean; // coefficient of variation
  // Map: cv < 0.15 → very AI-like (1.0); cv > 0.8 → very human (0.0)
  if (cv <= 0.15) return 1;
  if (cv >= 0.8) return 0;
  return 1 - (cv - 0.15) / (0.8 - 0.15);
}

/**
 * Lexical diversity (Type-Token Ratio). Unnaturally high for the text length
 * suggests AI. We compare TTR against an expected band based on token count.
 * @param {string} text
 */
export function lexicalDiversitySignal(text) {
  const tokens = normForMatch(text)
    .replace(/https?:\/\/\S+/g, ' ')
    .match(/[\p{L}]+/gu);
  if (!tokens || tokens.length < 5) return 0.5;
  const ttr = new Set(tokens).size / tokens.length;
  // Humans on short tweets typically: 0.7–0.95. LLMs often >0.95 even on short text
  // OR very low when repeating template patterns. Both extremes lean AI.
  if (ttr >= 0.97) return 0.9;
  if (ttr >= 0.92) return 0.7;
  if (ttr >= 0.85) return 0.45;
  if (ttr >= 0.7) return 0.3;
  return 0.5;
}

/**
 * Formality: ratio of long words (>=7 chars) vs total words.
 * LLM tweets tend to be more formal than the platform average.
 * @param {string} text
 */
export function formalitySignal(text) {
  const tokens = normForMatch(text)
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/#[\p{L}\d_]+/gu, ' ')
    .replace(/@[\p{L}\d_]+/gu, ' ')
    .match(/[\p{L}]+/gu);
  if (!tokens || tokens.length < 3) return 0.5;
  const longWords = tokens.filter((t) => t.length >= 7).length;
  const ratio = longWords / tokens.length;
  // Map: ratio >= 0.5 → high formality (0.9); ratio <= 0.1 → casual (0.1)
  return Math.max(0, Math.min(1, (ratio - 0.1) / 0.4));
}

/**
 * Punctuation perfection: presence of em-dash, fancy quotes, semicolons.
 * @param {string} text
 */
export function punctuationSignal(text) {
  let hits = 0;
  for (const punct of AI_PUNCTUATION) {
    if (text.includes(punct)) hits++;
  }
  // Each hit adds ~0.25, capped at 1.
  return Math.min(1, hits * 0.25);
}

/**
 * Cliché-phrase match. Returns 0..1 and the list of matches.
 * @param {string} text
 * @returns {{ score: number, matches: string[] }}
 */
export function clicheSignal(text) {
  const norm = normForMatch(text);
  /** @type {string[]} */
  const matches = [];
  for (const phrase of [...AI_CLICHE_PHRASES.ar, ...AI_CLICHE_PHRASES.en]) {
    if (norm.includes(normForMatch(phrase))) matches.push(phrase);
  }
  // 1 match = 0.55; 2 = 0.8; 3+ = 1.0
  const score =
    matches.length === 0 ? 0 : matches.length === 1 ? 0.55 : matches.length === 2 ? 0.8 : 1;
  return { score, matches };
}

/**
 * Emoji density. LLMs typically use 0 or 1 generic emoji; humans use more, often clustered.
 * Returns a score where MISSING emojis on a long text → AI-like.
 * @param {string} text
 */
export function emojiDensitySignal(text) {
  const emojis = extractEmojis(text);
  const wordCount = (text.match(/\S+/g) || []).length;
  if (wordCount === 0) return 0.5;
  const density = emojis.length / wordCount;
  // 0 emojis on a >10-word tweet → AI-like (0.8)
  if (emojis.length === 0) return wordCount > 10 ? 0.8 : 0.5;
  if (density >= 0.15) return 0.1; // lots of emojis → very human
  if (density >= 0.05) return 0.3;
  return 0.55;
}

/**
 * Typo / casual-word absence. Presence of LOL/يلا/etc. → human.
 * @param {string} text
 * @returns {{ score: number, matches: string[] }}
 */
export function typoSignal(text) {
  const norm = normForMatch(text);
  /** @type {string[]} */
  const matches = [];
  for (const word of [...HUMAN_SIGNALS.ar, ...HUMAN_SIGNALS.en]) {
    // word-boundary-ish match
    const re = new RegExp(`(^|\\s)${escapeRegex(normForMatch(word))}(\\s|$|[.!?؟،])`);
    if (re.test(norm)) matches.push(word);
  }
  // matches present → very human → low AI score
  const score = matches.length === 0 ? 0.65 : matches.length === 1 ? 0.25 : 0.05;
  return { score, matches };
}

/**
 * Hashtag pattern: LLMs cluster hashtags at end with formal spacing;
 * humans often inline them or use 0–2 organically.
 * @param {string} text
 */
export function hashtagPatternSignal(text) {
  const hashtags = text.match(/#[\p{L}\d_]+/gu) || [];
  if (hashtags.length === 0) return 0.4;
  if (hashtags.length >= 4) return 0.85;
  // Detect "all hashtags clustered at end" — split last N chars
  const lastQuarter = text.slice(Math.floor(text.length * 0.7));
  const clusteredCount = (lastQuarter.match(/#[\p{L}\d_]+/gu) || []).length;
  if (clusteredCount === hashtags.length && hashtags.length >= 3) return 0.75;
  return 0.4;
}

/**
 * Sentence starter variety. LLMs over-use specific openers.
 * @param {string} text
 */
export function sentenceStartersSignal(text) {
  const sentences = splitSentences(text);
  if (sentences.length < 2) return 0.5;
  const aiStarters = ['in ', 'as ', 'while ', 'with ', 'the ', 'إن ', 'مع ', 'من ', 'في '];
  let aiStartCount = 0;
  for (const s of sentences) {
    const lower = s.toLowerCase();
    if (aiStarters.some((st) => lower.startsWith(st))) aiStartCount++;
  }
  const ratio = aiStartCount / sentences.length;
  return Math.min(1, ratio);
}

/**
 * Escape regex metacharacters in a literal string.
 * @param {string} s
 */
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Full AI-detection pipeline.
 * @param {string} text
 * @returns {AiDetectionResult}
 */
export function detectAi(text) {
  const burst = burstinessSignal(text);
  const lex = lexicalDiversitySignal(text);
  const form = formalitySignal(text);
  const punct = punctuationSignal(text);
  const cliche = clicheSignal(text);
  const emoji = emojiDensitySignal(text);
  const typo = typoSignal(text);
  const hash = hashtagPatternSignal(text);
  const starts = sentenceStartersSignal(text);

  /** @type {SignalResult[]} */
  const signals = [
    { key: 'burstiness', raw: burst, weight: SIGNAL_WEIGHTS.burstiness, contribution: 0 },
    {
      key: 'lexical_diversity',
      raw: lex,
      weight: SIGNAL_WEIGHTS.lexical_diversity,
      contribution: 0,
    },
    { key: 'formality', raw: form, weight: SIGNAL_WEIGHTS.formality, contribution: 0 },
    {
      key: 'punctuation_perfection',
      raw: punct,
      weight: SIGNAL_WEIGHTS.punctuation_perfection,
      contribution: 0,
    },
    { key: 'cliches', raw: cliche.score, weight: SIGNAL_WEIGHTS.cliches, contribution: 0 },
    { key: 'emoji_density', raw: emoji, weight: SIGNAL_WEIGHTS.emoji_density, contribution: 0 },
    { key: 'typo_absence', raw: typo.score, weight: SIGNAL_WEIGHTS.typo_absence, contribution: 0 },
    { key: 'hashtag_pattern', raw: hash, weight: SIGNAL_WEIGHTS.hashtag_pattern, contribution: 0 },
    {
      key: 'sentence_starters',
      raw: starts,
      weight: SIGNAL_WEIGHTS.sentence_starters,
      contribution: 0,
    },
  ];

  let total = 0;
  for (const s of signals) {
    s.contribution = Math.round(s.raw * s.weight * 100 * 10) / 10;
    total += s.raw * s.weight;
  }
  const score = Math.round(total * 100);

  // Confidence based on text length
  const chars = text.trim().length;
  /** @type {'low'|'medium'|'high'} */
  let confidence = 'high';
  if (chars < 40) confidence = 'low';
  else if (chars < 100) confidence = 'medium';

  return {
    score,
    confidence,
    signals,
    matchedCliches: cliche.matches,
    matchedHumanSignals: typo.matches,
  };
}
