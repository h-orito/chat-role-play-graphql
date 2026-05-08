import { defineConfig, devices } from '@playwright/test'
import { FRONTEND_PORT, BACKEND_PORT } from './config'

// E2E では HMR の stale chunks を避けるため、本来の dev server (3000) とは別ポートで毎回 fresh に立ち上げる

export default defineConfig({
  testDir: './tests',
  globalSetup: './global-setup.ts',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${FRONTEND_PORT}`,
    trace: 'on-first-retry',
    // next dev は初回アクセス時にルートを lazy compile するため、cold start 用に余裕を持たせる
    navigationTimeout: 60_000,
    actionTimeout: 30_000
  },
  webServer: [
    {
      command: `pnpm exec next dev -p ${FRONTEND_PORT}`,
      cwd: '../frontend',
      url: `http://localhost:${FRONTEND_PORT}/chat-role-play`,
      reuseExistingServer: false,
      timeout: 120 * 1000
    },
    {
      command: 'go run main.go',
      cwd: '../backend',
      url: `http://localhost:${BACKEND_PORT}/crp-server/`,
      reuseExistingServer: true,
      timeout: 120 * 1000
    }
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
