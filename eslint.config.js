// Browser globals used by the shipped app (src/).
const browserGlobals = {
  window: 'readonly',
  document: 'readonly',
  console: 'readonly',
  Blob: 'readonly',
  URL: 'readonly',
  localStorage: 'readonly',
  navigator: 'readonly',
  alert: 'readonly',
  confirm: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
  HTMLElement: 'readonly',
  HTMLTextAreaElement: 'readonly',
  HTMLButtonElement: 'readonly',
  Node: 'readonly',
  SVGElement: 'readonly',
  Event: 'readonly',
  KeyboardEvent: 'readonly',
  CanvasRenderingContext2D: 'readonly',
};

const sharedRules = {
  'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  'no-undef': 'error',
  'prefer-const': 'warn',
  eqeqeq: ['error', 'always'],
};

export default [
  {
    // Application code runs in the browser only — Node globals must NOT resolve
    // here, so an accidental `__dirname` in src/ is caught by no-undef.
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: browserGlobals,
    },
    rules: sharedRules,
  },
  {
    // Tests run in Node (vitest) against a jsdom DOM, so both sets apply.
    files: ['tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...browserGlobals,
        __dirname: 'readonly',
        process: 'readonly',
      },
    },
    rules: sharedRules,
  },
];
