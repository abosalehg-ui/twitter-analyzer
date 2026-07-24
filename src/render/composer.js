// @ts-check

import { el } from './dom.js';
import { t } from '../i18n/index.js';

const MAX = 280;
const SWEET_MIN = 70;
const SWEET_MAX = 150;
const WARN = 240;

/**
 * Build a circular char-counter SVG.
 * @param {number} count
 * @returns {SVGElement}
 */
function buildCharCircle(count) {
  const ns = 'http://www.w3.org/2000/svg';
  const size = 36;
  const radius = 14;
  const stroke = 3;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.min(count / MAX, 1);
  const dash = ratio * circumference;

  let color = '#cd7f32';
  if (count > MAX) color = '#cf222e';
  else if (count > WARN) color = '#9a6700';
  else if (count >= SWEET_MIN && count <= SWEET_MAX) color = '#2da44e';

  const root = document.createElementNS(ns, 'svg');
  root.setAttribute('width', String(size));
  root.setAttribute('height', String(size));
  root.setAttribute('viewBox', `0 0 ${size} ${size}`);
  root.setAttribute('aria-hidden', 'true');

  const bg = document.createElementNS(ns, 'circle');
  bg.setAttribute('cx', String(size / 2));
  bg.setAttribute('cy', String(size / 2));
  bg.setAttribute('r', String(radius));
  bg.setAttribute('fill', 'none');
  bg.setAttribute('stroke', '#3a3a3c');
  bg.setAttribute('stroke-width', String(stroke));
  root.appendChild(bg);

  const fg = document.createElementNS(ns, 'circle');
  fg.setAttribute('cx', String(size / 2));
  fg.setAttribute('cy', String(size / 2));
  fg.setAttribute('r', String(radius));
  fg.setAttribute('fill', 'none');
  fg.setAttribute('stroke', color);
  fg.setAttribute('stroke-width', String(stroke));
  fg.setAttribute('stroke-linecap', 'round');
  fg.setAttribute('stroke-dasharray', `${dash} ${circumference - dash}`);
  fg.setAttribute('transform', `rotate(-90 ${size / 2} ${size / 2})`);
  root.appendChild(fg);

  return root;
}

/**
 * Update the char counter UI in response to textarea input.
 * @param {HTMLTextAreaElement} textarea
 * @param {HTMLElement} counterHost  container for the circle + number
 * @param {HTMLElement} sweetspotBar bar element
 */
export function updateCharCounter(textarea, counterHost, sweetspotBar) {
  const count = textarea.value.length;
  const remaining = MAX - count;

  // Counter: circle + number
  counterHost.replaceChildren();
  counterHost.appendChild(buildCharCircle(count));
  const num = el(
    'span',
    { class: 'char-num' + (count > MAX ? ' over' : count > WARN ? ' warn' : '') },
    String(remaining)
  );
  counterHost.appendChild(num);

  // Sweet-spot progress bar
  const pct = Math.min(count / MAX, 1) * 100;
  sweetspotBar.style.setProperty('--progress', pct + '%');
  sweetspotBar.classList.toggle('over-limit', count > MAX);
  sweetspotBar.classList.toggle('in-sweetspot', count >= SWEET_MIN && count <= SWEET_MAX);
}

/**
 * Build a complete composer block (label, textarea, helper, counter, sweetspot bar).
 * @param {{ id: string, value?: string, placeholderKey?: string, labelKey?: string }} opts
 * @returns {{ root: HTMLElement, textarea: HTMLTextAreaElement, counterHost: HTMLElement, sweetspotBar: HTMLElement }}
 */
export function buildComposer(opts) {
  const textarea = /** @type {HTMLTextAreaElement} */ (
    el('textarea', {
      id: opts.id,
      maxlength: String(MAX + 50), // allow soft over-limit then warn
      placeholder: t(opts.placeholderKey ?? 'composer.placeholder'),
      'aria-describedby': opts.id + '-help',
    })
  );
  if (opts.value) textarea.value = opts.value;

  const counterHost = el('div', { class: 'char-counter', 'aria-live': 'polite' });
  const sweetspotBar = el('div', { class: 'sweetspot-bar' }, [
    el('div', {
      class: 'sweetspot-zone',
      style: {
        // sweet spot zone 70-150 of 280
        // 70/280 = 25%; 150/280 ≈ 53.57%
        left: (SWEET_MIN / MAX) * 100 + '%',
        width: ((SWEET_MAX - SWEET_MIN) / MAX) * 100 + '%',
      },
    }),
    el('div', { class: 'sweetspot-fill' }),
  ]);

  const help = el('div', { class: 'composer-help', id: opts.id + '-help' }, t('composer.help'));

  const label = el(
    'label',
    { for: opts.id, class: 'composer-label' },
    t(opts.labelKey ?? 'composer.label')
  );

  const root = el('div', { class: 'composer' }, [
    label,
    textarea,
    sweetspotBar,
    el('div', { class: 'composer-meta' }, [help, counterHost]),
  ]);

  textarea.addEventListener('input', () => updateCharCounter(textarea, counterHost, sweetspotBar));
  updateCharCounter(textarea, counterHost, sweetspotBar);

  return { root, textarea, counterHost, sweetspotBar };
}
