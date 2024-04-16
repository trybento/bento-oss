module.exports = {
  parser: '@typescript-eslint/parser',
  // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2021,
    // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:storybook/recommended',
  ],
  plugins: ['@typescript-eslint', 'react', 'jest'],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",

    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'jest/no-focused-tests': 'error',
    'no-console': 'error',
    'no-undef': 'error',
  },
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  globals: {
    WindowEventMap: true,
    HTMLElementEventMap: true,
    DocumentEventMap: true,
    AddEventListenerOptions: true,
    RequestInit: true,
  },
};
