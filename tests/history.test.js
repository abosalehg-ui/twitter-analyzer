// @ts-check

import { describe, it, expect, beforeEach } from 'vitest';
import {
  addToHistory,
  loadHistory,
  removeFromHistory,
  clearHistory,
  getHistoryEntry,
} from '../src/storage/history.js';

const sample = () => ({
  text: 'hello tweet ' + Math.random(),
  analyzedAt: new Date().toISOString(),
  aiScore: 25,
  algorithmScore: 70,
  primaryTone: 'friendly',
  length: 12,
});

describe('history storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts empty', () => {
    expect(loadHistory()).toEqual([]);
  });

  it('adds an entry and returns it with an id', () => {
    const entry = addToHistory(sample());
    expect(entry.id).toMatch(/^h_/);
    const all = loadHistory();
    expect(all.length).toBe(1);
    expect(all[0].id).toBe(entry.id);
  });

  it('keeps newest first', () => {
    const a = addToHistory({ ...sample(), text: 'first' });
    const b = addToHistory({ ...sample(), text: 'second' });
    const all = loadHistory();
    expect(all[0].id).toBe(b.id);
    expect(all[1].id).toBe(a.id);
  });

  it('deduplicates by text — same text moves to top', () => {
    addToHistory({ ...sample(), text: 'unique-text' });
    addToHistory({ ...sample(), text: 'another' });
    addToHistory({ ...sample(), text: 'unique-text' });
    const all = loadHistory();
    expect(all.length).toBe(2);
    expect(all[0].text).toBe('unique-text');
  });

  it('caps at 20 items', () => {
    for (let i = 0; i < 25; i++) {
      addToHistory({ ...sample(), text: `t-${i}` });
    }
    expect(loadHistory().length).toBe(20);
  });

  it('removeFromHistory removes a single entry', () => {
    const a = addToHistory({ ...sample(), text: 'A' });
    addToHistory({ ...sample(), text: 'B' });
    removeFromHistory(a.id);
    expect(loadHistory().some((e) => e.id === a.id)).toBe(false);
    expect(loadHistory().length).toBe(1);
  });

  it('clearHistory wipes everything', () => {
    addToHistory(sample());
    addToHistory(sample());
    clearHistory();
    expect(loadHistory()).toEqual([]);
  });

  it('getHistoryEntry returns matching entry or null', () => {
    const a = addToHistory(sample());
    expect(getHistoryEntry(a.id)?.id).toBe(a.id);
    expect(getHistoryEntry('nonexistent')).toBeNull();
  });

  it('handles corrupted JSON gracefully', () => {
    localStorage.setItem('twitter-analyzer:history', 'not-valid-json');
    expect(loadHistory()).toEqual([]);
  });
});
