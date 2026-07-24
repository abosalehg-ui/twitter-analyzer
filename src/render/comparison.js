// @ts-check

import { el, replaceChildren } from './dom.js';
import { t } from '../i18n/index.js';

/**
 * @typedef {import('../analysis/index.js').AnalysisResult} AnalysisResult
 */

/**
 * Render an A/B side-by-side summary card.
 * @param {HTMLElement} root
 * @param {AnalysisResult} a
 * @param {AnalysisResult} b
 */
export function renderComparison(root, a, b) {
  const cmp = (labelKey, va, vb, betterIsHigher = true) => {
    const aBetter = betterIsHigher ? va >= vb : va <= vb;
    return el('tr', {}, [
      el('th', { scope: 'row' }, t(labelKey)),
      el('td', { class: aBetter && va !== vb ? 'win' : '' }, String(va)),
      el('td', { class: !aBetter && va !== vb ? 'win' : '' }, String(vb)),
    ]);
  };

  let verdict = t('compare.tie');
  if (a.algorithm.score > b.algorithm.score)
    verdict = t('compare.winner') + ': ' + t('compare.tweetA');
  else if (b.algorithm.score > a.algorithm.score)
    verdict = t('compare.winner') + ': ' + t('compare.tweetB');

  const previewA = el('blockquote', { class: 'cmp-preview' }, a.text);
  const previewB = el('blockquote', { class: 'cmp-preview' }, b.text);

  const table = el('table', { class: 'cmp-table' }, [
    el('thead', {}, [
      el('tr', {}, [
        el('th', {}, ''),
        el('th', {}, t('compare.tweetA')),
        el('th', {}, t('compare.tweetB')),
      ]),
    ]),
    el('tbody', {}, [
      cmp('algo.score', a.algorithm.score, b.algorithm.score, true),
      cmp('ai.score', a.ai.score, b.ai.score, false),
      cmp('read.title', a.readability.score, b.readability.score, true),
      cmp('overview.length', a.length, b.length, true),
    ]),
  ]);

  replaceChildren(root, [
    el('h3', {}, t('compare.title')),
    el('div', { class: 'cmp-verdict' }, verdict),
    el('div', { class: 'cmp-grid' }, [
      el('div', {}, [el('h4', {}, t('compare.tweetA')), previewA]),
      el('div', {}, [el('h4', {}, t('compare.tweetB')), previewB]),
    ]),
    table,
  ]);
}
