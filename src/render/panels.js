// @ts-check

import { el, replaceChildren } from './dom.js';
import { t } from '../i18n/index.js';

/**
 * @typedef {import('../analysis/index.js').AnalysisResult} AnalysisResult
 */

/** Generic gauge meter (semi-circular arc + number). */
function gaugeMeter(value, label, max = 100, color = '#cd7f32') {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 200 110');
  svg.setAttribute('class', 'gauge-svg');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `${label}: ${value}/${max}`);

  // background arc
  const bg = document.createElementNS(ns, 'path');
  bg.setAttribute('d', 'M 10 100 A 90 90 0 0 1 190 100');
  bg.setAttribute('fill', 'none');
  bg.setAttribute('stroke', '#3a3a3c');
  bg.setAttribute('stroke-width', '14');
  bg.setAttribute('stroke-linecap', 'round');
  svg.appendChild(bg);

  // foreground arc (pathLength=100 → stroke-dasharray uses percentage directly)
  const fg = document.createElementNS(ns, 'path');
  fg.setAttribute('d', 'M 10 100 A 90 90 0 0 1 190 100');
  fg.setAttribute('fill', 'none');
  fg.setAttribute('stroke', color);
  fg.setAttribute('stroke-width', '14');
  fg.setAttribute('stroke-linecap', 'round');
  fg.setAttribute('pathLength', '100');
  const ratio = Math.max(0, Math.min(1, value / max));
  fg.setAttribute('stroke-dasharray', `${ratio * 100} 100`);
  svg.appendChild(fg);

  const num = document.createElementNS(ns, 'text');
  num.setAttribute('x', '100');
  num.setAttribute('y', '85');
  num.setAttribute('text-anchor', 'middle');
  num.setAttribute('fill', '#f5f5f5');
  num.setAttribute('font-weight', '700');
  num.setAttribute('font-size', '32');
  num.textContent = String(value);
  svg.appendChild(num);

  return svg;
}

/** Tiny horizontal bar for a signal/contribution row. */
function rowBar(percent, color = '#cd7f32') {
  return el('div', { class: 'rowbar' }, [
    el('div', {
      class: 'rowbar-fill',
      style: { width: Math.max(0, Math.min(100, percent)) + '%', background: color },
    }),
  ]);
}

// ====================================================================
//  Overview
// ====================================================================

/** @param {HTMLElement} root @param {AnalysisResult} data */
export function renderOverview(root, data) {
  const cards = [
    [t('overview.length'), `${data.length} ${t('overview.chars')}`],
    [t('overview.words'), String(data.wordCount)],
    [t('overview.hashtags'), String(data.hashtags.length)],
    [t('overview.mentions'), String(data.mentions.length)],
    [t('overview.emojis'), String(data.emojis.length)],
    [t('overview.links'), String((data.text.match(/https?:\/\/\S+/g) || []).length)],
  ];

  const statGrid = el(
    'div',
    { class: 'stat-grid' },
    cards.map(([label, value]) =>
      el('div', { class: 'stat-card' }, [
        el('div', { class: 'stat-number' }, value),
        el('div', { class: 'stat-label' }, label),
      ])
    )
  );

  const summary = el('div', { class: 'overview-summary' }, [
    el('div', { class: 'pill pill-sentiment-' + data.sentiment.label }, [
      el('span', { class: 'pill-label' }, t('overview.sentiment') + ': '),
      el('strong', {}, t('sentiment.' + data.sentiment.label)),
    ]),
    el('div', { class: 'pill' }, [
      el('span', { class: 'pill-label' }, t('overview.tone') + ': '),
      el('strong', {}, t('tone.' + data.tone.primary)),
    ]),
    el('div', { class: 'pill' }, [
      el('span', { class: 'pill-label' }, t('overview.readability') + ': '),
      el('strong', {}, t('read.level.' + data.readability.level)),
    ]),
  ]);

  // Big-three score gauges
  const gauges = el('div', { class: 'gauges' }, [
    el('div', { class: 'gauge gauge-ai' }, [
      gaugeMeter(data.ai.score, t('ai.score'), 100, aiColor(data.ai.score)),
      el('div', { class: 'gauge-label' }, t('ai.score')),
    ]),
    el('div', { class: 'gauge gauge-algo' }, [
      gaugeMeter(data.algorithm.score, t('algo.score'), 100, algoColor(data.algorithm.score)),
      el('div', { class: 'gauge-label' }, t('algo.score')),
    ]),
    el('div', { class: 'gauge gauge-read' }, [
      gaugeMeter(data.readability.score, t('read.title'), 100, '#cd7f32'),
      el('div', { class: 'gauge-label' }, t('read.title')),
    ]),
  ]);

  replaceChildren(root, [gauges, statGrid, summary]);
}

function aiColor(score) {
  if (score >= 70) return '#cf222e';
  if (score >= 40) return '#9a6700';
  return '#2da44e';
}
function algoColor(score) {
  if (score >= 70) return '#2da44e';
  if (score >= 45) return '#cd7f32';
  return '#cf222e';
}

// ====================================================================
//  AI Detection panel
// ====================================================================

function aiVerdict(score) {
  if (score >= 70) return 'ai.verdict.ai';
  if (score >= 40) return 'ai.verdict.mixed';
  return 'ai.verdict.human';
}

/** @param {HTMLElement} root @param {AnalysisResult} data */
export function renderAi(root, data) {
  const ai = data.ai;
  const verdict = el('div', { class: 'verdict' }, [
    el('div', { class: 'gauge' }, [gaugeMeter(ai.score, t('ai.score'), 100, aiColor(ai.score))]),
    el('div', { class: 'verdict-text' }, [
      el('h3', {}, t(aiVerdict(ai.score))),
      el(
        'p',
        { class: 'verdict-confidence' },
        `${t('ai.confidence')}: ${t('ai.confidence.' + ai.confidence)}`
      ),
    ]),
  ]);

  const signalRows = ai.signals.map((s) =>
    el('div', { class: 'signal-row' }, [
      el('div', { class: 'signal-label' }, t('ai.signal.' + s.key)),
      rowBar(s.raw * 100, aiColor(s.raw * 100)),
      el('div', { class: 'signal-value' }, `${Math.round(s.raw * 100)}/100`),
    ])
  );

  /** @type {Array<HTMLElement>} */
  const matchedChunks = [];
  if (ai.matchedCliches.length > 0) {
    matchedChunks.push(
      el('div', { class: 'matched-row' }, [
        el('strong', {}, t('ai.matchedCliches')),
        ' ',
        ...ai.matchedCliches.slice(0, 8).map((m) => el('span', { class: 'chip chip-warn' }, m)),
      ])
    );
  }
  if (ai.matchedHumanSignals.length > 0) {
    matchedChunks.push(
      el('div', { class: 'matched-row' }, [
        el('strong', {}, t('ai.matchedHumanSignals')),
        ' ',
        ...ai.matchedHumanSignals.slice(0, 8).map((m) => el('span', { class: 'chip chip-ok' }, m)),
      ])
    );
  }

  replaceChildren(root, [
    verdict,
    el('h3', { class: 'panel-sub' }, t('ai.signals')),
    el('div', { class: 'signal-list' }, signalRows),
    ...matchedChunks,
    el('p', { class: 'disclaimer' }, t('ai.disclaimer')),
  ]);
}

// ====================================================================
//  Algorithm panel
// ====================================================================

/** @param {HTMLElement} root @param {AnalysisResult} data */
export function renderAlgorithm(root, data) {
  const a = data.algorithm;

  const header = el('div', { class: 'verdict' }, [
    el('div', { class: 'gauge' }, [gaugeMeter(a.score, t('algo.score'), 100, algoColor(a.score))]),
    el('div', { class: 'verdict-text' }, [
      el('h3', {}, `${t('algo.reach')}: ${t('algo.reach.' + a.reach)}`),
      el('p', { class: 'verdict-confidence' }, t('algo.modelNote')),
    ]),
  ]);

  const recList = el(
    'ul',
    { class: 'rec-list' },
    a.recommendations.map((key) => el('li', {}, t(key)))
  );

  // Show top 5 positives and worst 3 negatives by abs contribution
  const positivesEl = el('div', { class: 'algo-block' }, [
    el('h4', {}, t('algo.positives')),
    ...a.positives
      .slice(0, 5)
      .map((c) =>
        el('div', { class: 'signal-row' }, [
          el('div', { class: 'signal-label' }, t('action.' + c.action)),
          rowBar(c.probability * 100, '#2da44e'),
          el('div', { class: 'signal-value' }, `${(c.probability * 100).toFixed(0)}%`),
        ])
      ),
  ]);

  const negativesEl = el('div', { class: 'algo-block' }, [
    el('h4', {}, t('algo.negatives')),
    ...a.negatives
      .slice(0, 3)
      .map((c) =>
        el('div', { class: 'signal-row' }, [
          el('div', { class: 'signal-label' }, t('action.' + c.action)),
          rowBar(c.probability * 100, '#cf222e'),
          el('div', { class: 'signal-value' }, `${(c.probability * 100).toFixed(0)}%`),
        ])
      ),
  ]);

  replaceChildren(root, [
    header,
    el('div', { class: 'algo-cols' }, [positivesEl, negativesEl]),
    el('h3', { class: 'panel-sub' }, t('algo.recommendations')),
    recList,
  ]);
}

// ====================================================================
//  Engagement panel — full 15 actions
// ====================================================================

/** @param {HTMLElement} root @param {AnalysisResult} data */
export function renderEngagement(root, data) {
  const positives = data.algorithm.positives;
  const negatives = data.algorithm.negatives;

  const buildRows = (items, color) =>
    items.map((c) =>
      el('div', { class: 'signal-row' }, [
        el('div', { class: 'signal-label' }, t('action.' + c.action)),
        rowBar(c.probability * 100, color),
        el('div', { class: 'signal-value' }, `${(c.probability * 100).toFixed(0)}%`),
      ])
    );

  replaceChildren(root, [
    el('p', { class: 'panel-subtitle' }, t('engagement.subtitle')),
    el('h4', {}, t('engagement.positiveActions')),
    el('div', { class: 'signal-list' }, buildRows(positives, '#2da44e')),
    el('h4', {}, t('engagement.negativeActions')),
    el('div', { class: 'signal-list' }, buildRows(negatives, '#cf222e')),
  ]);
}

// ====================================================================
//  Optimizer panel
// ====================================================================

/**
 * @param {HTMLElement} root
 * @param {AnalysisResult} data
 * @param {import('../optimizer/rewrite-suggestions.js').RewriteSuggestion[]} suggestions
 * @param {(text: string) => void} onApply
 */
export function renderOptimizer(root, data, suggestions, onApply) {
  if (suggestions.length === 0) {
    replaceChildren(root, [el('p', { class: 'empty-message' }, t('optimizer.empty'))]);
    return;
  }

  const cards = suggestions.map((s) => {
    const deltaSign = s.delta > 0 ? '+' : '';
    const deltaClass =
      s.delta > 0 ? 'delta delta-up' : s.delta < 0 ? 'delta delta-down' : 'delta delta-zero';

    return el('article', { class: 'optimizer-card' }, [
      el('div', { class: 'optimizer-card-head' }, [
        el('strong', {}, t(s.explainKey)),
        el('div', { class: 'optimizer-scores' }, [
          el(
            'span',
            { class: 'predicted-score' },
            `${t('optimizer.predictedScore')}: ${s.predictedScore}/100`
          ),
          el('span', { class: deltaClass }, `${deltaSign}${s.delta}`),
        ]),
      ]),
      el('blockquote', { class: 'optimizer-text' }, s.text),
      el(
        'button',
        {
          type: 'button',
          class: 'btn btn-secondary btn-apply',
          onclick: () => onApply(s.text),
        },
        t('btn.apply')
      ),
    ]);
  });

  replaceChildren(root, [el('p', { class: 'panel-subtitle' }, t('optimizer.subtitle')), ...cards]);
}

// ====================================================================
//  Weakness panel — checklist
// ====================================================================

/** @param {HTMLElement} root @param {AnalysisResult} data */
export function renderWeakness(root, data) {
  const f = data.algorithm.features;
  /** @type {Array<{ key: string, ok: boolean }>} */
  const checks = [
    { key: 'weakness.hasQuestion', ok: f.hasQuestion },
    { key: 'weakness.noExternalLinks', ok: f.linkCount === 0 || f.hasMediaUrl },
    { key: 'weakness.goodLength', ok: f.isInBaitSweetspot },
    { key: 'weakness.fewHashtags', ok: f.hashtagCount <= 2 },
    { key: 'weakness.noBait', ok: f.baitHits === 0 },
    { key: 'weakness.noToxicity', ok: f.toxicityHits === 0 },
    { key: 'weakness.noSpam', ok: f.spamHits === 0 },
    { key: 'weakness.hasEmoji', ok: f.emojiCount > 0 },
    { key: 'weakness.notAllCaps', ok: f.allCapsWords < 3 },
    { key: 'weakness.positiveSentiment', ok: f.sentiment !== 'negative' },
  ];

  const items = checks.map((c) =>
    el('li', { class: c.ok ? 'check ok' : 'check fail' }, [
      el('span', { class: 'check-icon' }, c.ok ? '✅' : '❌'),
      el('span', { class: 'check-label' }, t(c.key)),
    ])
  );

  replaceChildren(root, [
    el('p', { class: 'panel-subtitle' }, t('weakness.subtitle')),
    el('ul', { class: 'check-list' }, items),
  ]);
}

// ====================================================================
//  Tone panel — primary + best time
// ====================================================================

/** @param {HTMLElement} root @param {AnalysisResult} data */
export function renderTone(root, data) {
  const primary = data.tone.primary;
  const breakdown = data.tone.scores.filter((s) => s.hits > 0);

  const chips = breakdown.map((s) =>
    el('span', { class: 'chip chip-' + s.tone }, [
      el('strong', {}, t('tone.' + s.tone)),
      ' ',
      el('span', {}, '× ' + s.hits),
    ])
  );

  replaceChildren(root, [
    el('div', { class: 'tone-headline' }, [
      el('div', { class: 'tone-primary' }, t('tone.' + primary)),
      el('div', { class: 'tone-time' }, t('tone.bestTime.' + primary)),
    ]),
    chips.length > 0
      ? el('div', { class: 'chip-row' }, chips)
      : el('p', { class: 'empty-message' }, '—'),
    el('div', { class: 'readability-grid' }, [
      el('div', { class: 'kv' }, [
        el('span', {}, t('read.avgWord')),
        el('strong', {}, String(data.readability.avgWordLength)),
      ]),
      el('div', { class: 'kv' }, [
        el('span', {}, t('read.avgSentence')),
        el('strong', {}, String(data.readability.avgSentenceLength)),
      ]),
      el('div', { class: 'kv' }, [
        el('span', {}, t('read.longRatio')),
        el('strong', {}, `${Math.round(data.readability.longRatio * 100)}%`),
      ]),
    ]),
  ]);
}

// ====================================================================
//  Details panel
// ====================================================================

/** @param {HTMLElement} root @param {AnalysisResult} data */
export function renderDetails(root, data) {
  const block = (titleKey, items, emptyKey) => {
    const content =
      items.length === 0
        ? [el('p', { class: 'empty-message' }, t(emptyKey))]
        : [
            el(
              'div',
              { class: 'chip-row' },
              items.map((k) => el('span', { class: 'chip' }, k))
            ),
          ];
    return el('section', { class: 'details-block' }, [el('h4', {}, t(titleKey)), ...content]);
  };

  replaceChildren(root, [
    block('details.keywords', data.keywords, 'details.none'),
    block('details.hashtags', data.hashtags, 'details.none'),
    block('details.mentions', data.mentions, 'details.none'),
    block('details.emojis', data.emojis, 'details.none'),
  ]);
}
