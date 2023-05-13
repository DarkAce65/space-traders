import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react-swc';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const schemaDir = path.join(rootDir, 'generated-schema');

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': schemaDir } },
});
