// @ts-check

import { downloadText } from './txt.js';
import { t } from '../i18n/index.js';

/**
 * @typedef {import('../analysis/index.js').AnalysisResult} AnalysisResult
 */

/**
 * Escape a single CSV field per RFC 4180, and neutralize spreadsheet formulas.
 *
 * Excel / Sheets / LibreOffice execute a cell that starts with = + - @ (or a tab /
 * CR) as a formula, so a tweet like `=HYPERLINK(...)` would run when the exported
 * file is opened. Prefixing a single quote makes it a literal string (OWASP
 * "CSV Injection"). Numbers are left alone so negative scores stay numeric.
 *
 * @param {string | number} value
 */
export function escapeCsvField(value) {
  let str = String(value);
  if (typeof value === 'string' && /^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * @param {Array<Array<string | number>>} rows
 */
function rowsToCsv(rows) {
  return rows.map((r) => r.map(escapeCsvField).join(',')).join('\n');
}

/**
 * Build a CSV report from a single-tweet analysis.
 * @param {AnalysisResult} data
 */
export function buildCsv(data) {
  /** @type {Array<Array<string | number>>} */
  const rows = [['section', 'key', 'value']];

  rows.push(['tweet', 'text', data.text]);
  rows.push(['tweet', 'length', data.length]);
  rows.push(['tweet', 'words', data.wordCount]);
  rows.push(['tweet', 'hashtags', data.hashtags.length]);
  rows.push(['tweet', 'mentions', data.mentions.length]);
  rows.push(['tweet', 'emojis', data.emojis.length]);

  rows.push(['sentiment', 'label', t('sentiment.' + data.sentiment.label)]);
  rows.push(['sentiment', 'score', data.sentiment.score]);

  rows.push(['ai', 'score', data.ai.score]);
  rows.push(['ai', 'confidence', data.ai.confidence]);
  for (const s of data.ai.signals) {
    rows.push(['ai_signal', s.key, s.raw]);
  }

  rows.push(['algorithm', 'score', data.algorithm.score]);
  rows.push(['algorithm', 'reach', data.algorithm.reach]);
  rows.push(['algorithm', 'raw_score', data.algorithm.rawScore]);
  for (const c of data.algorithm.contributions) {
    rows.push([`p_${c.action}`, 'probability', c.probability.toFixed(4)]);
  }

  rows.push(['readability', 'score', data.readability.score]);
  rows.push(['readability', 'level', data.readability.level]);
  rows.push(['tone', 'primary', data.tone.primary]);

  for (const k of data.keywords) rows.push(['keyword', k, 1]);
  for (const h of data.hashtags) rows.push(['hashtag', h, 1]);
  for (const m of data.mentions) rows.push(['mention', m, 1]);
  for (const e of data.emojis) rows.push(['emoji', e, 1]);

  return rowsToCsv(rows);
}

/**
 * @param {AnalysisResult} data
 */
export function exportCsv(data) {
  const filename = `${t('report.filename')}_${Date.now()}.csv`;
  const content = '﻿' + buildCsv(data);
  downloadText(filename, content, 'text/csv');
}
