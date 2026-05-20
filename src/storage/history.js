// @ts-check

const HISTORY_KEY = 'twitter-analyzer:history';
const MAX_ITEMS = 20;

/**
 * @typedef {Object} HistoryEntry
 * @property {string} id                   unique id (timestamp-based)
 * @property {string} text                 tweet text
 * @property {string} analyzedAt           ISO timestamp
 * @property {number} aiScore
 * @property {number} algorithmScore
 * @property {string} primaryTone
 * @property {number} length
 */

/**
 * Load full history (newest first).
 * @returns {HistoryEntry[]}
 */
export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Persist history.
 * @param {HistoryEntry[]} entries
 */
function save(entries) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch {
    // quota or private mode — ignore
  }
}

/**
 * Push a new entry (deduplicated by text); keep newest MAX_ITEMS.
 * @param {Omit<HistoryEntry, 'id'>} entry
 * @returns {HistoryEntry}
 */
export function addToHistory(entry) {
  const all = loadHistory();
  const filtered = all.filter((e) => e.text !== entry.text);
  const id = `h_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const next = [{ id, ...entry }, ...filtered].slice(0, MAX_ITEMS);
  save(next);
  return next[0];
}

/**
 * Remove a single entry by id.
 * @param {string} id
 */
export function removeFromHistory(id) {
  save(loadHistory().filter((e) => e.id !== id));
}

/**
 * Clear all history.
 */
export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // ignore
  }
}

/**
 * Look up a single entry by id.
 * @param {string} id
 * @returns {HistoryEntry | null}
 */
export function getHistoryEntry(id) {
  return loadHistory().find((e) => e.id === id) ?? null;
}
