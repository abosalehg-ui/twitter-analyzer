// @ts-check

import { el, replaceChildren } from './dom.js';
import { t } from '../i18n/index.js';

/**
 * @typedef {import('../analysis/index.js').AnalysisResult} AnalysisResult
 */

/**
 * Generate rule-based insights for the analysis result.
 * @param {AnalysisResult} data
 * @returns {string[]}
 */
export function buildInsights(data) {
  const insights = [];

  if (data.avgLength < 50) insights.push(t('insight.short'));
  else if (data.avgLength > 150) insights.push(t('insight.long'));

  if (Object.keys(data.hashtags).length > data.totalTweets * 0.5) {
    insights.push(t('insight.hashtags'));
  }

  if (Object.keys(data.emojis).length > 0) insights.push(t('insight.emojis'));

  const sentimentTotal =
    data.sentimentScores.positive + data.sentimentScores.neutral + data.sentimentScores.negative;
  if (sentimentTotal > 0 && data.sentimentScores.positive > sentimentTotal * 0.6) {
    insights.push(t('insight.positive'));
  }

  if (Object.keys(data.mentions).length > 0) insights.push(t('insight.mentions'));

  if (insights.length === 0) insights.push(t('insight.balanced'));

  return insights;
}

/**
 * Render insights into the insights list element.
 * @param {AnalysisResult} data
 */
export function renderInsights(data) {
  const container = /** @type {HTMLElement} */ (document.getElementById('insightsList'));
  const items = buildInsights(data).map((text) =>
    el('li', {}, [el('strong', {}, '💡 '), text])
  );
  replaceChildren(container, items);
}
