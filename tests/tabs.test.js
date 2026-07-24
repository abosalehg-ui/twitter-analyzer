// @ts-check

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { buildTabs } from '../src/render/tabs.js';

/**
 * Fire an arrow keydown on the tab nav and return the newly active tab key.
 * @param {HTMLElement} nav
 * @param {'ArrowRight'|'ArrowLeft'} key
 */
function pressArrow(nav, key) {
  nav.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  return nav.querySelector('.tab-btn.active')?.getAttribute('data-tab');
}

describe('tab keyboard navigation', () => {
  /** @type {ReturnType<typeof buildTabs>} */
  let tabs;

  beforeEach(() => {
    tabs = buildTabs();
    document.body.appendChild(tabs.nav);
  });

  afterEach(() => {
    tabs.nav.remove();
    document.documentElement.setAttribute('dir', 'ltr');
  });

  it('starts on the overview tab', () => {
    expect(tabs.nav.querySelector('.tab-btn.active')?.getAttribute('data-tab')).toBe('overview');
  });

  it('LTR: ArrowRight advances and ArrowLeft goes back', () => {
    document.documentElement.setAttribute('dir', 'ltr');
    expect(pressArrow(tabs.nav, 'ArrowRight')).toBe('ai');
    expect(pressArrow(tabs.nav, 'ArrowLeft')).toBe('overview');
  });

  it('RTL: arrows follow visual order, so ArrowLeft advances', () => {
    document.documentElement.setAttribute('dir', 'rtl');
    expect(pressArrow(tabs.nav, 'ArrowLeft')).toBe('ai');
    expect(pressArrow(tabs.nav, 'ArrowRight')).toBe('overview');
  });

  it('wraps around at the ends', () => {
    document.documentElement.setAttribute('dir', 'ltr');
    // overview is first — going back should wrap to the last tab
    expect(pressArrow(tabs.nav, 'ArrowLeft')).toBe('details');
    expect(pressArrow(tabs.nav, 'ArrowRight')).toBe('overview');
  });

  it('keeps aria-selected and tabindex in sync with the active tab', () => {
    tabs.setActive('tone');
    const active = /** @type {HTMLElement} */ (tabs.nav.querySelector('.tab-btn[data-tab="tone"]'));
    const other = /** @type {HTMLElement} */ (
      tabs.nav.querySelector('.tab-btn[data-tab="overview"]')
    );
    expect(active.getAttribute('aria-selected')).toBe('true');
    expect(active.getAttribute('tabindex')).toBe('0');
    expect(other.getAttribute('aria-selected')).toBe('false');
    expect(other.getAttribute('tabindex')).toBe('-1');
  });
});
