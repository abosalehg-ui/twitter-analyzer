// @ts-check

import { downloadText } from './txt.js';
import { t } from '../i18n/index.js';

/**
 * @typedef {import('../analysis/index.js').AnalysisResult} AnalysisResult
 */

/**
 * Build a JSON string of the full analysis result with a metadata wrapper.
 * @param {AnalysisResult} data
 * @returns {string}
 */
export function buildJson(data) {
  const payload = {
    generatedAt: new Date().toISOString(),
    version: 1,
    analysis: data,
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Export the analysis as a JSON file.
 * @param {AnalysisResult} data
 */
export function exportJson(data) {
  const filename = `${t('report.filename')}_${Date.now()}.json`;
  downloadText(filename, buildJson(data));
}
