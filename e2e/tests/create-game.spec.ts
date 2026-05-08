import { test, expect, type Page } from '@playwright/test'

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

  // 最後にステータスを「終了」に変更
  await changeGameStatusToFinished(page)
})

async function changeGameStatusToFinished(page: Page): Promise<void> {
  await page
    .locator('nav')
    .getByRole('button', { name: 'ステータス・期間変更' })
    .click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog
    .locator('.css-13cymwt-control, [class*="control"]')
    .first()
    .click()
  await page.getByRole('option', { name: '終了' }).click()
  await dialog.locator('input[type="submit"][value="更新"]').first().click()
  await page.waitForLoadState('networkidle')
}
