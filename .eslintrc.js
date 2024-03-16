module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
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
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off"
  },
  env: {
    'react-native/react-native': true,
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
};
