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

test('ゲーム設定変更で人数を変更できる', async ({ page }) => {
  const gameName = `E2Eテスト_${Date.now()}`

  await page.goto('/chat-role-play/create-game')
  await page.locator('input[name="name"]').fill(gameName)
  const charachipContainer = page.locator('.w-64').first()
  await charachipContainer.click()
  await page.getByText('人狼BBS（', { exact: false }).click()
  await page.getByRole('button', { name: '作成' }).click()
  await expect(page).toHaveURL(/\/chat-role-play\/games\/\d+/, { timeout: 15000 })
  await expect(page.locator('h1').filter({ hasText: gameName })).toBeVisible({
    timeout: 10000
  })

  await page
    .locator('nav')
    .getByRole('button', { name: 'ゲーム設定変更' })
    .click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  // 両方の入力欄を編集し、桁数の異なる値でも大小比較が正しく行われることを確認する
  await dialog.locator('input[name="capacityMin"]').fill('2')
  await dialog.locator('input[name="capacityMax"]').fill('10')
  await dialog.locator('input[type="submit"][value="更新"]').click()
  await expect(dialog.getByText('最少人数以上にしてください')).toHaveCount(0)
  await expect(dialog).toBeHidden({ timeout: 15000 })
  await page.waitForLoadState('networkidle')

  // 更新後の設定に反映されている
  await page
    .locator('nav')
    .getByRole('button', { name: 'ゲーム設定', exact: true })
    .click()
  await expect(page.getByRole('dialog').getByText('2 - 10人')).toBeVisible({
    timeout: 10000
  })
  await page.keyboard.press('Escape')
  await page.goto(page.url())

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
