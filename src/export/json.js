// @ts-check

import { downloadText } from './txt.js';
import { t } from '../i18n/index.js';

/**
 * @typedef {import('../analysis/index.js').AnalysisResult} AnalysisResult
 */

/**
 * @param {AnalysisResult} data
 */
export function buildJson(data) {
  const payload = {
    generatedAt: new Date().toISOString(),
    version: 3,
    schema: 'single-tweet-analysis',
    analysis: data,
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * @param {AnalysisResult} data
 */
export function exportJson(data) {
  const filename = `${t('report.filename')}_${Date.now()}.json`;
  downloadText(filename, buildJson(data));
}
