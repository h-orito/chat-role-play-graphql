---
name: e2e
description: chat-role-play-graphql プロジェクトのE2Eテスト（Playwright）を実行・追加・修正するためのガイド。Auth0認証のheadlessセットアップ、モーダル操作、発言/参加登録/秘話などの既知パターンを含む。e2e/ディレクトリ配下のテストを扱う際に使用する。
---

# E2E test guide for chat-role-play-graphql

Playwright + Chromium のE2Eテスト一式は `e2e/` 配下にある。ローカル実行のみ（CI未対応）。

## ディレクトリ構成

```
e2e/
  global-setup.ts      # Auth0 ROPGでアクセストークン取得→storageStateを2ユーザー分作る
  playwright.config.ts # baseURL=http://localhost:3000, workers=1, fullyParallel=false
  tsconfig.json
  package.json         # pnpm
  .env.e2e             # Auth0設定とテストユーザー認証情報（gitignore）
  .auth/               # 自動生成されるstorageState（gitignore）
  tests/
    auth.spec.ts          # 認証済み状態の確認
    create-game.spec.ts   # ゲーム作成
    game-flow.spec.ts     # 複数ユーザーシナリオ（参加・発言・リプライ・秘話）
```

## 実行方法

```bash
cd e2e
pnpm exec playwright test                      # 全件
pnpm exec playwright test tests/<file>.spec.ts # 個別
pnpm exec playwright test --headed             # ブラウザ表示
pnpm exec playwright test --ui                 # UI mode
pnpm exec playwright test --debug              # ステップ実行
```

実行前に backend (8080) と frontend (3000) が起動している必要がある。Authentication state は globalSetup が毎回作り直す（ROPGでトークン取得→localStorageに `@@auth0spajs@@::...` を埋める→ `auth0.{clientId}.is.authenticated` cookie もセット）。

## テスト設計の前提

- **テストデータ削除なし**: ゲーム名・発言テキストはタイムスタンプで一意化（`Date.now()`）。
- **ユーザーは2名固定**: A, B。`e2e/.env.e2e` で認証情報を管理。Auth0で `Resource Owner Password Grant` が有効である必要がある。
- **`storageState` で認証**: テスト先頭で `test.use({ storageState: '.auth/user-a.json' })` または `browser.newContext({ storageState: ... })` を使う。

## 認証の仕組み（重要）

auth0-spa-js v2.11.0 + auth0-react v2.10.0 を使用。`global-setup.ts` で以下をlocalStorageに埋め込んでいる：

1. メインキャッシュ: `@@auth0spajs@@::{clientId}::{audience}::{scope}` （scope は `openid profile email offline_access`、useRefreshTokens=trueにより `offline_access` が自動付加される）
2. id_token専用キャッシュ: `@@auth0spajs@@::{clientId}::@@user@@` （`getIdToken()` がまずこれを参照し、見つかれば `getUser()` が動く）
3. cookie: `auth0.{clientId}.is.authenticated=true` （`checkSession()` がこれを見て `getTokenSilently()` を起動する）

両方のlocalStorage entryが必要。1だけだと `_getIdTokenFromCache()` の `this.scope[audience]` が undefined となりfallbackが効かず `isAuthenticated=false` になる。

## 既知パターン（テスト追加時の参考）

### モーダル操作
モーダルは `role="dialog"` 持ち。複数開く場合（参加登録モーダル → キャラ選択モーダル）は `page.getByRole('dialog').last()` で内側を、`first()` で外側を狙う。

### サイドバー vs フォーム submit の同名ボタン
「参加登録」ボタンはサイドバーとフォーム両方にある：
- サイドバー: `page.locator('nav').getByRole('button', { name: '参加登録' })`
- フォームsubmit: `dialog.locator('input[type="submit"][value="参加登録"]')` （SubmitButton は `<input type="submit">`）

### 発言エリアの home/tome 二重レンダリング
`<MessageArea>` は home と tome の両方が DOM に存在し、表示中のタブだけ可視。発言フォームも両方に生える。home 側を狙うなら `#talk-area-home`、tome 側なら `#talk-area-tome` でスコープする。

textareaのID:
- 通常発言: `#talk-area-home-talk-message`
- ト書き: `#talk-area-home-description-message`
- メッセージ表示エリア: `#message-area-home`, `#message-area-tome`

### 「発言」パネルは初期closed
`talkPanelOpenAtom = atom(false)` のため `<details>` は閉じている。`summary` をクリックして開く。ト書き・GM発言パネルは default open。

### react-select
`InputSelect` / `InputMultiSelect` は react-select 製。コンテナをクリックしてドロップダウンを開き、`page.getByText('オプションラベル')` または `page.getByRole('option', { name: ... })` で選択。

### 参加登録フロー
1. サイドバーの「参加登録」 → モーダル
2. `#term-check`, `#policy-check` を check
3. 「キャラチップ利用」label をクリック（input は hidden）
4. キャラチップは default で先頭が選択済み
5. 「選択」ボタン → キャラ選択モーダル
6. キャラ button をクリック（既参加キャラは自動的に候補から除外される）
7. submit
8. 成功時は `router.reload()` でページが再読込される

### リプライ
メッセージ要素内の最初の button が ChatBubble アイコンのリプライボタン：
```ts
page.locator('#message-area-home div.w-full').filter({ hasText: targetText }).first().locator('button').first().click()
```
クリックで `useTalkPanel().reply(message)` が呼ばれ、talk panel が開いて receiver と replyTarget が自動セットされる。

### 秘話
1. talk panel を開く
2. `talk-type` ラジオで「秘話」を選択
3. 受信者「選択」ボタン → 参加者選択モーダル（`label` で chara をクリック、hidden button が中にある）
4. 本文入力 → プレビュー → 発言する

### ステータス変更
1. サイドバー「ステータス・期間変更」
2. モーダル内の最初の react-select でステータスを選ぶ
3. 「更新」（最初のフォームの submit）
4. `router.reload()`

### 参加者として認識されているかの確認
`myself` が set されると：
- サイドバーの ProfileButton（`a[href*="/profile/"]`）が出る
- 「参加登録」ボタンが消える

## デバッグ

- 失敗時は `e2e/test-results/<test-name>/error-context.md` に page snapshot が出る
- **複数 BrowserContext のとき、error-context の page snapshot は失敗ページとは別の context のものになる場合がある**。失敗対象 page を特定したい場合はデバッグ用に `await page.locator('nav').innerText()` などを `console.log` する
- `--headed` でブラウザ表示
- ステップ単位で止めたいなら `--debug`

## ステータス遷移と権限

ゲームステータスごとの可否：
- 公開前 (Closed): GMのみ参加可
- 公開中 (Opening): GMのみ参加可
- 参加者募集中 (Recruiting): プレイヤー参加可
- 開催中 (Progress): プレイヤー参加可
- エピローグ (Epilogue): 参加不可、発言は可

トップページに表示されるのは Opening/Recruiting/Progress/Epilogue。Closedは直URLのみ。

ゲーム作成時は Closed で始まる（openAtが7日後）。ゲーム作成者は自動的にGMになる。

## トラブルシュート早見表

| 症状 | 原因候補 |
|---|---|
| `isAuthenticated=false` のまま | localStorage に id_token 専用キーが入っていない / cookie 未セット |
| `参加登録` ボタンが見つからない | ステータスがプレイヤー参加可ではない / 既に参加済み |
| `発言する` ボタンが見つからない | プレビュー前にクリックしている / talk panel が閉じている |
| react-select でオプションがクリックできない | コンテナclickでドロップダウンが開いていない |
| 二重要素エラー | home/tome の両方にマッチ → `#talk-area-home` などで scope |
| status change後にmodalが閉じない | `router.reload()` 待ち。`waitForLoadState('networkidle')` を入れる |
