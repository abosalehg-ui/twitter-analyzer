// @ts-check

import { el } from './dom.js';

let host;

function ensureHost() {
  if (!host || !document.body.contains(host)) {
    host = el('div', { class: 'toast-host', role: 'status', 'aria-live': 'polite' });
    document.body.appendChild(host);
  }
  return host;
}

/**
 * Show a transient toast notification.
 * @param {string} message
 * @param {'info'|'success'|'error'} [kind='info']
 * @param {number} [duration=2800]
 */
export function toast(message, kind = 'info', duration = 2800) {
  const root = ensureHost();
  const node = el('div', { class: `toast toast-${kind}` }, message);
  root.appendChild(node);
  // Force reflow so the enter transition runs
  void /** @type {HTMLElement} */ (node).offsetWidth;
  node.classList.add('show');
  setTimeout(() => {
    node.classList.remove('show');
    setTimeout(() => node.remove(), 250);
  }, duration);
}

/** Remove all current toasts (used on test teardown). */
export function clearToasts() {
  if (host) host.replaceChildren();
}
