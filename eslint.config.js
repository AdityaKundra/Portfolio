import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'dist-ssr'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [reactHooks.configs['recommended-latest']],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ['src/**/*.tsx'],
    ignores: ['src/entry-server.tsx', 'src/main.tsx', '**/*.test.tsx'],
    extends: [reactRefresh.configs.vite],
  },
  { files: ['scripts/**/*.mjs'], languageOptions: { globals: globals.node } },
)
