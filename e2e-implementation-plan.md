# E2Eテスト実装計画

## 対象

フロントエンド（Next.js）を主軸としたE2Eテスト。Auth0認証済み状態でのユーザー操作フローを検証する。

---

## 現状の技術スタック整理

| 要素 | 技術 |
|---|---|
| Frontend | Next.js 15 (Pages Router), React 19 |
| 認証 | @auth0/auth0-react, cacheLocation: 'localstorage', useRefreshTokens: true |
| GraphQL | Apollo Client (Bearer Tokenをヘッダに付与) |
| 既存テスト | Vitest + jsdom (ユニットテスト) |

---

## 最大の課題：Auth0認証をどうするか

### 問題

通常のOAuth認証フロー (`loginWithRedirect`) はブラウザリダイレクトを伴うため、
E2Eテストから自動操作するのが困難または不安定。

### 解決策：Resource Owner Password Grant (ROPG)

Auth0の「パスワードグラント」を使い、ブラウザを介さずに直接アクセストークンを取得する。

```
POST https://{AUTH0_DOMAIN}/oauth/token
Content-Type: application/json

{
  "grant_type": "password",
  "username": "test-user@example.com",
  "password": "test-password",
  "client_id": "xxx",
  "audience": "xxx",
  "scope": "openid profile email"
}
```

アプリケーションタイプが **SPA（Public Client）** のため `client_secret` は不要。

取得したトークンをLocalStorageに注入することで、アプリ側は「ログイン済み」と認識する。

---

## Auth0 SDKのLocalStorage格納形式

`@auth0/auth0-react` が `cacheLocation: 'localstorage'` の場合、以下のキーで保存される。

```
キー: @@auth0spajs@@::{clientId}::{audience}::{scope}
```

値（JSON）の構造：

```json
{
  "body": {
    "access_token": "eyJ...",
    "id_token": "eyJ...",
    "refresh_token": "v1.xxx",
    "token_type": "Bearer",
    "expires_in": 86400,
    "scope": "openid profile email offline_access",
    "decodedToken": {
      "user": {
        "sub": "auth0|xxx",
        "nickname": "test-user",
        "name": "test-user@example.com",
        "email": "test-user@example.com"
      }
    }
  },
  "expiresAt": 1234567890
}
```

この形式でLocalStorageに注入することで、SDKが「認証済み」状態と判断する。

---

## E2Eフレームワーク選定

### Playwright（推奨）

| 特徴 | 内容 |
|---|---|
| storageState | LocalStorage/Cookieの状態をファイル保存・復元できる |
| globalSetup | テスト開始前に一度だけ認証処理を実行できる |
| 安定性 | Cypressより非同期/SPAに強い |
| Next.js対応 | 公式サポートあり |

`globalSetup` でRPOGトークンを取得してLocalStorageに注入 → `storageState` として保存 → 各テストで再利用、という流れが実現できる。

---

## バックエンドJWT認証とROPGの関係

### 結論：ROPGトークンはそのままバックエンドで通る

ROPGで取得したトークンは、通常のOAuthフローで取得したトークンと**全く同じ本物のJWT**。  
Auth0の秘密鍵で署名されているため、バックエンドのJWKS検証（RS256, issuer, audience）をそのまま通過する。

```
ROPGでトークン取得
    └→ Auth0が署名した本物のJWT（同一のissuer・audience）
           └→ バックエンドがJWKSエンドポイントで署名検証 → OK
                  └→ AuthMiddleware が sub クレームを取り出す
                         └→ ユーザーがDBに存在しなければ自動Signup
```

### 重要な挙動：初回リクエストで自動ユーザー作成

`AuthMiddleware` はJWT検証後、`sub`（Auth0ユーザーID）でDBを検索し、  
存在しなければ**自動でユーザーレコードを作成**する。  
テストユーザーが初回リクエストを行うと、バックエンドDBに自動的にユーザーが登録される。  
→ テスト用ユーザーの事前DB登録は不要。

### JWTなしリクエストも許可済み

`WithCredentialsOptional(true)` が設定されているため、  
未ログイン状態のE2Eテスト（ゲーム閲覧等）でもバックエンドは正常レスポンスを返す。

---

## 課題一覧

### 課題1：テスト用ユーザー管理

**決定事項**: 参加者ロールのユーザーを2名用意する。

- **ユーザーA**: ゲーム作成・参加。セットアップ処理の主体
- **ユーザーB**: 同じゲームに参加。2者間のインタラクションテスト（メッセージ送受信・フォロー等）に使用
- バックエンドDBへの事前登録は不要（初回GraphQLリクエスト時に自動作成）

#### 2ユーザーの storageState 管理

`globalSetup` でROPGトークンを2ユーザー分取得し、別々のファイルに保存する。

```
e2e/
├── .auth/
│   ├── user-a.json   # (gitignore) ユーザーAのstorageState
│   └── user-b.json   # (gitignore) ユーザーBのstorageState
```

テストでの切り替え方法：
- **単一ユーザーのテスト**: `use: { storageState: 'e2e/.auth/user-a.json' }` を設定
- **2ユーザー間のインタラクションテスト**: Playwright の `browser.newContext()` で別コンテキストを作成し、それぞれ異なる storageState を適用

```ts
// 2ユーザーの同時操作例
test('2ユーザー間でメッセージをやり取り', async ({ browser }) => {
  const contextA = await browser.newContext({ storageState: 'e2e/.auth/user-a.json' })
  const contextB = await browser.newContext({ storageState: 'e2e/.auth/user-b.json' })
  const pageA = await contextA.newPage()
  const pageB = await contextB.newPage()
  // ...
})
```

#### 資格情報管理

Auth0のテストユーザー資格情報は `.env.e2e` に記載し、gitignore 対象とする。

```
E2E_TEST_USER_A_EMAIL=test-user-a@example.com
E2E_TEST_USER_A_PASSWORD=xxx
E2E_TEST_USER_B_EMAIL=test-user-b@example.com
E2E_TEST_USER_B_PASSWORD=xxx
AUTH0_CLIENT_ID=xxx
AUTH0_DOMAIN=xxx.auth0.com
AUTH0_AUDIENCE=xxx
```

---

### 課題2：バックエンドの扱い

**実バックエンド（決定）**
- Go + MySQL を起動した状態でテストを実行
- 本物のGraphQL APIを叩くため、バックエンドのJWT検証もそのまま動作確認できる
- テスト用DBが必要（本番DBとは分離）
- テスト前後のデータクリーンアップが必要

---

### 課題3：テストデータ管理

**決定事項**: データのクリーンアップは行わない。毎回新しいゲームを作成して使う。

#### 方針

```
[beforeAll]
  1. registerGame → 新しいゲームを作成（このテストファイル専用）
  2. updateGameStatus(Recruiting) → 参加受付状態に変更
  3. registerGameParticipant → テストユーザーを参加者として登録

[テスト実行]
  → このテスト実行で作成したゲームIDのみを使う

[afterAll / cleanup]
  → 何もしない（データはDBに残り続ける）
```

#### なぜ削除しなくて大丈夫か

- 各テストは `beforeAll` で**新規作成したゲームのID**しか使わない
- 前回の実行で残ったゲームは、今回のテストからは参照されないため干渉しない
- テストユーザーが「参加者未登録であること」を前提とするテストも、毎回新しいゲームを使うので問題ない
- DBが溜まりすぎた場合は手動で `docker compose down -v && docker compose up -d` すれば解決

#### テストを壊さないための書き方ルール

- ゲームの総数を `=== N件` で断言しない（実行を重ねるたびに件数が増えるため）
- 自分が作成したゲームIDを通じてアクセスし、他のゲームに依存しない

#### ゲーム名の命名規則

テスト由来のデータを識別しやすくするため、名前に `[E2E]` プレフィックスを付ける。

```
[E2E] 参加テスト用ゲーム
[E2E] メッセージ投稿テスト用ゲーム
```

#### GraphQL経由でのセットアップ実行

セットアップは専用のGraphQLクライアント（fetch + JWT）を使って実行する。  
Playwrightのfixture または `beforeAll` から呼び出す。

```ts
// e2e/helpers/graphql-client.ts
// ROPGで取得したJWTを使ってGraphQL mutationを直接叩くヘルパー
```

---

### 課題4：decodedToken の構築

RopGで取得したアクセストークン（JWT）からdecodeしたユーザー情報（`decodedToken.user`）を  
LocalStorage注入時に含める必要がある。

- JWTのpayloadをBase64デコードすれば取得可能
- ただし `id_token` に含まれるuser情報と `decodedToken` の整合性に注意

---

### 課題5：CI環境での実行

- Auth0テナント資格情報をGitHub Actions等のシークレットに登録が必要
- バックエンド（Go + MySQL）のCI起動が必要（`docker-compose` 利用想定）
- Playwrightのブラウザインストール（`npx playwright install`）が必要

---

## 実装ステップ案

### Step 1: Playwright導入

```bash
cd frontend
npx playwright install chromium
```

設定ファイル `playwright.config.ts` を作成。  
`baseURL`, `storageState` パス等を設定。

### Step 2: 認証ヘルパー作成（globalSetup）

`e2e/global-setup.ts` を作成。
- ROPGでAuth0からトークン取得
- JWTをデコードしてユーザー情報を抽出
- Auth0 SDK形式のLocalStorageエントリを構築
- Playwrightの `storageState` ファイルとして保存

### Step 3: 最初のテスト（ログイン確認）

- アプリにアクセスして「ログイン済み」のUIが表示されることを確認
- ログアウトボタン等の認証済みUI要素が存在することを検証

### Step 4: ゲーム閲覧テスト（認証不要）

- ゲーム一覧ページの表示
- ゲーム詳細ページの表示

### Step 5: 認証が必要な操作のテスト

- ゲームへの参加
- メッセージ投稿
- プロフィール編集

---

## ディレクトリ構成案

```
frontend/
├── e2e/
│   ├── global-setup.ts         # ROPGトークン取得 + storageState生成
│   ├── auth-state.json         # (gitignore) storageState保存先
│   ├── fixtures/
│   │   └── auth.ts             # 認証済みpageのfixture
│   └── tests/
│       ├── unauthenticated/
│       │   └── games-list.spec.ts
│       └── authenticated/
│           ├── login.spec.ts
│           ├── game-detail.spec.ts
│           └── post-message.spec.ts
├── playwright.config.ts
└── .env.test                   # テスト用環境変数（gitignore推奨）
```

---

## 未確認・要確認事項

- [x] Auth0アプリはSPA（Public Client）→ `client_secret` 不要
- [ ] テストユーザー（user-a / user-b）はAuth0上に既に存在するか

---

## 決定事項のサマリー

| 番号 | 決定事項 | 決定内容 |
|---|---|---|
| 1 | E2Eフレームワーク | **Playwright** |
| 2 | バックエンドの扱い | **実バックエンド（Go + MySQL）を起動して使用** |
| 3 | テストデータ管理 | **毎回新規ゲーム作成・削除なし（DBが溜まったら手動でvolume削除）** |
| 4 | テストユーザー | **参加者ロール2ユーザー（user-a / user-b）** |
| 5 | CI対応 | **なし（ローカルのみ）** |
| 6 | 対象ブラウザ | **Chromiumのみ** |
