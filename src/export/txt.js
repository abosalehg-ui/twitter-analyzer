// @ts-check

import { t, getLocale } from '../i18n/index.js';

/**
 * @typedef {import('../analysis/index.js').AnalysisResult} AnalysisResult
 */

/**
 * Build a plain-text report for a single-tweet analysis.
 * @param {AnalysisResult} data
 * @returns {string}
 */
export function buildReport(data) {
  const locale = getLocale() === 'ar' ? 'ar-SA' : 'en-US';
  const signals = data.ai.signals
    .map((s) => `  - ${t('ai.signal.' + s.key)}: ${Math.round(s.raw * 100)}/100`)
    .join('\n');
  const positives = data.algorithm.positives
    .slice(0, 5)
    .map((c) => `  - ${t('action.' + c.action)}: ${(c.probability * 100).toFixed(0)}%`)
    .join('\n');
  const negatives = data.algorithm.negatives
    .slice(0, 5)
    .map((c) => `  - ${t('action.' + c.action)}: ${(c.probability * 100).toFixed(0)}%`)
    .join('\n');
  const recs = data.algorithm.recommendations.map((k) => `  - ${t(k)}`).join('\n');

  return `${t('app.title')}
========================

${t('composer.label')}
${data.text}

${t('overview.length')}: ${data.length} ${t('overview.chars')} | ${t('overview.words')}: ${data.wordCount}
${t('overview.hashtags')}: ${data.hashtags.length} | ${t('overview.mentions')}: ${data.mentions.length} | ${t('overview.emojis')}: ${data.emojis.length}
${t('overview.sentiment')}: ${t('sentiment.' + data.sentiment.label)}
${t('overview.tone')}: ${t('tone.' + data.tone.primary)}
${t('overview.readability')}: ${t('read.level.' + data.readability.level)} (${data.readability.score}/100)

${t('ai.title')}: ${data.ai.score}/100 — ${t('ai.confidence')}: ${t('ai.confidence.' + data.ai.confidence)}
${signals}

${t('algo.title')}: ${data.algorithm.score}/100 — ${t('algo.reach')}: ${t('algo.reach.' + data.algorithm.reach)}
${t('algo.positives')}:
${positives}
${t('algo.negatives')}:
${negatives}

${t('algo.recommendations')}:
${recs}

========================
${new Date(data.analyzedAt).toLocaleString(locale)}
`;
}

/**
 * Trigger a download of a text file with the given content.
 * @param {string} filename
 * @param {string} content
 */
export function downloadText(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * @param {AnalysisResult} data
 */
export function exportTxt(data) {
  const content = buildReport(data);
  const filename = `${t('report.filename')}_${Date.now()}.txt`;
  downloadText(filename, content);
}
