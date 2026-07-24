// @ts-check

import { analyzeTweet } from './analysis/index.js';
import { buildComposer } from './render/composer.js';
import { buildTabs } from './render/tabs.js';
import { toast } from './render/toast.js';
import {
  renderOverview,
  renderAi,
  renderAlgorithm,
  renderEngagement,
  renderOptimizer,
  renderWeakness,
  renderTone,
  renderDetails,
} from './render/panels.js';
import { renderHistory } from './render/history-panel.js';
import { renderComparison } from './render/comparison.js';
import { generateShareCard } from './render/share-card.js';
import { suggestRewrites } from './optimizer/rewrite-suggestions.js';
import { exportTxt } from './export/txt.js';
import { exportCsv } from './export/csv.js';
import { exportJson } from './export/json.js';
import { saveInput, loadInput, clearInput } from './storage/local.js';
import {
  loadHistory,
  addToHistory,
  removeFromHistory,
  clearHistory,
  getHistoryEntry,
} from './storage/history.js';
import { loadLocale, saveLocale, loadTheme, saveTheme } from './storage/preferences.js';
import { t, setLocale, getLocale } from './i18n/index.js';

/** @typedef {import('./analysis/index.js').AnalysisResult} AnalysisResult */

const $ = (id) => /** @type {HTMLElement} */ (document.getElementById(id));

/**
 * Ask the user to confirm a destructive action.
 * Falls back to "allowed" in environments without a dialog implementation
 * so the app never becomes unusable where `confirm` is missing.
 * @param {string} messageKey i18n key for the prompt
 * @returns {boolean}
 */
function confirmAction(messageKey) {
  if (typeof window === 'undefined' || typeof window.confirm !== 'function') return true;
  return window.confirm(t(messageKey));
}

const state = {
  /** @type {AnalysisResult | null} */
  current: null,
  /** @type {AnalysisResult | null} */
  compareWith: null,
  /** @type {ReturnType<typeof buildComposer> | null} */
  primaryComposer: null,
  /** @type {ReturnType<typeof buildComposer> | null} */
  compareComposer: null,
  /** @type {ReturnType<typeof setTimeout> | null} */
  saveDebounce: null,
  tabs: /** @type {ReturnType<typeof buildTabs> | null} */ (null),
};

// ====================================================================
//  i18n + theme
// ====================================================================

function applyLocale() {
  const locale = getLocale();
  document.documentElement.setAttribute('lang', locale);
  document.documentElement.setAttribute('dir', t('app.dir'));

  // Static labels
  const title = $('appTitle');
  if (title) title.textContent = t('app.title');
  const subtitle = $('appSubtitle');
  if (subtitle) subtitle.textContent = t('app.subtitle');
  document.title = t('app.title');

  const setBtn = (id, key) => {
    const e = document.getElementById(id);
    if (e) e.textContent = t(key);
  };
  setBtn('analyzeBtn', 'btn.analyze');
  setBtn('clearBtn', 'btn.clear');
  setBtn('compareBtn', 'btn.compare');
  setBtn('exportTxtBtn', 'btn.exportTxt');
  setBtn('exportCsvBtn', 'btn.exportCsv');
  setBtn('exportJsonBtn', 'btn.exportJson');
  setBtn('shareCardBtn', 'btn.shareCard');
  setBtn('saveHistoryBtn', 'btn.saveHistory');

  const langBtn = $('langBtn');
  if (langBtn) {
    langBtn.textContent = t('app.langSwitch');
    langBtn.setAttribute('aria-label', t('aria.langSwitch'));
  }

  // Screen-reader labels follow the active locale like every other string.
  const themeBtn = $('themeBtn');
  if (themeBtn) {
    themeBtn.setAttribute('aria-label', t('aria.themeToggle'));
    themeBtn.setAttribute('title', t('aria.themeToggle'));
  }

  const historyHeading = $('historyHeading');
  if (historyHeading) historyHeading.textContent = t('history.title');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function toggleLocale() {
  const next = getLocale() === 'ar' ? 'en' : 'ar';
  setLocale(next);
  saveLocale(next);
  applyLocale();
  rebuildComposers();
  state.tabs = rebuildTabs();
  if (state.current) {
    renderAll(state.current);
    if (state.compareWith) {
      renderComparison(
        /** @type {HTMLElement} */ ($('comparisonView')),
        state.current,
        state.compareWith
      );
    }
  }
  renderHistoryList();
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  saveTheme(next);
}

// ====================================================================
//  Composer + tabs setup
// ====================================================================

function rebuildComposers() {
  const host = /** @type {HTMLElement} */ ($('composerHost'));
  const previousValue = state.primaryComposer?.textarea.value ?? loadInput();
  host.replaceChildren();
  state.primaryComposer = buildComposer({ id: 'tweet', value: previousValue });
  host.appendChild(state.primaryComposer.root);
  state.primaryComposer.textarea.addEventListener('input', handleInputChange);
  state.primaryComposer.textarea.addEventListener('keydown', handleKeyShortcut);

  // Rebuild compare composer if active
  if (state.compareComposer) {
    const cmpHost = /** @type {HTMLElement} */ ($('compareHost'));
    const previousCompareValue = state.compareComposer.textarea.value;
    cmpHost.replaceChildren();
    state.compareComposer = buildComposer({
      id: 'tweetCompare',
      value: previousCompareValue,
      labelKey: 'compare.tweetB',
    });
    cmpHost.appendChild(state.compareComposer.root);
  }
}

function rebuildTabs() {
  const navHost = /** @type {HTMLElement} */ ($('tabsNav'));
  const panelsHost = /** @type {HTMLElement} */ ($('tabsPanels'));
  const t = buildTabs();
  navHost.replaceChildren(t.nav);
  panelsHost.replaceChildren(t.panels);
  return t;
}

// ====================================================================
//  Analyze + render
// ====================================================================

function handleKeyShortcut(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    runAnalysis();
  }
  if (e.key === 'Escape') {
    runClear();
  }
}

function getText() {
  return state.primaryComposer?.textarea.value.trim() ?? '';
}

function runAnalysis() {
  const text = getText();
  if (!text) {
    toast(t('status.empty'), 'error');
    return;
  }
  state.current = analyzeTweet(text);

  // Show results + enable the compare action (visible but inert before analysis)
  $('results').classList.add('show');
  /** @type {HTMLButtonElement} */ ($('compareBtn')).disabled = false;

  renderAll(state.current);

  // If comparison composer is open AND has text, analyze it too
  if (state.compareComposer) {
    const txt = state.compareComposer.textarea.value.trim();
    if (txt) {
      state.compareWith = analyzeTweet(txt);
      renderComparisonView();
    }
  }

  // Scroll into view (guard for environments without matchMedia, e.g. jsdom)
  const reducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const results = $('results');
  if (typeof results.scrollIntoView === 'function') {
    results.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }
}

function renderAll(data) {
  if (!state.tabs) return;
  const t = state.tabs;
  renderOverview(t.panelOf('overview'), data);
  renderAi(t.panelOf('ai'), data);
  renderAlgorithm(t.panelOf('algorithm'), data);
  renderEngagement(t.panelOf('engagement'), data);
  renderOptimizer(
    t.panelOf('optimizer'),
    data,
    suggestRewrites(data.text, data.algorithm.score),
    applyOptimization
  );
  renderWeakness(t.panelOf('weakness'), data);
  renderTone(t.panelOf('tone'), data);
  renderDetails(t.panelOf('details'), data);
}

function applyOptimization(text) {
  if (!state.primaryComposer) return;
  state.primaryComposer.textarea.value = text;
  state.primaryComposer.textarea.dispatchEvent(new Event('input'));
  runAnalysis();
}

function renderComparisonView() {
  if (!state.current || !state.compareWith) return;
  const view = /** @type {HTMLElement} */ ($('comparisonView'));
  view.hidden = false;
  renderComparison(view, state.current, state.compareWith);
}

// ====================================================================
//  Compare mode
// ====================================================================

/**
 * Tear down compare mode completely: second composer, its analysis, and the
 * side-by-side view. Safe to call when compare mode is not active.
 */
function resetCompareMode() {
  state.compareComposer = null;
  state.compareWith = null;
  const cmpHost = /** @type {HTMLElement} */ ($('compareHost'));
  cmpHost.hidden = true;
  cmpHost.replaceChildren();
  $('comparisonView').hidden = true;
  $('compareBtn').textContent = t('btn.compare');
}

function toggleCompareMode() {
  if (state.compareComposer) {
    resetCompareMode();
    return;
  }

  const cmpHost = /** @type {HTMLElement} */ ($('compareHost'));
  state.compareComposer = buildComposer({
    id: 'tweetCompare',
    labelKey: 'compare.tweetB',
  });
  cmpHost.replaceChildren(state.compareComposer.root);
  cmpHost.hidden = false;
  $('compareBtn').textContent = t('btn.cancelCompare');

  // Run analysis flow with current text + compare on next analyze click
  toast(t('btn.compare'), 'info');
}

// ====================================================================
//  Clear / save / share / export
// ====================================================================

function runClear() {
  if (!state.primaryComposer) return;
  // Only interrupt the user when there is actually something to lose.
  const hasContent = state.primaryComposer.textarea.value.trim().length > 0;
  if (hasContent && !confirmAction('confirm.clearInput')) return;

  state.primaryComposer.textarea.value = '';
  state.primaryComposer.textarea.dispatchEvent(new Event('input'));
  clearInput();
  state.current = null;
  // Also drop compare mode — otherwise the second composer is left on screen
  // with no way to dismiss it once the compare button goes inert.
  resetCompareMode();
  $('results').classList.remove('show');
  /** @type {HTMLButtonElement} */ ($('compareBtn')).disabled = true;
  toast(t('status.cleared'), 'info');
}

function runSaveHistory() {
  if (!state.current) {
    toast(t('status.noAnalysis'), 'error');
    return;
  }
  addToHistory({
    text: state.current.text,
    analyzedAt: state.current.analyzedAt,
    aiScore: state.current.ai.score,
    algorithmScore: state.current.algorithm.score,
    primaryTone: state.current.tone.primary,
    length: state.current.length,
  });
  toast(t('status.saved'), 'success');
  renderHistoryList();
}

function runShareCard() {
  if (!state.current) {
    toast(t('status.noAnalysis'), 'error');
    return;
  }
  try {
    generateShareCard(state.current);
    toast(t('status.cardGenerated'), 'success');
  } catch {
    toast(t('status.noAnalysis'), 'error');
  }
}

function withCurrent(fn) {
  if (!state.current) {
    toast(t('status.noAnalysis'), 'error');
    return;
  }
  fn(state.current);
  toast(t('status.exported'), 'success');
}

// ====================================================================
//  History
// ====================================================================

function renderHistoryList() {
  renderHistory(/** @type {HTMLElement} */ ($('historyList')), loadHistory(), {
    onLoad: (id) => {
      const e = getHistoryEntry(id);
      if (!e || !state.primaryComposer) return;
      state.primaryComposer.textarea.value = e.text;
      state.primaryComposer.textarea.dispatchEvent(new Event('input'));
      runAnalysis();
    },
    onCompare: (id) => {
      const e = getHistoryEntry(id);
      if (!e || !state.current) {
        toast(t('status.noAnalysis'), 'error');
        return;
      }
      state.compareWith = analyzeTweet(e.text);
      renderComparisonView();
    },
    onDelete: (id) => {
      if (!confirmAction('confirm.deleteEntry')) return;
      removeFromHistory(id);
      renderHistoryList();
    },
    onClearAll: () => {
      if (!confirmAction('confirm.clearHistory')) return;
      clearHistory();
      renderHistoryList();
      toast(t('status.historyCleared'), 'info');
    },
  });
}

// ====================================================================
//  Input persistence
// ====================================================================

function handleInputChange() {
  if (state.saveDebounce) clearTimeout(state.saveDebounce);
  state.saveDebounce = setTimeout(() => {
    if (state.primaryComposer) saveInput(state.primaryComposer.textarea.value);
  }, 400);
}

// ====================================================================
//  Init
// ====================================================================

export function init() {
  // Locale + theme preferences
  setLocale(loadLocale());
  applyTheme(loadTheme());

  applyLocale();
  rebuildComposers();
  state.tabs = rebuildTabs();

  // Wire static buttons
  $('analyzeBtn').addEventListener('click', runAnalysis);
  $('clearBtn').addEventListener('click', runClear);
  $('compareBtn').addEventListener('click', toggleCompareMode);
  $('exportTxtBtn').addEventListener('click', () => withCurrent(exportTxt));
  $('exportCsvBtn').addEventListener('click', () => withCurrent(exportCsv));
  $('exportJsonBtn').addEventListener('click', () => withCurrent(exportJson));
  $('shareCardBtn').addEventListener('click', runShareCard);
  $('saveHistoryBtn').addEventListener('click', runSaveHistory);
  $('langBtn').addEventListener('click', toggleLocale);
  $('themeBtn').addEventListener('click', toggleTheme);

  // Restore + render history
  if (loadInput() && state.primaryComposer) {
    toast(t('status.restored'), 'info');
  }
  renderHistoryList();
}

if (typeof window !== 'undefined' && !window.__TWITTER_ANALYZER_TEST__) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
