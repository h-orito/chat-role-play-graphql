import { test, expect } from '@playwright/test'

test.use({ storageState: '.auth/user-a.json' })

test('ゲーム作成画面でキャラチップを選択してゲームを作成できる', async ({ page }) => {
  const gameName = `E2Eテスト_${Date.now()}`

  await page.goto('/chat-role-play/create-game')

  await page.locator('input[name="name"]').fill(gameName)

  // キャラチップを選択（react-select）
  const charachipContainer = page.locator('.w-64').first()
  await charachipContainer.click()
  await page.getByText('人狼BBS（', { exact: false }).click()

  await page.getByRole('button', { name: '作成' }).click()

  // ゲームページへリダイレクト
  await expect(page).toHaveURL(/\/chat-role-play\/games\/\d+/, { timeout: 15000 })

  // サイドバーh1にゲーム名が表示される
  await expect(page.locator('h1').filter({ hasText: gameName })).toBeVisible({
    timeout: 10000
  })
})
