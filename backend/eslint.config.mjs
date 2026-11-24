// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
  // Quy chuẩn giới hạn số dòng theo từng loại file Backend (mức warn để tách dần file cũ)
  {
    files: ['src/**/*.controller.ts'],
    rules: {
      'max-lines': ['warn', { max: 300, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ['src/**/*.service.ts'],
    rules: {
      'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ['src/**/*.dto.ts'],
    rules: {
      'max-lines': ['warn', { max: 200, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ['src/**/*.util.ts', 'src/**/*.helper.ts', 'src/**/*.mapper.ts'],
    rules: {
      'max-lines': ['warn', { max: 250, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: [
      'src/**/*.guard.ts',
      'src/**/*.strategy.ts',
      'src/**/*.pipe.ts',
      'src/**/*.filter.ts',
      'src/**/*.interceptor.ts',
    ],
    rules: {
      'max-lines': ['warn', { max: 150, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ['src/**/*.decorator.ts'],
    rules: {
      'max-lines': ['warn', { max: 80, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ['src/**/*.module.ts'],
    rules: {
      'max-lines': ['warn', { max: 100, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ['src/**/*.spec.ts', 'test/**/*.ts'],
    rules: {
      'max-lines': ['warn', { max: 600, skipBlankLines: true, skipComments: true }],
    },
  },
);
