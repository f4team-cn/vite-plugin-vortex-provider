import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      outDir: 'dist',
      compilerOptions: {
        declaration: true,
        declarationMap: true,
      },
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      fileName: 'vite-plugin-vortex-provider',
      name: 'vortexProviderVitePlugin',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vite', 'archiver', 'node:fs', 'node:path', 'node:fs/promises'],
    },
  },
});
