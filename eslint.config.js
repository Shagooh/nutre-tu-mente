const { defineConfig } = require('eslint/config');
const expo = require('eslint-config-expo/flat');
module.exports = defineConfig([
  expo,
  { ignores: ['.tools/**', 'dist*/**', 'coverage/**', '.agents/**', '.claude/**'] },
  { rules: { 'no-empty': 'error', 'react-hooks/exhaustive-deps': 'error', 'react/no-unescaped-entities': 'off' } },
  { files: ['**/*.test.js', 'tests/**/*.js', 'tests/**/*.cjs'], languageOptions: { globals: { jest: 'readonly', test: 'readonly', expect: 'readonly', describe: 'readonly', beforeEach: 'readonly', afterEach: 'readonly', beforeAll: 'readonly', afterAll: 'readonly' } } },
]);
