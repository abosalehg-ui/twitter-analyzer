// @ts-check

import { t } from '../i18n/index.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Create an SVG element with attributes (separate namespace from el()).
 * @param {string} tag
 * @param {Record<string, string | number>} attrs
 * @param {Array<Node>} [children]
 * @returns {SVGElement}
 */
function svg(tag, attrs = {}, children = []) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    node.setAttribute(k, String(v));
  }
  for (const child of children) node.appendChild(child);
  return node;
}

/**
 * Set text content on an SVG node safely.
 * @param {SVGElement} node
 * @param {string} text
 */
function svgText(node, text) {
  node.textContent = text;
  return node;
}

/**
 * Render an SVG horizontal bar chart for length distribution.
 * Replaces the div-based bar chart.
 *
 * @param {HTMLElement} container
 * @param {{ short: number, medium: number, long: number }} lengths
 * @param {number} total
 */
export function renderLengthBarsSvg(container, lengths, total) {
  const items = [
    { label: t('length.short'), value: lengths.short },
    { label: t('length.medium'), value: lengths.medium },
    { label: t('length.long'), value: lengths.long },
  ];

  const width = 600;
  const rowHeight = 48;
  const labelWidth = 110;
  const barAreaWidth = width - labelWidth - 20;
  const height = items.length * rowHeight + 16;
  const maxValue = Math.max(1, ...items.map((i) => i.value));

  const root = svg('svg', {
    viewBox: `0 0 ${width} ${height}`,
    width: '100%',
    height,
    role: 'img',
    'aria-label': t('length.short') + '/' + t('length.medium') + '/' + t('length.long'),
  });

  const defs = svg('defs');
  const grad = svg('linearGradient', { id: 'lengthGrad', x1: '0', x2: '1', y1: '0', y2: '0' });
  grad.appendChild(svg('stop', { offset: '0%', 'stop-color': '#cd7f32' }));
  grad.appendChild(svg('stop', { offset: '100%', 'stop-color': '#e89847' }));
  defs.appendChild(grad);
  root.appendChild(defs);

  items.forEach((item, idx) => {
    const y = idx * rowHeight + 8;
    const barWidth = (item.value / maxValue) * barAreaWidth;
    const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;

    const labelNode = svg('text', {
      x: labelWidth - 10,
      y: y + rowHeight / 2 + 4,
      'text-anchor': 'end',
      fill: '#f5f5f5',
      'font-weight': '600',
      'font-size': '14',
    });
    root.appendChild(svgText(labelNode, item.label));

    root.appendChild(
      svg('rect', {
        x: labelWidth,
        y: y + 6,
        width: barAreaWidth,
        height: rowHeight - 16,
        fill: '#1d1d1f',
        rx: 6,
      })
    );

    root.appendChild(
      svg('rect', {
        x: labelWidth,
        y: y + 6,
        width: barWidth,
        height: rowHeight - 16,
        fill: 'url(#lengthGrad)',
        rx: 6,
      })
    );

    const valueNode = svg('text', {
      x: labelWidth + 10,
      y: y + rowHeight / 2 + 4,
      fill: '#1d1d1f',
      'font-weight': '700',
      'font-size': '13',
    });
    root.appendChild(svgText(valueNode, `${item.value} (${percent}%)`));
  });

  container.replaceChildren(root);
}

/**
 * Render an SVG donut chart for sentiment distribution as a richer complement
 * to the existing horizontal bar.
 *
 * @param {HTMLElement} container
 * @param {{ positive: number, neutral: number, negative: number }} scores
 */
export function renderSentimentDonutSvg(container, scores) {
  const total = scores.positive + scores.neutral + scores.negative;
  const size = 220;
  const radius = 80;
  const strokeWidth = 28;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  const root = svg('svg', {
    viewBox: `0 0 ${size} ${size}`,
    width: size,
    height: size,
    role: 'img',
    'aria-label': t('sentiment.positive') + '/' + t('sentiment.neutral') + '/' + t('sentiment.negative'),
  });

  if (total === 0) {
    root.appendChild(
      svg('circle', {
        cx,
        cy,
        r: radius,
        fill: 'none',
        stroke: '#3a3a3c',
        'stroke-width': strokeWidth,
      })
    );
    container.replaceChildren(root);
    return;
  }

  const slices = [
    { value: scores.positive, color: '#2da44e' },
    { value: scores.neutral, color: '#9a6700' },
    { value: scores.negative, color: '#cf222e' },
  ];

  let offset = 0;
  for (const slice of slices) {
    if (slice.value === 0) continue;
    const fraction = slice.value / total;
    const dash = fraction * circumference;
    root.appendChild(
      svg('circle', {
        cx,
        cy,
        r: radius,
        fill: 'none',
        stroke: slice.color,
        'stroke-width': strokeWidth,
        'stroke-dasharray': `${dash} ${circumference - dash}`,
        'stroke-dashoffset': -offset,
        transform: `rotate(-90 ${cx} ${cy})`,
      })
    );
    offset += dash;
  }

  const centerLabel = svg('text', {
    x: cx,
    y: cy + 6,
    'text-anchor': 'middle',
    fill: '#f5f5f5',
    'font-weight': '700',
    'font-size': '20',
  });
  root.appendChild(svgText(centerLabel, String(total)));

  container.replaceChildren(root);
}
