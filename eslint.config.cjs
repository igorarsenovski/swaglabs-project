const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const playwright = require('eslint-plugin-playwright');

module.exports = [
  {
    ignores: ['node_modules/', 'allure-report/', 'playwright-report/', 'dist/', 'coverage/'],
  },
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  playwright.configs['flat/recommended'],
  {
    files: ['tests/**/*.ts'],
    rules: {
      'playwright/expect-expect': 'off',
    },
  },
];
