import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/e2e',
  baseURL: 'http://localhost:4200',
  timeout: 30000, // 30 seconds
  webServer: {
    command: 'npx nx serve gym-web-app --host=127.0.0.1',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
