import { test, expect, type Page } from '@playwright/test'

// ================================================================
// シナリオ：
//   1. ユーザーAがゲーム作成（キャラチップ利用あり）
//   2. ユーザーAがキャラチップ利用で参加登録・通常発言
//   3. ユーザーAがステータスを「参加者募集中」に変更
//   4. ユーザーBがゲームに参加・通常発言
//   5. ユーザーAがユーザーBの発言にいいねする
//   6. ユーザーBがユーザーAをフォローする
//   7. ユーザーBがユーザーAと自分のダイレクトメッセージグループを作成
//   8. ユーザーBが作成したダイレクトメッセージグループで発言
//   9. ユーザーAがダイレクトメッセージグループの発言を参照
// ================================================================

test('複数ユーザーシナリオ：いいね・フォロー・DMグループ作成・DM発言・DM参照', async ({
  browser
}) => {
  test.setTimeout(120_000)

  const ts = Date.now()
  const gameName = `E2E_DM_${ts}`
  const aNormal = `Aの通常発言_${ts}`
  const bNormal = `Bの通常発言_${ts}`
  const bDirect = `BからAへのDM_${ts}`

  // ============================================================
  // ユーザーA: ゲーム作成 〜 ステータス変更
  // ============================================================
  const ctxA = await browser.newContext({ storageState: '.auth/user-a.json' })
  const pageA = await ctxA.newPage()

  // 1. ゲーム作成
  await pageA.goto('/chat-role-play/create-game')
  await pageA.locator('input[name="name"]').fill(gameName)
  await pageA.locator('.w-64').first().click()
  await pageA.getByText('人狼BBS（', { exact: false }).click()
  await pageA.getByRole('button', { name: '作成' }).click()
  await expect(pageA).toHaveURL(/\/chat-role-play\/games\/\d+/, {
    timeout: 15_000
  })
  const gameId = pageA.url().match(/\/games\/(\d+)/)![1]
  await expect(pageA.locator('h1').filter({ hasText: gameName })).toBeVisible({
    timeout: 10_000
  })

  // 2. ユーザーA: 参加登録（GMでも参加できる）+ 通常発言
  await participateWithCharachip(pageA)
  await expect(
    pageA.locator('nav').locator('a[href*="/profile/"]')
  ).toBeVisible({ timeout: 10_000 })
  await postNormalTalk(pageA, aNormal)
  await expect(pageA.getByText(aNormal).first()).toBeVisible({
    timeout: 10_000
  })

  // 3. ユーザーA: ステータスを「参加者募集中」に変更
  await changeGameStatusToRecruiting(pageA)

  // ============================================================
  // ユーザーB: 参加 → 発言
  // ============================================================
  const ctxB = await browser.newContext({ storageState: '.auth/user-b.json' })
  const pageB = await ctxB.newPage()

  // 4. ユーザーB: ゲーム一覧から遷移して参加・発言
  await pageB.goto('/chat-role-play/games')
  await pageB
    .getByRole('link', { name: new RegExp(gameName) })
    .first()
    .click()
  await expect(pageB).toHaveURL(new RegExp(`/chat-role-play/games/${gameId}`))
  await participateWithCharachip(pageB)
  await expect(
    pageB.locator('nav').locator('a[href*="/profile/"]')
  ).toBeVisible({ timeout: 10_000 })
  await postNormalTalk(pageB, bNormal)
  await expect(pageB.getByText(bNormal).first()).toBeVisible({
    timeout: 10_000
  })

  // ============================================================
  // 5. ユーザーA: ユーザーBの発言にいいね
  // ============================================================
  await pageA.reload()
  await pageA.waitForLoadState('networkidle')
  await expect(
    pageA.locator('#message-area-home').getByText(bNormal).first()
  ).toBeVisible({ timeout: 10_000 })
  await favoriteMessage(pageA, bNormal)

  // ============================================================
  // 6. ユーザーB: ユーザーAをフォロー
  // ============================================================
  await followCharacterFromMessage(pageB, aNormal)
  // フォロー後、ゲーム本編に戻る
  await pageB.goto(`/chat-role-play/games/${gameId}`)
  await expect(pageB.locator('h1').filter({ hasText: gameName })).toBeVisible({
    timeout: 10_000
  })

  // ============================================================
  // 7. ユーザーB: ユーザーAとのDMグループ作成
  // ============================================================
  await openDirectMessageTab(pageB)
  const dmAreaB = pageB.locator('#direct-message-area')
  await dmAreaB.getByRole('button', { name: 'グループ作成' }).click()
  const createDialog = pageB.getByRole('dialog')
  await expect(createDialog).toBeVisible()
  // グループに含めるメンバー選択（自分以外＝Aのみ。先頭のlabelを選択）
  await createDialog.locator('label').first().click()
  await createDialog.getByRole('button', { name: '作成' }).click()
  // モーダルが閉じてグループが一覧に出るまで待つ
  await expect(createDialog).not.toBeVisible()
  const groupButtonB = dmAreaB.locator('div.base-border button').first()
  await expect(groupButtonB).toBeVisible({ timeout: 10_000 })

  // ============================================================
  // 8. ユーザーB: DMグループで発言
  // ============================================================
  await groupButtonB.click()
  await expect(
    dmAreaB.getByRole('heading').or(dmAreaB.getByText('メンバー:'))
  ).toBeVisible({ timeout: 10_000 })
  await postDirectMessage(pageB, bDirect)
  await expect(pageB.getByText(bDirect).first()).toBeVisible({
    timeout: 10_000
  })

  // ============================================================
  // 9. ユーザーA: DMグループの発言を参照
  // ============================================================
  await pageA.reload()
  await pageA.waitForLoadState('networkidle')
  await openDirectMessageTab(pageA)
  const dmAreaA = pageA.locator('#direct-message-area')
  const groupButtonA = dmAreaA.locator('div.base-border button').first()
  await expect(groupButtonA).toBeVisible({ timeout: 10_000 })
  await groupButtonA.click()
  await expect(dmAreaA.getByText(bDirect).first()).toBeVisible({
    timeout: 10_000
  })
})

// ================================================================
// helpers
// ================================================================

async function participateWithCharachip(page: Page): Promise<void> {
  await page.locator('nav').getByRole('button', { name: '参加登録' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog.locator('#term-check').check()
  await dialog.locator('#policy-check').check()
  await dialog
    .locator('label')
    .filter({ hasText: 'キャラチップ利用' })
    .last()
    .click()
  await dialog.getByRole('button', { name: '選択' }).click()
  const charaDialog = page.getByRole('dialog').last()
  await charaDialog.locator('button').first().click()
  await dialog.locator('input[type="submit"][value="参加登録"]').click()
  await page.waitForLoadState('networkidle')
}

async function openTalkPanel(page: Page): Promise<void> {
  const talkArea = page.locator('#talk-area-home')
  const summary = talkArea
    .locator('summary')
    .filter({ has: page.locator('div.text-lg', { hasText: /^発言$/ }) })
    .first()
  const details = summary.locator('xpath=..')
  const isOpen = await details.evaluate((el) => (el as HTMLDetailsElement).open)
  if (!isOpen) {
    await summary.click()
  }
}

async function postNormalTalk(page: Page, text: string): Promise<void> {
  await openTalkPanel(page)
  const talkMessageTextarea = page.locator('#talk-area-home-talk-message')
  await talkMessageTextarea.fill(text)
  const form = talkMessageTextarea.locator('xpath=ancestor::form')
  await form.locator('input[type="submit"][value="プレビュー"]').click()
  await page.getByRole('button', { name: '発言する' }).first().click()
}

async function changeGameStatusToRecruiting(page: Page): Promise<void> {
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
  await page.getByRole('option', { name: '参加者募集中' }).click()
  await dialog.locator('input[type="submit"][value="更新"]').first().click()
  await page.waitForLoadState('networkidle')
}

async function favoriteMessage(page: Page, targetText: string): Promise<void> {
  // 対象メッセージ要素を特定し、ふぁぼ用ボタン群（div.ml-8 内）の最初のボタン（StarIcon）をクリック
  const messageContainer = page
    .locator('#message-area-home div.w-full')
    .filter({ hasText: targetText })
    .first()
  const favButton = messageContainer.locator('div.ml-8 button').first()
  await favButton.click()
  // ふぁぼ後はカウント表示ボタン（テキスト "1"）が現れる
  await expect(messageContainer.locator('div.ml-8 button').nth(1)).toHaveText(
    '1',
    { timeout: 10_000 }
  )
}

async function followCharacterFromMessage(
  page: Page,
  targetText: string
): Promise<void> {
  // 対象メッセージから sender link の href を取得し、同一ページでプロフィールへ遷移
  // (sender link は target='_blank' なので click ではなく href で遷移する)
  const profileLink = page
    .locator('#message-area-home div.w-full')
    .filter({ hasText: targetText })
    .first()
    .locator('a[href*="/profile/"]')
    .first()
  const href = await profileLink.getAttribute('href')
  if (!href) throw new Error(`profile link for "${targetText}" not found`)
  await page.goto(href)
  await page.getByRole('button', { name: 'フォロー' }).click()
  // フォロー後はボタンが「フォロー解除」に切り替わる
  await expect(page.getByRole('button', { name: 'フォロー解除' })).toBeVisible({
    timeout: 10_000
  })
}

async function openDirectMessageTab(page: Page): Promise<void> {
  // デスクトップ表示の上部メニューにある「ダイレクトメッセージ」タブを開く
  await page
    .getByRole('button', { name: /ダイレクトメッセージ/ })
    .first()
    .click()
}

async function postDirectMessage(page: Page, text: string): Promise<void> {
  // DM 用の talk panel は default open。textarea の id は form field 名のまま `talkMessage`
  const dmTextarea = page.locator('#talkMessage')
  await dmTextarea.fill(text)
  const form = dmTextarea.locator('xpath=ancestor::form')
  await form.locator('input[type="submit"][value="プレビュー"]').click()
  await page.getByRole('button', { name: '発言する' }).first().click()
}
