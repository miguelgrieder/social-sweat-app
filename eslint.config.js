const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const prettier = require('eslint-config-prettier');
const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptParser,
    },
    plugins: {
      react,
      '@typescript-eslint': typescript,
    },
    rules: {
      'react/function-component-definition': 'off',
      'no-param-reassign': 'off',
      'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
      'no-use-before-define': ['error', { variables: false }],
      'react/prop-types': ['error', { ignore: ['navigation', 'navigation.navigate'] }],
      'max-lines': ['error', { max: 1000 }],
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Example TypeScript rule
      // Add more TypeScript-specific rules here
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    ignores: ['node_modules/', 'build/*.js', 'config/*.js', 'coverage/*.js', 'coverage/*', 'jest/*.js', '__tests__/*', '__tests__/*.js'],
  },
  prettier,
];
