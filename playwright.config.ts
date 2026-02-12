import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  use: {
    baseURL: 'https://tfl.gov.uk',
    headless: true,
    screenshot: 'only-on-failure',   // capture screen shot when test is failed
    trace: 'on-first-retry',         
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  reporter: [['html', { open: 'on-failure' }]],
});
