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
    'react/no-unescaped-entities': 'off',
    'indent': ['error', 2, { 'SwitchCase': 1, 'ignoredNodes': ['TemplateLiteral'] }],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    '@typescript-eslint/indent': ['error', 2, {
      'SwitchCase': 1,
      'FunctionDeclaration': { 'parameters': 1, 'body': 1 },
      'FunctionExpression': { 'parameters': 1, 'body': 1 },
      'CallExpression': { 'arguments': 1 },
      'ArrayExpression': 1,
      'ObjectExpression': 1,
      'ImportDeclaration': 1,
      'flatTernaryExpressions': false,
      'ignoreComments': false
    }],
    '@typescript-eslint/no-unused-vars': ['error', { 'ignoreRestSiblings': true }],
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
