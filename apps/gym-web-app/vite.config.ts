import { replaceFiles } from '@nx/vite/plugins/rollup-replace-files.plugin';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/gym-web-app',

  server: {
    port: 4200, // port exposed by vite
    host: '0.0.0.0',
    hmr: {
      host: 'localhost', // The hostname where the frontend is accessed
      port: 80,          // The port exposed by Nginx
      protocol: 'ws',    // Use 'wss' if using HTTPS
    },
    watch: {
      usePolling: true,  // Necessary for file changes to be detected in Docker
    },
  },

  preview: {
    port: 4300,
    host: '0.0.0.0',
  },

  plugins: [
    replaceFiles([
      {
        replace: './environments/environment.ts',
        with: './environments/environment.prod.ts',
      },
    ]),
    react(),
    nxViteTsPaths(),
    sentryVitePlugin({
      org: 'thomfilgcom',
      project: 'javascript-react',
    }),
  ],

  test: {
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/gym-web-app',
      provider: 'v8',
    },
    globals: true,
    cache: { dir: '../../node_modules/.vitest' },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },

  build: {
    outDir: '../../dist/apps/gym-web-app',
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },
    sourcemap: true,
  },
});
