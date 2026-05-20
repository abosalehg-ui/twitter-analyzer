// @ts-check

import { el, replaceChildren, setText } from './dom.js';
import { t } from '../i18n/index.js';

/**
 * @typedef {import('../analysis/index.js').AnalysisResult} AnalysisResult
 */

/**
 * Render top stats cards.
 * @param {AnalysisResult} data
 */
export function renderStatCards(data) {
  setText(/** @type {HTMLElement} */ (document.getElementById('tweetCount')), String(data.totalTweets));
  setText(/** @type {HTMLElement} */ (document.getElementById('wordCount')), String(data.totalWords));
  setText(/** @type {HTMLElement} */ (document.getElementById('avgLength')), String(data.avgLength));
  setText(
    /** @type {HTMLElement} */ (document.getElementById('hashtagCount')),
    String(Object.keys(data.hashtags).length)
  );
  setText(
    /** @type {HTMLElement} */ (document.getElementById('mentionCount')),
    String(Object.keys(data.mentions).length)
  );
  setText(
    /** @type {HTMLElement} */ (document.getElementById('emojiCount')),
    String(Object.keys(data.emojis).length)
  );
}

/**
 * Render the sentiment bar.
 * @param {AnalysisResult['sentimentScores']} scores
 * @param {number} total
 */
export function renderSentiment(scores, total) {
  const pos = total > 0 ? Math.round((scores.positive / total) * 100) : 0;
  const neu = total > 0 ? Math.round((scores.neutral / total) * 100) : 0;
  const neg = total > 0 ? Math.round((scores.negative / total) * 100) : 0;

  const positiveEl = /** @type {HTMLElement} */ (document.getElementById('sentimentPositive'));
  const neutralEl = /** @type {HTMLElement} */ (document.getElementById('sentimentNeutral'));
  const negativeEl = /** @type {HTMLElement} */ (document.getElementById('sentimentNegative'));

  positiveEl.style.width = pos + '%';
  positiveEl.textContent = pos > 5 ? `${t('sentiment.positive')} ${pos}%` : '';

  neutralEl.style.width = neu + '%';
  neutralEl.textContent = neu > 5 ? `${t('sentiment.neutral')} ${neu}%` : '';

  negativeEl.style.width = neg + '%';
  negativeEl.textContent = neg > 5 ? `${t('sentiment.negative')} ${neg}%` : '';
}

/**
 * Generic count-list renderer for hashtags, mentions, emojis (any key → number map).
 * Replaces the three near-duplicate display functions in the original code.
 *
 * @param {HTMLElement} container
 * @param {Record<string, number>} counts
 * @param {{
 *   itemClass: string,
 *   keyClass: string,
 *   valueClass: string,
 *   emptyMessage: string,
 *   limit?: number,
 *   keyAsBlock?: boolean
 * }} opts
 */
export function renderCountList(container, counts, opts) {
  const { itemClass, keyClass, valueClass, emptyMessage, limit = 10, keyAsBlock = false } = opts;
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  if (sorted.length === 0) {
    replaceChildren(container, [el('p', { class: 'empty-message' }, emptyMessage)]);
    return;
  }

  const nodes = sorted.map(([key, count]) =>
    el('div', { class: itemClass }, [
      el(keyAsBlock ? 'div' : 'span', { class: keyClass }, key),
      el(keyAsBlock ? 'div' : 'span', { class: valueClass }, String(count)),
    ])
  );
  replaceChildren(container, nodes);
}

/**
 * Render word cloud with size proportional to count.
 * @param {Record<string, number>} words
 */
export function renderWordCloud(words) {
  const container = /** @type {HTMLElement} */ (document.getElementById('wordCloud'));
  const sorted = Object.entries(words)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25);

  if (sorted.length === 0) {
    replaceChildren(container, [el('p', { class: 'empty-message' }, t('empty.words'))]);
    return;
  }

  const nodes = sorted.map(([word, count]) => {
    const fontSize = Math.min(12 + count * 3, 28);
    return el(
      'span',
      { class: 'word-tag', style: { fontSize: `${fontSize}px` } },
      `${word} (${count})`
    );
  });
  replaceChildren(container, nodes);
}

/**
 * Render length-distribution bar chart.
 * @param {AnalysisResult['lengths']} lengths
 * @param {number} total
 */
export function renderLengthChart(lengths, total) {
  const container = /** @type {HTMLElement} */ (document.getElementById('lengthChart'));
  const data = [
    {
      label: t('length.short'),
      value: lengths.short,
      percent: total > 0 ? (lengths.short / total) * 100 : 0,
    },
    {
      label: t('length.medium'),
      value: lengths.medium,
      percent: total > 0 ? (lengths.medium / total) * 100 : 0,
    },
    {
      label: t('length.long'),
      value: lengths.long,
      percent: total > 0 ? (lengths.long / total) * 100 : 0,
    },
  ];

  const nodes = data.map((item) =>
    el('div', { class: 'bar-item' }, [
      el('div', { class: 'bar-label' }, item.label),
      el('div', { class: 'bar-fill', style: { width: `${item.percent}%` } }, [
        el('div', { class: 'bar-value' }, `${item.value} (${Math.round(item.percent)}%)`),
      ]),
    ])
  );
  replaceChildren(container, nodes);
}

/**
 * Render the longest/shortest tweets section.
 * @param {AnalysisResult['longestTweet']} longest
 * @param {AnalysisResult['shortestTweet']} shortest
 */
export function renderExtremes(longest, shortest) {
  const container = /** @type {HTMLElement} */ (document.getElementById('extremeTweets'));

  const preview = (labelText, ref) =>
    el('div', { class: 'tweet-preview' }, [
      el('span', { class: 'preview-label' }, labelText),
      el('div', { class: 'text' }, ref.text),
      el('div', { class: 'meta' }, `${ref.length} ${t('chars')}`),
    ]);

  replaceChildren(container, [
    preview(t('extremes.longest'), longest),
    preview(t('extremes.shortest'), shortest),
  ]);
}
