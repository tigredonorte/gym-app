import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e', // Set the directory for test files
  projects: [
    {
      name: 'auth-web',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm nx serve gym-web-app', // Command to run the server
    port: 4200, // Port where the app will be served
  },
});