import { test, expect } from '@playwright/test'

test.use({ storageState: '.auth/user-a.json' })

test('ログイン済み状態でトップページにアクセスするとログアウトボタンが表示される', async ({ page }) => {
  await page.goto('/chat-role-play')
  await expect(page.getByRole('button', { name: 'ログアウト' })).toBeVisible()
})
