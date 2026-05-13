import { test, expect, type Page } from '@playwright/test'

// ================================================================
// 大きめのシナリオテスト：
//   1. ユーザーAがゲーム作成（キャラチップ利用あり）
//   2. ユーザーAがキャラチップ利用で参加登録
//   3. ユーザーAが通常発言
//   4. ユーザーAがト書きで発言
//   5. ユーザーAがステータスを「参加者募集中」に変更
//   6. ユーザーBがトップページ→ゲーム一覧経由でゲーム1へ遷移
//   7. ユーザーBがキャラチップ利用で参加登録
//   8. ユーザーBが通常発言
//   9. ユーザーBがユーザーAの通常発言にリプライ
//  10. ユーザーBがユーザーAに秘話送信
//  11. ユーザーAが発言抽出（キーワード絞り込み→リセットで再抽出）を確認
//  12. ユーザーAが自分宛タブで秘話を確認
//  13. ユーザーAがゲームのステータスを「終了」に変更
// ================================================================

test('複数ユーザーシナリオ：ゲーム作成・参加・発言・リプライ・秘話', async ({
  browser
}) => {
  test.setTimeout(120_000)

  const ts = Date.now()
  const gameName = `E2Eテスト_${ts}`
  const aNormal = `Aの通常発言_${ts}`
  const aDescription = `Aのト書き_${ts}`
  const bNormal = `Bの通常発言_${ts}`
  const bReply = `BからAへリプライ_${ts}`
  const bSecret = `BからAへの秘話_${ts}`

  // ============================================================
  // ユーザーA: ゲーム作成 〜 ステータス変更
  // ============================================================
  const ctxA = await browser.newContext({ storageState: '.auth/user-a.json' })
  const pageA = await ctxA.newPage()

  // 1. ゲーム作成
  await pageA.goto('/chat-role-play/create-game')
  await pageA.locator('input[name="name"]').fill(gameName)
  // キャラチップ選択（react-select）
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

  // 2. ユーザーA: 参加登録（キャラチップ利用、最初のキャラ）
  await participateWithCharachip(pageA)
  // 参加後はリロードされ、参加登録パネルが消えてプロフィールリンクが出る
  await expect(
    pageA.locator('nav').locator('a[href*="/profile/"]')
  ).toBeVisible({ timeout: 10_000 })

  // 3. ユーザーA: 通常発言
  await postNormalTalk(pageA, aNormal)
  await expect(pageA.getByText(aNormal).first()).toBeVisible({
    timeout: 10_000
  })

  // 4. ユーザーA: ト書き
  await postDescription(pageA, aDescription)
  await expect(pageA.getByText(aDescription).first()).toBeVisible({
    timeout: 10_000
  })

  // 5. ユーザーA: ステータスを「参加者募集中」に変更
  await changeGameStatusToRecruiting(pageA)

  // ============================================================
  // ユーザーB: トップページ経由でゲームに遷移し、参加・発言・リプライ・秘話
  // ============================================================
  const ctxB = await browser.newContext({ storageState: '.auth/user-b.json' })
  const pageB = await ctxB.newPage()

  // 6. ユーザーB: ゲーム一覧でゲームを見つけて遷移
  await pageB.goto('/chat-role-play/games')
  await pageB
    .getByRole('link', { name: new RegExp(gameName) })
    .first()
    .click()
  await expect(pageB).toHaveURL(new RegExp(`/chat-role-play/games/${gameId}`))
  await expect(pageB.locator('h1').filter({ hasText: gameName })).toBeVisible({
    timeout: 10_000
  })

  // 7. ユーザーB: 参加登録
  await participateWithCharachip(pageB)
  await expect(
    pageB.locator('nav').locator('a[href*="/profile/"]')
  ).toBeVisible({ timeout: 10_000 })

  // 8. ユーザーB: 通常発言
  await postNormalTalk(pageB, bNormal)
  await expect(pageB.getByText(bNormal).first()).toBeVisible({
    timeout: 10_000
  })

  // 9. ユーザーB: ユーザーAの通常発言にリプライ
  await replyToTalk(pageB, aNormal, bReply)
  await expect(pageB.getByText(bReply).first()).toBeVisible({
    timeout: 10_000
  })

  // 10. ユーザーB: ユーザーAに秘話送信（参加者は2名なので相手は自動的にA）
  await postSecretTalk(pageB, bSecret)

  // ============================================================
  // 11. ユーザーA: 発言抽出（キーワード絞り込み→リセットで再抽出）を確認
  // ============================================================
  await pageA.reload()
  await pageA.waitForURL(/\/chat-role-play\/games\/\d+/)
  await expect(pageA.locator('h1').filter({ hasText: gameName })).toBeVisible({
    timeout: 10_000
  })
  // 抽出前は home に A/B 両方の通常発言が見える
  await expect(
    pageA.locator('#message-area-home').getByText(aNormal, { exact: true })
  ).toBeVisible({ timeout: 10_000 })
  await expect(
    pageA.locator('#message-area-home').getByText(bNormal, { exact: true })
  ).toBeVisible({ timeout: 10_000 })

  // キーワード「Aの通常発言」で絞り込み → A のみ残り B は消える
  await searchMessageByKeyword(pageA, 'Aの通常発言')
  await expect(
    pageA.locator('#message-area-home').getByText(aNormal, { exact: true })
  ).toBeVisible({ timeout: 10_000 })
  await expect(
    pageA.locator('#message-area-home').getByText(bNormal, { exact: true })
  ).toHaveCount(0)

  // リセット押下（confirm を accept）→ モーダル閉じる、再抽出されて B が再表示
  await resetMessageFilter(pageA)
  await expect(pageA.getByRole('dialog')).toHaveCount(0)
  await expect(
    pageA.locator('#message-area-home').getByText(bNormal, { exact: true })
  ).toBeVisible({ timeout: 10_000 })

  // ============================================================
  // 12. ユーザーA: 自分宛タブで秘話を確認
  // ============================================================
  // 自分宛タブに切り替え、tome側メッセージエリアで秘話を確認
  await pageA
    .getByRole('button', { name: /自分宛/ })
    .first()
    .click()
  await expect(
    pageA.locator('#message-area-tome').getByText(bSecret)
  ).toBeVisible({ timeout: 10_000 })

  // 13. ユーザーA: ステータスを「終了」に変更
  await changeGameStatusToFinished(pageA)
})

// ================================================================
// helpers
// ================================================================

async function participateWithCharachip(page: Page): Promise<void> {
  // メッセージエリアの「参加登録」パネル内ボタン（モーダル外）
  await page.getByRole('button', { name: '参加登録する' }).first().click()
  // モーダル内の操作
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog.locator('#term-check').check()
  await dialog.locator('#policy-check').check()
  // 「キャラチップ利用」ラジオを選択
  await dialog
    .locator('label')
    .filter({ hasText: 'キャラチップ利用' })
    .last()
    .click()
  // 「選択」ボタン → キャラ選択モーダル
  await dialog.getByRole('button', { name: '選択' }).click()
  // キャラ選択モーダル（複数 dialog があるので最後）
  const charaDialog = page.getByRole('dialog').last()
  await charaDialog.locator('button').first().click()
  // submit ボタン（input[type=submit][value=参加登録]）
  await dialog.locator('input[type="submit"][value="参加登録"]').click()
  // ページがリロードされ、URLは同じ
  await page.waitForLoadState('networkidle')
}

async function openTalkPanel(page: Page): Promise<void> {
  // home タブ側の「発言」パネルを開く（atom のため home/tome 共通だが home のみ操作）
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
  // 発言フォーム内のプレビュー → 発言する
  const form = talkMessageTextarea.locator('xpath=ancestor::form')
  await form.locator('input[type="submit"][value="プレビュー"]').click()
  await page.getByRole('button', { name: '発言する' }).first().click()
}

async function postDescription(page: Page, text: string): Promise<void> {
  // ト書きパネルは default open。home タブ側を指定（tome タブにも同じ id-prefixで生える）
  const descTextarea = page.locator('#talk-area-home-description-message')
  await descTextarea.fill(text)
  // ト書きフォーム内のプレビューボタン
  await descTextarea
    .locator('xpath=ancestor::form')
    .locator('input[type="submit"][value="プレビュー"]')
    .click()
  await page.getByRole('button', { name: '発言する' }).first().click()
}

async function changeGameStatusToRecruiting(page: Page): Promise<void> {
  await changeGameStatus(page, '参加者募集中')
}

async function changeGameStatusToFinished(page: Page): Promise<void> {
  await changeGameStatus(page, '終了')
}

async function changeGameStatus(page: Page, statusName: string): Promise<void> {
  await page
    .locator('nav')
    .getByRole('button', { name: 'ステータス・期間変更' })
    .click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  // ステータスselect（react-select）
  // 1番目のreact-selectがステータス
  await dialog
    .locator('.css-13cymwt-control, [class*="control"]')
    .first()
    .click()
  await page.getByRole('option', { name: statusName }).click()
  // 「更新」ボタン（最初のフォームのsubmit）
  await dialog.locator('input[type="submit"][value="更新"]').first().click()
  // page reload される
  await page.waitForLoadState('networkidle')
}

async function replyToTalk(
  page: Page,
  targetText: string,
  replyText: string
): Promise<void> {
  // home タブのメッセージエリアで targetText のメッセージを探し、その中のリプライボタンを押す
  const messageContainer = page
    .locator('#message-area-home div.w-full')
    .filter({ hasText: targetText })
    .first()
  // リプライアイコンボタンは ChatBubble アイコンを持つ最初のボタン
  await messageContainer.locator('button').first().click()
  // 自動的にtalkPanelが開き、receiverもtalkTypeも設定される（リプライ元が通常なら通常のまま）
  const talkMessageTextarea = page.locator('#talk-area-home-talk-message')
  await talkMessageTextarea.fill(replyText)
  const form = talkMessageTextarea.locator('xpath=ancestor::form')
  await form.locator('input[type="submit"][value="プレビュー"]').click()
  await page.getByRole('button', { name: '発言する' }).first().click()
}

async function openMessageFilterModal(page: Page): Promise<void> {
  // home の MessageArea は #message-area-home の親 div 配下にフッターメニューを持つ。
  // tome 側は searchable=false なのでフィルタボタンが生えないが、念のため home に scope。
  await page
    .locator('#message-area-home')
    .locator('xpath=..')
    .getByRole('button', { name: '発言抽出' })
    .click()
  await expect(page.getByRole('dialog')).toBeVisible()
}

async function searchMessageByKeyword(
  page: Page,
  keyword: string
): Promise<void> {
  await openMessageFilterModal(page)
  const dialog = page.getByRole('dialog')
  await dialog
    .locator('input[placeholder="スペース区切りでOR検索"]')
    .fill(keyword)
  // 「検索（別タブ）」と区別するため exact: true
  await dialog.getByRole('button', { name: '検索', exact: true }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
}

async function resetMessageFilter(page: Page): Promise<void> {
  await openMessageFilterModal(page)
  // window.confirm を accept（page.on('dialog') の dialog はネイティブダイアログ。
  // 上で扱う getByRole('dialog') の React モーダルとは別物なので nativeDialog と命名）
  page.once('dialog', (nativeDialog) => nativeDialog.accept())
  await page.getByRole('dialog').getByRole('button', { name: 'リセット' }).click()
}

async function postSecretTalk(page: Page, text: string): Promise<void> {
  await openTalkPanel(page)
  const talkMessageTextarea = page.locator('#talk-area-home-talk-message')
  const form = talkMessageTextarea.locator('xpath=ancestor::form')
  // 発言種別「秘話」を選択
  await form
    .locator('label')
    .filter({ hasText: /^秘話$/ })
    .first()
    .click()
  // 秘話送信先「選択」ボタン → 参加者選択モーダル
  await form.getByRole('button', { name: '選択' }).click()
  // 受信者選択モーダル → 唯一の参加者（A）を選択
  const dialog = page.getByRole('dialog').last()
  await dialog.locator('label').first().click()
  // 本文入力
  await talkMessageTextarea.fill(text)
  await form.locator('input[type="submit"][value="プレビュー"]').click()
  await page.getByRole('button', { name: '発言する' }).first().click()
}
