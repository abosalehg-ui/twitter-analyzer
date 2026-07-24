// @ts-check

import { el } from './dom.js';
import { t } from '../i18n/index.js';

const TAB_KEYS = [
  'overview',
  'ai',
  'algorithm',
  'engagement',
  'optimizer',
  'weakness',
  'tone',
  'details',
];

/**
 * Build tab navigation. Returns { nav, panels, setActive(key) }.
 * Each panel is a <section data-tab="key"> that callers fill with content.
 * @returns {{ nav: HTMLElement, panels: HTMLElement, setActive: (key: string) => void, panelOf: (key: string) => HTMLElement }}
 */
export function buildTabs() {
  /** @type {Record<string, HTMLButtonElement>} */
  const buttons = {};
  /** @type {Record<string, HTMLElement>} */
  const panelMap = {};

  const navEl = el('nav', { class: 'tabs', role: 'tablist', 'aria-label': t('aria.tabs') });
  const panelsEl = el('div', { class: 'tab-panels' });

  for (const key of TAB_KEYS) {
    const btn = /** @type {HTMLButtonElement} */ (
      el(
        'button',
        {
          type: 'button',
          role: 'tab',
          class: 'tab-btn',
          'aria-selected': 'false',
          'data-tab': key,
          tabindex: '-1',
        },
        t('tab.' + key)
      )
    );
    buttons[key] = btn;
    navEl.appendChild(btn);

    const panel = el('section', {
      class: 'tab-panel',
      role: 'tabpanel',
      hidden: 'hidden',
      'data-tab': key,
    });
    panelMap[key] = panel;
    panelsEl.appendChild(panel);
  }

  function setActive(key) {
    for (const k of TAB_KEYS) {
      const isActive = k === key;
      buttons[k].classList.toggle('active', isActive);
      buttons[k].setAttribute('aria-selected', String(isActive));
      buttons[k].setAttribute('tabindex', isActive ? '0' : '-1');
      if (isActive) panelMap[k].removeAttribute('hidden');
      else panelMap[k].setAttribute('hidden', 'hidden');
    }
  }

  navEl.addEventListener('click', (e) => {
    const target = /** @type {HTMLElement} */ (e.target);
    const btn = target.closest('.tab-btn');
    if (!btn) return;
    const key = btn.getAttribute('data-tab');
    if (key) setActive(key);
  });

  navEl.addEventListener('keydown', (e) => {
    const ke = /** @type {KeyboardEvent} */ (e);
    if (ke.key !== 'ArrowRight' && ke.key !== 'ArrowLeft') return;
    const active = navEl.querySelector('.tab-btn.active');
    if (!active) return;
    const idx = TAB_KEYS.indexOf(active.getAttribute('data-tab') ?? '');
    // Tabs are laid out in writing order, so under RTL the visually-next tab is
    // to the LEFT. Flip the arrow mapping so the key always moves the direction
    // the user sees, not the direction of the DOM order.
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    const forward = isRtl ? ke.key === 'ArrowLeft' : ke.key === 'ArrowRight';
    const dir = forward ? 1 : -1;
    const next = TAB_KEYS[(idx + dir + TAB_KEYS.length) % TAB_KEYS.length];
    setActive(next);
    buttons[next].focus();
  });

  setActive('overview');

  return {
    nav: navEl,
    panels: panelsEl,
    setActive,
    panelOf: (key) => panelMap[key],
  };
}
