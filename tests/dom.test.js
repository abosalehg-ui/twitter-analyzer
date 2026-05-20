// @ts-check

import { describe, it, expect } from 'vitest';
import { el, setText, replaceChildren } from '../src/render/dom.js';

describe('el (safe DOM builder)', () => {
  it('creates element with class', () => {
    const node = el('div', { class: 'foo' });
    expect(node.tagName).toBe('DIV');
    expect(node.className).toBe('foo');
  });

  it('appends string children as text nodes (XSS-safe)', () => {
    const malicious = '<img src=x onerror="alert(1)">';
    const node = el('div', {}, malicious);
    expect(node.textContent).toBe(malicious);
    expect(node.children.length).toBe(0);
    expect(node.querySelector('img')).toBeNull();
  });

  it('appends multiple children', () => {
    const node = el('div', {}, ['a', 'b', 'c']);
    expect(node.textContent).toBe('abc');
  });

  it('applies style object', () => {
    const node = el('span', { style: { color: 'red', fontSize: '14px' } });
    expect(node.style.color).toBe('red');
    expect(node.style.fontSize).toBe('14px');
  });

  it('attaches event listeners via on* keys', () => {
    let clicked = false;
    const node = el('button', { onclick: () => (clicked = true) });
    node.click();
    expect(clicked).toBe(true);
  });

  it('skips null/false props', () => {
    const node = el('div', { class: 'x', hidden: false, title: null });
    expect(node.className).toBe('x');
    expect(node.hasAttribute('hidden')).toBe(false);
    expect(node.hasAttribute('title')).toBe(false);
  });

  it('nests elements', () => {
    const inner = el('span', {}, 'hi');
    const outer = el('div', {}, [inner]);
    expect(outer.firstChild).toBe(inner);
    expect(outer.textContent).toBe('hi');
  });
});

describe('setText', () => {
  it('sets text content safely', () => {
    const node = document.createElement('div');
    setText(node, '<script>alert(1)</script>');
    expect(node.textContent).toBe('<script>alert(1)</script>');
    expect(node.children.length).toBe(0);
  });
});

describe('replaceChildren', () => {
  it('replaces all children', () => {
    const container = document.createElement('div');
    container.appendChild(document.createElement('span'));
    container.appendChild(document.createElement('span'));
    const replacement = el('p', {}, 'new');
    replaceChildren(container, [replacement]);
    expect(container.children.length).toBe(1);
    expect(container.firstChild).toBe(replacement);
  });
});
