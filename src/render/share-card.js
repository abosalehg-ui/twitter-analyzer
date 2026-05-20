// @ts-check

import { t, getLocale } from '../i18n/index.js';

/**
 * @typedef {import('../analysis/index.js').AnalysisResult} AnalysisResult
 */

/**
 * Wrap text into multiple lines fitting maxWidth (canvas measureText-based).
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} maxWidth
 * @returns {string[]}
 */
function wrapText(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  /** @type {string[]} */
  const lines = [];
  let current = '';
  for (const word of words) {
    const test = current ? current + ' ' + word : word;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Generate a PNG share card for the analysis and trigger download.
 * @param {AnalysisResult} data
 */
export function generateShareCard(data) {
  const width = 1200;
  const height = 630;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
  const isRtl = getLocale() === 'ar';

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#1d1d1f');
  grad.addColorStop(1, '#2a2a2c');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Accent bar (bronze)
  ctx.fillStyle = '#cd7f32';
  ctx.fillRect(0, 0, width, 8);

  // Title
  ctx.fillStyle = '#f5f5f5';
  ctx.font = 'bold 36px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.textAlign = isRtl ? 'right' : 'left';
  const titleX = isRtl ? width - 60 : 60;
  ctx.fillText(t('card.title'), titleX, 80);

  // Tweet preview
  ctx.fillStyle = '#e8e8e8';
  ctx.font = '28px system-ui, -apple-system, "Segoe UI", sans-serif';
  const tweetMaxWidth = width - 120;
  const lines = wrapText(ctx, data.text, tweetMaxWidth);
  const displayLines = lines.slice(0, 5);
  if (lines.length > 5) displayLines[4] = displayLines[4].slice(0, -3) + '…';
  let lineY = 160;
  for (const line of displayLines) {
    ctx.fillText(line, titleX, lineY);
    lineY += 40;
  }

  // Scores row
  const baseY = 420;
  drawScoreCard(ctx, 60, baseY, t('card.aiScore'), data.ai.score, '#cd7f32');
  drawScoreCard(ctx, 60 + 360, baseY, t('card.algoScore'), data.algorithm.score, '#2da44e');
  drawReachCard(ctx, 60 + 720, baseY, t('card.reach'), t('algo.reach.' + data.algorithm.reach));

  // Brand footer
  ctx.fillStyle = '#a8a8a8';
  ctx.font = '20px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(t('card.brand'), width / 2, height - 30);

  // Download
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${t('report.filename')}_card_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

function drawScoreCard(ctx, x, y, label, value, color) {
  ctx.fillStyle = '#3a3a3c';
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, 320, 150, 16);
    ctx.fill();
  } else {
    ctx.fillRect(x, y, 320, 150);
  }
  ctx.fillStyle = color;
  ctx.font = 'bold 64px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(`${value}`, x + 160, y + 80);
  ctx.fillStyle = '#a8a8a8';
  ctx.font = '20px system-ui';
  ctx.fillText(label + ' /100', x + 160, y + 120);
}

function drawReachCard(ctx, x, y, label, value) {
  ctx.fillStyle = '#3a3a3c';
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, 360, 150, 16);
    ctx.fill();
  } else {
    ctx.fillRect(x, y, 360, 150);
  }
  ctx.fillStyle = '#cd7f32';
  ctx.font = 'bold 40px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(value, x + 180, y + 80);
  ctx.fillStyle = '#a8a8a8';
  ctx.font = '20px system-ui';
  ctx.fillText(label, x + 180, y + 120);
}
