// @ts-check

import { el, replaceChildren } from './dom.js';
import { t } from '../i18n/index.js';

/**
 * Render the history list.
 * @param {HTMLElement} root
 * @param {import('../storage/history.js').HistoryEntry[]} entries
 * @param {{
 *   onLoad: (id: string) => void,
 *   onCompare: (id: string) => void,
 *   onDelete: (id: string) => void,
 *   onClearAll: () => void
 * }} handlers
 */
export function renderHistory(root, entries, handlers) {
  if (entries.length === 0) {
    replaceChildren(root, [
      el('p', { class: 'empty-message' }, t('history.empty')),
    ]);
    return;
  }

  const items = entries.map((e) => {
    const preview = e.text.length > 80 ? e.text.slice(0, 80) + '…' : e.text;
    return el('article', { class: 'history-item' }, [
      el('div', { class: 'history-text' }, preview),
      el('div', { class: 'history-meta' }, [
        el('span', { class: 'history-chip ai' }, `🤖 ${e.aiScore}`),
        el('span', { class: 'history-chip algo' }, `🐦 ${e.algorithmScore}`),
        el('span', { class: 'history-chip tone' }, t('tone.' + e.primaryTone)),
        el('span', { class: 'history-chip' }, `${e.length} ${t('overview.chars')}`),
      ]),
      el('div', { class: 'history-actions' }, [
        el('button', { type: 'button', class: 'btn btn-secondary btn-xs', onclick: () => handlers.onLoad(e.id) }, t('history.load')),
        el('button', { type: 'button', class: 'btn btn-secondary btn-xs', onclick: () => handlers.onCompare(e.id) }, t('history.compareWithCurrent')),
        el('button', { type: 'button', class: 'btn-icon', 'aria-label': 'delete', onclick: () => handlers.onDelete(e.id) }, t('btn.delete')),
      ]),
    ]);
  });

  const clearBtn = el(
    'button',
    {
      type: 'button',
      class: 'btn btn-secondary btn-sm',
      onclick: () => handlers.onClearAll(),
    },
    t('btn.clearHistory')
  );

  replaceChildren(root, [el('div', { class: 'history-toolbar' }, [clearBtn]), ...items]);
}
