// @ts-check

import { analyze, parseTweets } from './analysis/index.js';
import { renderStatCards, renderSentiment, renderCountList, renderWordCloud, renderLengthChart, renderExtremes } from './render/sections.js';
import { renderInsights } from './render/insights.js';
import { exportTxt } from './export/txt.js';
import { t } from './i18n/index.js';

/** @type {import('./analysis/index.js').AnalysisResult | null} */
let analysisData = null;

const $ = (id) => /** @type {HTMLElement} */ (document.getElementById(id));

/**
 * Display a status message to the user (replaces alert()).
 * @param {string} message
 * @param {'error' | 'success'} kind
 */
function showStatus(message, kind) {
  const status = $('status');
  status.textContent = message;
  status.classList.remove('error', 'success');
  status.classList.add(kind, 'show');
  if (kind === 'success') {
    setTimeout(() => status.classList.remove('show'), 4000);
  }
}

function clearStatus() {
  const status = $('status');
  status.classList.remove('show', 'error', 'success');
  status.textContent = '';
}

function runAnalysis() {
  clearStatus();
  const input = /** @type {HTMLTextAreaElement} */ ($('tweets')).value.trim();

  if (!input) {
    showStatus(t('error.empty'), 'error');
    return;
  }

  const tweets = parseTweets(input);
  if (tweets.length === 0) {
    showStatus(t('error.invalid'), 'error');
    return;
  }

  analysisData = analyze(tweets);

  renderStatCards(analysisData);
  renderSentiment(analysisData.sentimentScores, analysisData.totalTweets);
  renderInsights(analysisData);
  renderCountList($('hashtagList'), analysisData.hashtags, {
    itemClass: 'hashtag-item',
    keyClass: 'tag',
    valueClass: 'count',
    emptyMessage: t('empty.hashtags'),
  });
  renderCountList($('mentionList'), analysisData.mentions, {
    itemClass: 'mention-item',
    keyClass: 'tag',
    valueClass: 'count',
    emptyMessage: t('empty.mentions'),
  });
  renderCountList($('emojiStats'), analysisData.emojis, {
    itemClass: 'emoji-item',
    keyClass: 'emoji',
    valueClass: 'count',
    emptyMessage: t('empty.emojis'),
    keyAsBlock: true,
  });
  renderWordCloud(analysisData.words);
  renderLengthChart(analysisData.lengths, analysisData.totalTweets);
  renderExtremes(analysisData.longestTweet, analysisData.shortestTweet);

  const results = $('results');
  results.classList.add('show');

  if (typeof results.scrollIntoView === 'function') {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    results.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }
}

function runExport() {
  if (!analysisData) {
    showStatus(t('error.noAnalysis'), 'error');
    return;
  }
  exportTxt(analysisData);
  showStatus(t('success.export'), 'success');
}

export function init() {
  analysisData = null;
  $('analyzeBtn').addEventListener('click', runAnalysis);
  $('exportBtn').addEventListener('click', runExport);
}

if (typeof window !== 'undefined' && !window.__TWITTER_ANALYZER_TEST__) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
