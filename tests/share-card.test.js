// @ts-check

import { describe, it, expect, vi, afterEach } from 'vitest';
import { generateShareCard } from '../src/render/share-card.js';
import { analyzeTweet } from '../src/analysis/index.js';
import { setLocale } from '../src/i18n/index.js';

/** Minimal 2D-context stand-in that records what the card sets. */
function fakeContext() {
  const calls = { direction: /** @type {string[]} */ ([]), text: /** @type {string[]} */ ([]) };
  const ctx = {
    fillStyle: '',
    font: '',
    textAlign: '',
    set direction(v) {
      calls.direction.push(v);
    },
    createLinearGradient: () => ({ addColorStop() {} }),
    fillRect() {},
    beginPath() {},
    roundRect() {},
    fill() {},
    fillText: (/** @type {string} */ s) => calls.text.push(s),
    // ~10px per char, so long tweets need wrapping and trimming
    measureText: (/** @type {string} */ s) => ({ width: s.length * 10 }),
  };
  return { ctx, calls };
}

/**
 * @param {Blob | null} blob
 */
function mockCanvas(blob) {
  const { ctx, calls } = fakeContext();
  vi.spyOn(window.HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    /** @type {any} */ (ctx)
  );
  vi.spyOn(window.HTMLCanvasElement.prototype, 'toBlob').mockImplementation((cb) => cb(blob));
  return calls;
}

describe('generateShareCard', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    setLocale('ar');
  });

  it('downloads a PNG and resolves only after the blob exists', async () => {
    mockCanvas(new Blob(['png'], { type: 'image/png' }));
    // @ts-ignore jsdom lacks object URLs
    URL.createObjectURL = vi.fn(() => 'blob:card');
    // @ts-ignore
    URL.revokeObjectURL = vi.fn();
    const click = vi
      .spyOn(window.HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});

    await expect(generateShareCard(analyzeTweet('تغريدة للتجربة #اختبار'))).resolves.toBe(
      undefined
    );
    expect(click).toHaveBeenCalledOnce();
  });

  it('sets the canvas text direction from the locale', async () => {
    const calls = mockCanvas(new Blob(['png']));
    // @ts-ignore
    URL.createObjectURL = () => 'blob:card';
    vi.spyOn(window.HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    setLocale('ar');
    await generateShareCard(analyzeTweet('مرحبا #عالم 2026'));
    expect(calls.direction).toContain('rtl');

    calls.direction.length = 0;
    setLocale('en');
    await generateShareCard(analyzeTweet('hello world'));
    expect(calls.direction).toContain('ltr');
  });

  it('trims the fifth line by measured width and adds an ellipsis', async () => {
    const calls = mockCanvas(new Blob(['png']));
    // @ts-ignore
    URL.createObjectURL = () => 'blob:card';
    vi.spyOn(window.HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    await generateShareCard(analyzeTweet('word '.repeat(200)));
    const ellipsized = calls.text.find((s) => s.endsWith('…'));
    expect(ellipsized).toBeDefined();
    expect(/** @type {string} */ (ellipsized).length * 10).toBeLessThanOrEqual(1200 - 120);
  });

  it('rejects when PNG encoding fails', async () => {
    mockCanvas(null);
    await expect(generateShareCard(analyzeTweet('hello'))).rejects.toThrow();
  });

  it('rejects when no 2D context is available', async () => {
    vi.spyOn(window.HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    await expect(generateShareCard(analyzeTweet('hello'))).rejects.toThrow();
  });
});
