// @ts-check

import { downloadText } from './txt.js';
import { t } from '../i18n/index.js';

/**
 * @typedef {import('../analysis/index.js').AnalysisResult} AnalysisResult
 */

/**
 * Escape a single CSV field per RFC 4180.
 * @param {string | number} value
 * @returns {string}
 */
export function escapeCsvField(value) {
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Convert rows (array of arrays) to a CSV string.
 * @param {Array<Array<string | number>>} rows
 * @returns {string}
 */
function rowsToCsv(rows) {
  return rows.map((r) => r.map(escapeCsvField).join(',')).join('\n');
}

/**
 * Build a CSV report. Format: a header row identifying each section,
 * followed by key/value rows. Allows pivoting in spreadsheets.
 * @param {AnalysisResult} data
 * @returns {string}
 */
export function buildCsv(data) {
  /** @type {Array<Array<string | number>>} */
  const rows = [];

  rows.push(['section', 'key', 'value']);

  rows.push(['stats', t('report.totalTweets'), data.totalTweets]);
  rows.push(['stats', t('report.totalWords'), data.totalWords]);
  rows.push(['stats', t('report.avgLength'), data.avgLength]);
  rows.push(['stats', t('report.hashtagCount'), Object.keys(data.hashtags).length]);
  rows.push(['stats', t('report.mentionCount'), Object.keys(data.mentions).length]);
  rows.push(['stats', t('report.emojiCount'), Object.keys(data.emojis).length]);

  rows.push(['sentiment', t('sentiment.positive'), data.sentimentScores.positive]);
  rows.push(['sentiment', t('sentiment.neutral'), data.sentimentScores.neutral]);
  rows.push(['sentiment', t('sentiment.negative'), data.sentimentScores.negative]);

  rows.push(['length', t('length.short'), data.lengths.short]);
  rows.push(['length', t('length.medium'), data.lengths.medium]);
  rows.push(['length', t('length.long'), data.lengths.long]);

  const topN = (counts, n) =>
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n);

  for (const [tag, count] of topN(data.hashtags, 10)) rows.push(['hashtag', tag, count]);
  for (const [mention, count] of topN(data.mentions, 10)) rows.push(['mention', mention, count]);
  for (const [emoji, count] of topN(data.emojis, 10)) rows.push(['emoji', emoji, count]);
  for (const [word, count] of topN(data.words, 25)) rows.push(['word', word, count]);

  return rowsToCsv(rows);
}

/**
 * Export the analysis as a CSV file. Prepends UTF-8 BOM so Excel opens
 * Arabic text correctly.
 * @param {AnalysisResult} data
 */
export function exportCsv(data) {
  const filename = `${t('report.filename')}_${Date.now()}.csv`;
  const content = '﻿' + buildCsv(data);
  downloadText(filename, content);
}
