module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  plugins: ['@typescript-eslint', 'react', 'react-native'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
  ],
  rules: {
    'react-native/no-raw-text': 0,
    'react-native/split-platform-components': 0,
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'indent': ['error', 2, { 'SwitchCase': 1, 'ignoredNodes': ['TemplateLiteral'] }],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-tabs': ['error'],
    '@typescript-eslint/indent': ['error', 2],
    'no-trailing-spaces': ['error']
  },
  env: {
    'react-native/react-native': true,
  },
  'settings': {
    'react': {
      'version': 'detect'
    }
  }
};
