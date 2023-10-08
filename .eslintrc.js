module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react',
    'react-native',
    'prettier'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'prettier',
  ],
  rules: {
    'react-native/no-raw-text': 0,
    'react-native/split-platform-components': 0,
    'prettier/prettier': 'error',
  },
  env: {
    'react-native/react-native': true,
  },
};