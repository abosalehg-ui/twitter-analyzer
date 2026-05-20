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
});
