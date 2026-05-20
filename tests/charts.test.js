// @ts-check

import { describe, it, expect, beforeEach } from 'vitest';
import { renderLengthBarsSvg, renderSentimentDonutSvg } from '../src/render/charts.js';

describe('renderLengthBarsSvg', () => {
  /** @type {HTMLElement} */
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('renders an SVG element', () => {
    renderLengthBarsSvg(container, { short: 2, medium: 5, long: 3 }, 10);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('role')).toBe('img');
  });

  it('renders three bars for the three length buckets', () => {
    renderLengthBarsSvg(container, { short: 1, medium: 1, long: 1 }, 3);
    // 3 bg rects + 3 fg rects = 6 total
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBe(6);
  });

  it('handles zero total without dividing by zero', () => {
    expect(() => renderLengthBarsSvg(container, { short: 0, medium: 0, long: 0 }, 0)).not.toThrow();
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('replaces previous content on re-render', () => {
    renderLengthBarsSvg(container, { short: 1, medium: 1, long: 1 }, 3);
    renderLengthBarsSvg(container, { short: 0, medium: 0, long: 0 }, 0);
    expect(container.querySelectorAll('svg').length).toBe(1);
  });
});

describe('renderSentimentDonutSvg', () => {
  /** @type {HTMLElement} */
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('renders an SVG donut', () => {
    renderSentimentDonutSvg(container, { positive: 3, neutral: 2, negative: 1 });
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('renders an empty ring when total is zero', () => {
    renderSentimentDonutSvg(container, { positive: 0, neutral: 0, negative: 0 });
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.querySelectorAll('circle').length).toBe(1);
  });

  it('renders one arc per non-zero sentiment', () => {
    renderSentimentDonutSvg(container, { positive: 1, neutral: 0, negative: 1 });
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(2);
  });

  it('shows total in center', () => {
    renderSentimentDonutSvg(container, { positive: 4, neutral: 2, negative: 1 });
    const text = container.querySelector('text');
    expect(text?.textContent).toBe('7');
  });
});
