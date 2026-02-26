// eslint.config.js
import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: ['**/*.ts', '**/*.tsx'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: true,
      tsconfigRootDir: './',
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
});
