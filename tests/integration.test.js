// @ts-check

import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('end-to-end DOM integration (single-tweet v3.0)', () => {
  /** @type {() => void} */
  let init;

  beforeAll(async () => {
    // @ts-ignore — prevent main.js auto-init against an empty DOM
    window.__TWITTER_ANALYZER_TEST__ = true;
    const mod = await import('../src/main.js');
    init = mod.init;
  });

  beforeEach(() => {
    localStorage.clear();
    // jsdom does not implement window.confirm; destructive actions are gated on
    // it, so default to "user accepted" and override per-test where the cancel
    // path is what is under test.
    window.confirm = () => true;
    const html = readFileSync(resolve(__dirname, '../index.html'), 'utf-8');
    document.documentElement.innerHTML = html.replace(/<!DOCTYPE[^>]*>|<html[^>]*>|<\/html>/g, '');
    // jsdom blob URL polyfill
    // @ts-ignore
    if (!URL.createObjectURL) URL.createObjectURL = () => 'blob:test';
    // @ts-ignore
    if (!URL.revokeObjectURL) URL.revokeObjectURL = () => {};
    init();
  });

  it('renders all required DOM hooks', () => {
    expect(document.getElementById('analyzeBtn')).not.toBeNull();
    expect(document.getElementById('clearBtn')).not.toBeNull();
    expect(document.getElementById('results')).not.toBeNull();
    expect(document.getElementById('tabsNav')).not.toBeNull();
    expect(document.getElementById('tabsPanels')).not.toBeNull();
    expect(document.getElementById('composerHost')).not.toBeNull();
  });

  it('shows toast error when analyze clicked with empty input', () => {
    /** @type {HTMLButtonElement} */ (document.getElementById('analyzeBtn')).click();
    const toasts = document.querySelector('.toast');
    expect(toasts).not.toBeNull();
    expect(toasts?.classList.contains('toast-error')).toBe(true);
  });

  it('does NOT execute injected HTML in tweet text (XSS guard)', () => {
    const textarea = /** @type {HTMLTextAreaElement} */ (document.getElementById('tweet'));
    textarea.value = '<img src=x onerror="window.__pwned=true">';
    textarea.dispatchEvent(new Event('input'));
    /** @type {HTMLButtonElement} */ (document.getElementById('analyzeBtn')).click();

    expect(document.querySelector('#tabsPanels img')).toBeNull();
    // @ts-ignore
    expect(window.__pwned).toBeUndefined();
  });

  it('shows results section after analysis', () => {
    const textarea = /** @type {HTMLTextAreaElement} */ (document.getElementById('tweet'));
    textarea.value = 'Hello, just shipped a new feature today 🚀 What do you think about it?';
    textarea.dispatchEvent(new Event('input'));
    /** @type {HTMLButtonElement} */ (document.getElementById('analyzeBtn')).click();

    expect(document.getElementById('results')?.classList.contains('show')).toBe(true);
  });

  it('renders all 8 tab panels after analysis', () => {
    const textarea = /** @type {HTMLTextAreaElement} */ (document.getElementById('tweet'));
    textarea.value = 'Just shipped a new feature today! What do you think? 🚀';
    textarea.dispatchEvent(new Event('input'));
    /** @type {HTMLButtonElement} */ (document.getElementById('analyzeBtn')).click();

    const panels = document.querySelectorAll('.tab-panel');
    expect(panels.length).toBe(8);
  });

  it('switches tabs on click', () => {
    const textarea = /** @type {HTMLTextAreaElement} */ (document.getElementById('tweet'));
    textarea.value = 'test tweet for tab switching today';
    textarea.dispatchEvent(new Event('input'));
    /** @type {HTMLButtonElement} */ (document.getElementById('analyzeBtn')).click();

    const aiTab = document.querySelector('.tab-btn[data-tab="ai"]');
    /** @type {HTMLElement} */ (aiTab).click();
    expect(aiTab?.classList.contains('active')).toBe(true);
    const aiPanel = document.querySelector('.tab-panel[data-tab="ai"]');
    expect(aiPanel?.hasAttribute('hidden')).toBe(false);
  });

  it('clear button wipes textarea and hides results', () => {
    const textarea = /** @type {HTMLTextAreaElement} */ (document.getElementById('tweet'));
    textarea.value = 'something';
    textarea.dispatchEvent(new Event('input'));
    /** @type {HTMLButtonElement} */ (document.getElementById('analyzeBtn')).click();

    /** @type {HTMLButtonElement} */ (document.getElementById('clearBtn')).click();
    expect(textarea.value).toBe('');
    expect(document.getElementById('results')?.classList.contains('show')).toBe(false);
  });

  it('export buttons do not throw when analysis is present', () => {
    const textarea = /** @type {HTMLTextAreaElement} */ (document.getElementById('tweet'));
    textarea.value = 'hello #world @alice 😊';
    textarea.dispatchEvent(new Event('input'));
    /** @type {HTMLButtonElement} */ (document.getElementById('analyzeBtn')).click();

    expect(() =>
      /** @type {HTMLButtonElement} */ (document.getElementById('exportTxtBtn')).click()
    ).not.toThrow();
    expect(() =>
      /** @type {HTMLButtonElement} */ (document.getElementById('exportCsvBtn')).click()
    ).not.toThrow();
    expect(() =>
      /** @type {HTMLButtonElement} */ (document.getElementById('exportJsonBtn')).click()
    ).not.toThrow();
  });

  it('keeps text when the clear confirmation is declined', () => {
    const textarea = /** @type {HTMLTextAreaElement} */ (document.getElementById('tweet'));
    textarea.value = 'text I did not mean to lose';
    textarea.dispatchEvent(new Event('input'));

    window.confirm = () => false;
    /** @type {HTMLButtonElement} */ (document.getElementById('clearBtn')).click();

    expect(textarea.value).toBe('text I did not mean to lose');
  });

  it('does not prompt when clearing an already-empty composer', () => {
    const textarea = /** @type {HTMLTextAreaElement} */ (document.getElementById('tweet'));
    textarea.value = '';
    textarea.dispatchEvent(new Event('input'));

    let prompted = false;
    window.confirm = () => {
      prompted = true;
      return true;
    };
    /** @type {HTMLButtonElement} */ (document.getElementById('clearBtn')).click();

    expect(prompted).toBe(false);
  });

  it('keeps history when the clear-history confirmation is declined', () => {
    const textarea = /** @type {HTMLTextAreaElement} */ (document.getElementById('tweet'));
    textarea.value = 'entry that should survive';
    textarea.dispatchEvent(new Event('input'));
    /** @type {HTMLButtonElement} */ (document.getElementById('analyzeBtn')).click();
    /** @type {HTMLButtonElement} */ (document.getElementById('saveHistoryBtn')).click();

    window.confirm = () => false;
    const clearAll = /** @type {HTMLButtonElement} */ (
      document.querySelector('.history-toolbar .btn')
    );
    clearAll.click();

    const raw = localStorage.getItem('twitter-analyzer:history');
    expect(JSON.parse(/** @type {string} */ (raw)).length).toBe(1);
  });

  it('clearing also tears down an open compare composer', () => {
    const textarea = /** @type {HTMLTextAreaElement} */ (document.getElementById('tweet'));
    textarea.value = 'first tweet';
    textarea.dispatchEvent(new Event('input'));
    /** @type {HTMLButtonElement} */ (document.getElementById('analyzeBtn')).click();
    /** @type {HTMLButtonElement} */ (document.getElementById('compareBtn')).click();
    expect(document.getElementById('tweetCompare')).not.toBeNull();

    /** @type {HTMLButtonElement} */ (document.getElementById('clearBtn')).click();

    expect(document.getElementById('compareHost')?.hidden).toBe(true);
    expect(document.getElementById('tweetCompare')).toBeNull();
  });

  it('compare button is visible but disabled until an analysis exists', () => {
    const cmpBtn = /** @type {HTMLButtonElement} */ (document.getElementById('compareBtn'));
    expect(cmpBtn.hidden).toBe(false);
    expect(cmpBtn.disabled).toBe(true);

    const textarea = /** @type {HTMLTextAreaElement} */ (document.getElementById('tweet'));
    textarea.value = 'now there is an analysis to compare against';
    textarea.dispatchEvent(new Event('input'));
    /** @type {HTMLButtonElement} */ (document.getElementById('analyzeBtn')).click();

    expect(cmpBtn.disabled).toBe(false);
  });

  it('localizes aria-labels when the language is switched', () => {
    const themeBtn = /** @type {HTMLElement} */ (document.getElementById('themeBtn'));
    expect(themeBtn.getAttribute('aria-label')).toBe('تبديل المظهر بين الفاتح والداكن');

    /** @type {HTMLButtonElement} */ (document.getElementById('langBtn')).click();
    expect(themeBtn.getAttribute('aria-label')).toBe('Toggle between light and dark theme');
  });

  it('toggles compare composer on compare button click', () => {
    const textarea = /** @type {HTMLTextAreaElement} */ (document.getElementById('tweet'));
    textarea.value = 'first tweet for compare test';
    textarea.dispatchEvent(new Event('input'));
    /** @type {HTMLButtonElement} */ (document.getElementById('analyzeBtn')).click();
    /** @type {HTMLButtonElement} */ (document.getElementById('compareBtn')).click();

    expect(document.getElementById('compareHost')?.hidden).toBe(false);
    expect(document.getElementById('tweetCompare')).not.toBeNull();
  });

  it('save-to-history persists an entry to localStorage', () => {
    const textarea = /** @type {HTMLTextAreaElement} */ (document.getElementById('tweet'));
    textarea.value = 'memorable tweet to save';
    textarea.dispatchEvent(new Event('input'));
    /** @type {HTMLButtonElement} */ (document.getElementById('analyzeBtn')).click();
    /** @type {HTMLButtonElement} */ (document.getElementById('saveHistoryBtn')).click();

    const raw = localStorage.getItem('twitter-analyzer:history');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(/** @type {string} */ (raw));
    expect(parsed.length).toBe(1);
    expect(parsed[0].text).toBe('memorable tweet to save');
  });

  /** @param {string} text */
  function analyze(text) {
    const textarea = /** @type {HTMLTextAreaElement} */ (document.getElementById('tweet'));
    textarea.value = text;
    textarea.dispatchEvent(new Event('input'));
    /** @type {HTMLButtonElement} */ (document.getElementById('analyzeBtn')).click();
  }

  const lastToast = () => {
    const all = document.querySelectorAll('.toast');
    return /** @type {HTMLElement | undefined} */ (all[all.length - 1]);
  };

  it('never renders NaN in any panel', () => {
    analyze('جملة عربية قصيرة للتجربة، وفيها كلمات طويلة نسبيًا مثل الاستراتيجيات');
    expect(document.getElementById('tabsPanels')?.textContent).not.toContain('NaN');
  });

  it('gauge numbers follow the theme instead of a hardcoded light fill', () => {
    analyze('Just shipped a new feature today! What do you think? 🚀');
    const nums = document.querySelectorAll('.gauge-svg text');
    expect(nums.length).toBeGreaterThan(0);
    for (const n of nums) expect(n.getAttribute('fill')).toBe('currentColor');
  });

  it('links every tab to its panel for assistive tech', () => {
    analyze('test tweet for aria wiring');
    for (const btn of document.querySelectorAll('.tab-btn')) {
      const panel = document.getElementById(
        /** @type {string} */ (btn.getAttribute('aria-controls'))
      );
      expect(panel?.getAttribute('role')).toBe('tabpanel');
      expect(panel?.getAttribute('aria-labelledby')).toBe(btn.id);
    }
  });

  it('has a single tabs landmark and no live region over the whole results', () => {
    expect(document.querySelectorAll('#results nav').length).toBe(1);
    expect(document.getElementById('results')?.hasAttribute('aria-live')).toBe(false);
  });

  it('keeps the active tab when the language is switched', () => {
    analyze('test tweet for locale switching');
    /** @type {HTMLElement} */ (document.querySelector('.tab-btn[data-tab="tone"]')).click();
    /** @type {HTMLButtonElement} */ (document.getElementById('langBtn')).click();
    const active = document.querySelector('.tab-btn.active');
    expect(active?.getAttribute('data-tab')).toBe('tone');
    expect(document.querySelector('.tab-panel[data-tab="tone"]')?.hasAttribute('hidden')).toBe(
      false
    );
  });

  it('compare mode explains the next step and focuses the second composer', () => {
    analyze('first tweet for compare hint');
    /** @type {HTMLButtonElement} */ (document.getElementById('compareBtn')).click();
    expect(lastToast()?.textContent).toContain('اكتب التغريدة الثانية');
    expect(document.activeElement?.id).toBe('tweetCompare');
  });

  it('renders the A/B comparison when both composers have text', () => {
    analyze('first tweet for the comparison table');
    /** @type {HTMLButtonElement} */ (document.getElementById('compareBtn')).click();
    const second = /** @type {HTMLTextAreaElement} */ (document.getElementById('tweetCompare'));
    second.value = 'second tweet — what do you think? 🚀';
    /** @type {HTMLButtonElement} */ (document.getElementById('analyzeBtn')).click();

    const view = /** @type {HTMLElement} */ (document.getElementById('comparisonView'));
    expect(view.hidden).toBe(false);
    expect(view.querySelectorAll('.cmp-table tbody tr').length).toBe(4);
    expect(view.querySelector('.cmp-verdict')?.textContent).toBeTruthy();
  });

  it('reports an export failure instead of a false success', () => {
    analyze('tweet whose export will fail');
    const original = URL.createObjectURL;
    URL.createObjectURL = () => {
      throw new Error('boom');
    };
    try {
      /** @type {HTMLButtonElement} */ (document.getElementById('exportTxtBtn')).click();
    } finally {
      URL.createObjectURL = original;
    }
    expect(lastToast()?.classList.contains('toast-error')).toBe(true);
    expect(lastToast()?.textContent).toContain('تعذّر');
  });

  it('reports a share-card failure as an export failure, not "no analysis"', async () => {
    analyze('tweet for the share card');
    // jsdom has no canvas implementation, so getContext() returns null
    /** @type {HTMLButtonElement} */ (document.getElementById('shareCardBtn')).click();
    await new Promise((r) => setTimeout(r, 0));
    expect(lastToast()?.textContent).toContain('تعذّر');
  });

  it('language toggle flips dir attribute', () => {
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    /** @type {HTMLButtonElement} */ (document.getElementById('langBtn')).click();
    expect(document.documentElement.getAttribute('dir')).toBe('ltr');
  });
});
