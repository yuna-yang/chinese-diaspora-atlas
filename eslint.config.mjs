import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
export default defineConfig([
  ...tseslint.configs.recommended,
  {
    files: ['website/src/**/*.tsx', 'website/src/**/*.ts'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
  globalIgnores([
    'website/.next/**',
    'website/out/**',
    'website/next-env.d.ts',
    '.superpowers/**',
    '.playwright-mcp/**',
    'playwright-report/**',
    'test-results/**',
    'scripts/lib/schema.generated.ts',
    'scripts/lib/relationship-schema.generated.ts',
  ]),
]);
