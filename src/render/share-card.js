// @ts-check

import { t, getLocale } from '../i18n/index.js';
import { downloadBlob } from '../export/download.js';

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
 * Resolves once the PNG has actually been handed to the browser, and rejects if
 * the canvas is unavailable or encoding fails — so callers report the real outcome.
 * @param {AnalysisResult} data
 * @returns {Promise<void>}
 */
export function generateShareCard(data) {
  const width = 1200;
  const height = 630;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return Promise.reject(new Error('Canvas 2D context unavailable'));
  const isRtl = getLocale() === 'ar';
  // Without this the bidi algorithm lays out mixed Arabic/Latin/number runs as LTR,
  // so hashtags and numbers land on the wrong side of an Arabic sentence.
  ctx.direction = isRtl ? 'rtl' : 'ltr';

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
  if (lines.length > 5) displayLines[4] = fitWithEllipsis(ctx, displayLines[4], tweetMaxWidth);
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

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('PNG encoding failed'));
        return;
      }
      downloadBlob(`${t('report.filename')}_card_${Date.now()}.png`, blob);
      resolve();
    }, 'image/png');
  });
}

/**
 * Trim a line (measured, not by character count) so it plus an ellipsis fits.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} line
 * @param {number} maxWidth
 */
function fitWithEllipsis(ctx, line, maxWidth) {
  let out = line;
  while (out.length > 0 && ctx.measureText(out + '…').width > maxWidth) {
    out = out.slice(0, -1);
  }
  return out.trimEnd() + '…';
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
