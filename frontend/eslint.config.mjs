import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
  // Quy chuẩn giới hạn số dòng theo từng loại file Frontend (mức warn để tách dần file cũ)
  {
    files: ["src/app/**/page.tsx"],
    rules: {
      "max-lines": ["warn", { max: 350, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: [
      "src/app/**/layout.tsx",
      "src/app/**/loading.tsx",
      "src/app/**/error.tsx",
      "src/app/**/not-found.tsx",
    ],
    rules: {
      "max-lines": ["warn", { max: 150, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ["src/components/**/*.{ts,tsx}"],
    rules: {
      "max-lines": ["warn", { max: 350, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ["src/hooks/**/*.{ts,tsx}", "src/queries/**/*.{ts,tsx}"],
    rules: {
      "max-lines": ["warn", { max: 250, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ["src/store/**/*.{ts,tsx}", "src/providers/**/*.{ts,tsx}"],
    rules: {
      "max-lines": ["warn", { max: 200, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: [
      "src/lib/**/*.{ts,tsx}",
      "src/utils/**/*.{ts,tsx}",
      "src/constants/**/*.{ts,tsx}",
    ],
    rules: {
      "max-lines": ["warn", { max: 250, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: [
      "src/**/*.test.{ts,tsx}",
      "src/**/*.spec.{ts,tsx}",
      "e2e/**/*.spec.ts",
    ],
    rules: {
      "max-lines": ["warn", { max: 600, skipBlankLines: true, skipComments: true }],
    },
  },
]);

export default eslintConfig;
