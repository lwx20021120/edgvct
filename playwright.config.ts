import { defineConfig } from 'playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 120_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: 'https://supabase.com',
    headless: false,
    viewport: { width: 1440, height: 900 },
    actionTimeout: 15_000,
  },
})
