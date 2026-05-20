// @ts-check

import { describe, it, expect, beforeEach } from 'vitest';
import { saveInput, loadInput, clearInput } from '../src/storage/local.js';

describe('storage/local', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and loads text', () => {
    saveInput('hello world');
    expect(loadInput()).toBe('hello world');
  });

  it('returns empty string when nothing saved', () => {
    expect(loadInput()).toBe('');
  });

  it('removes saved input on empty string', () => {
    saveInput('something');
    saveInput('');
    expect(loadInput()).toBe('');
  });

  it('removes saved input on whitespace-only string', () => {
    saveInput('something');
    saveInput('   \n  ');
    expect(loadInput()).toBe('');
  });

  it('clearInput wipes the entry', () => {
    saveInput('keep me');
    clearInput();
    expect(loadInput()).toBe('');
  });

  it('preserves multi-line content including unicode', () => {
    const tweets = 'أحب البرمجة 😍\n@محمد شكراً\n#تطوير';
    saveInput(tweets);
    expect(loadInput()).toBe(tweets);
  });
});
