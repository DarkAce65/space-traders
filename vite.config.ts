import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const schemaDir = path.join(rootDir, 'generated-schema');

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    checker({
      overlay: { initialIsOpen: false },
      terminal: mode !== 'test',
      typescript: true,
      eslint: { lintCommand: "eslint './src/**/*.{ts,tsx}'" },
    }),
  ],
  resolve: { alias: { '@': schemaDir } },
}));
