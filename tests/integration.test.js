// @ts-check

import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('end-to-end DOM integration', () => {
  /** @type {() => void} */
  let init;

  beforeAll(async () => {
    // Set the test flag BEFORE importing main.js so it doesn't auto-init against an empty DOM.
    // @ts-ignore
    window.__TWITTER_ANALYZER_TEST__ = true;
    const mod = await import('../src/main.js');
    init = mod.init;
  });

  beforeEach(() => {
    localStorage.clear();
    const html = readFileSync(resolve(__dirname, '../index.html'), 'utf-8');
    document.documentElement.innerHTML = html.replace(
      /<!DOCTYPE[^>]*>|<html[^>]*>|<\/html>/g,
      ''
    );
    init();
  });

  it('renders the page with all required DOM hooks', () => {
    expect(document.getElementById('tweets')).not.toBeNull();
    expect(document.getElementById('analyzeBtn')).not.toBeNull();
    expect(document.getElementById('exportBtn')).not.toBeNull();
    expect(document.getElementById('status')).not.toBeNull();
    expect(document.getElementById('results')).not.toBeNull();
  });

  it('shows error status when analyze clicked with empty input', () => {
    const btn = /** @type {HTMLButtonElement} */ (document.getElementById('analyzeBtn'));
    btn.click();
    const status = /** @type {HTMLElement} */ (document.getElementById('status'));
    expect(status.classList.contains('show')).toBe(true);
    expect(status.classList.contains('error')).toBe(true);
  });

  it('does NOT execute injected HTML in tweet text (XSS guard)', () => {
    const textarea = /** @type {HTMLTextAreaElement} */ (document.getElementById('tweets'));
    textarea.value = '<img src=x onerror="window.__pwned=true">\nhello #world @bob 😊';
    const btn = /** @type {HTMLButtonElement} */ (document.getElementById('analyzeBtn'));
    btn.click();

    expect(document.getElementById('tweetCount')?.textContent).toBe('2');

    const extremes = /** @type {HTMLElement} */ (document.getElementById('extremeTweets'));
    expect(extremes.querySelector('img')).toBeNull();
    expect(extremes.textContent).toContain('<img');

    // @ts-ignore
    expect(window.__pwned).toBeUndefined();
  });

  it('populates hashtags, mentions, emojis sections', () => {
    const textarea = /** @type {HTMLTextAreaElement} */ (document.getElementById('tweets'));
    textarea.value = 'hello #world @alice 😊\n#world again with @alice';
    /** @type {HTMLButtonElement} */ (document.getElementById('analyzeBtn')).click();

    const hashtagList = /** @type {HTMLElement} */ (document.getElementById('hashtagList'));
    const mentionList = /** @type {HTMLElement} */ (document.getElementById('mentionList'));
    const emojiStats = /** @type {HTMLElement} */ (document.getElementById('emojiStats'));

    expect(hashtagList.textContent).toContain('#world');
    expect(hashtagList.textContent).toContain('2');
    expect(mentionList.textContent).toContain('@alice');
    expect(emojiStats.textContent).toContain('😊');
  });

  it('clear button wipes textarea, results, and storage', () => {
    const textarea = /** @type {HTMLTextAreaElement} */ (document.getElementById('tweets'));
    textarea.value = 'hello #world';
    /** @type {HTMLButtonElement} */ (document.getElementById('analyzeBtn')).click();

    localStorage.setItem('twitter-analyzer:last-input', 'old content');

    /** @type {HTMLButtonElement} */ (document.getElementById('clearBtn')).click();
    expect(textarea.value).toBe('');
    expect(document.getElementById('results')?.classList.contains('show')).toBe(false);
    expect(localStorage.getItem('twitter-analyzer:last-input')).toBeNull();
  });

  it('renders SVG charts for length distribution and sentiment donut', () => {
    const textarea = /** @type {HTMLTextAreaElement} */ (document.getElementById('tweets'));
    textarea.value = 'short tweet 😊\n' + 'a'.repeat(60) + '\n' + 'b'.repeat(200) + ' terrible';
    /** @type {HTMLButtonElement} */ (document.getElementById('analyzeBtn')).click();

    expect(document.querySelector('#lengthChart svg')).not.toBeNull();
    expect(document.querySelector('#sentimentDonut svg')).not.toBeNull();
  });

  it('export buttons do not crash when analysis is present', () => {
    const textarea = /** @type {HTMLTextAreaElement} */ (document.getElementById('tweets'));
    textarea.value = 'hello #world @alice 😊';
    /** @type {HTMLButtonElement} */ (document.getElementById('analyzeBtn')).click();

    // We don't trigger actual downloads; just verify the buttons exist and clicking
    // them does not throw. URL.createObjectURL is mocked by jsdom-incompat shim:
    // @ts-ignore
    if (!URL.createObjectURL) URL.createObjectURL = () => 'blob:test';
    // @ts-ignore
    if (!URL.revokeObjectURL) URL.revokeObjectURL = () => {};

    expect(() => /** @type {HTMLButtonElement} */ (document.getElementById('exportCsvBtn')).click()).not.toThrow();
    expect(() => /** @type {HTMLButtonElement} */ (document.getElementById('exportJsonBtn')).click()).not.toThrow();
  });
});
