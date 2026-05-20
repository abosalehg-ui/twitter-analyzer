// @ts-check

import { t, getLocale } from '../i18n/index.js';

/**
 * @typedef {import('../analysis/index.js').AnalysisResult} AnalysisResult
 */

/**
 * Build a plain-text report from analysis results.
 * @param {AnalysisResult} data
 * @returns {string}
 */
export function buildReport(data) {
  const topN = (counts, n) =>
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n);

  const formatLine = ([key, count]) => `- ${key}: ${count} ${t('report.times')}`;

  const hashtagsLines = topN(data.hashtags, 10).map(formatLine).join('\n') || `- ${t('report.noMentions').replace('- ', '')}`;
  const mentionsLines =
    Object.keys(data.mentions).length > 0
      ? topN(data.mentions, 10).map(formatLine).join('\n')
      : t('report.noMentions');
  const emojisLines =
    Object.keys(data.emojis).length > 0
      ? topN(data.emojis, 10).map(formatLine).join('\n')
      : t('report.noEmojis');
  const wordsLines = topN(data.words, 15).map(formatLine).join('\n');

  const locale = getLocale() === 'ar' ? 'ar-SA' : 'en-US';

  return `${t('report.title')}
========================

${t('report.generalStats')}
- ${t('report.totalTweets')}: ${data.totalTweets}
- ${t('report.totalWords')}: ${data.totalWords}
- ${t('report.avgLength')}: ${data.avgLength}
- ${t('report.hashtagCount')}: ${Object.keys(data.hashtags).length}
- ${t('report.mentionCount')}: ${Object.keys(data.mentions).length}
- ${t('report.emojiCount')}: ${Object.keys(data.emojis).length}

${t('report.sentiment')}
- ${t('sentiment.positive')}: ${data.sentimentScores.positive} ${t('report.tweets')}
- ${t('sentiment.neutral')}: ${data.sentimentScores.neutral} ${t('report.tweets')}
- ${t('sentiment.negative')}: ${data.sentimentScores.negative} ${t('report.tweets')}

${t('report.topHashtags')}
${hashtagsLines}

${t('report.topMentions')}
${mentionsLines}

${t('report.topEmojis')}
${emojisLines}

${t('report.topWords')}
${wordsLines}

${t('report.lengthDistribution')}
- ${t('report.short')}: ${data.lengths.short} ${t('report.tweets')}
- ${t('report.medium')}: ${data.lengths.medium} ${t('report.tweets')}
- ${t('report.long')}: ${data.lengths.long} ${t('report.tweets')}

${t('report.longestTweet')}
${data.longestTweet.text}
(${data.longestTweet.length} ${t('chars')})

${t('report.shortestTweet')}
${data.shortestTweet.text}
(${data.shortestTweet.length} ${t('chars')})

========================
${t('report.footer')}
${new Date().toLocaleString(locale)}
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
 * Export the full analysis as a TXT file.
 * @param {AnalysisResult} data
 */
export function exportTxt(data) {
  const content = buildReport(data);
  const filename = `${t('report.filename')}_${Date.now()}.txt`;
  downloadText(filename, content);
}
