# chat role play (GraphQL)

GraphQL で遊びつつロールプレイしやすいチャット環境を作ってみる

## 構成

- **backend**: Go / GraphQL (gqlgen) / MySQL (GORM)
- **frontend**: Next.js (Pages Router) / jotai / Tailwind CSS / Auth0
- **e2e**: Playwright (Chromium)

モノレポ構成。スキーマ定義は `graphql/schema.graphqls`。

## セットアップ

### 前提

- Go (backend)
- Node.js + **pnpm** (frontend / e2e)
- Docker + Docker Compose (MySQL)

### 1. MySQL を起動

```bash
cd docker-compose
docker compose up -d
```

### 2. Backend を起動

```bash
cd backend
# .env を用意（DB 接続情報・Auth0 設定）
go run main.go
```

`http://localhost:8080/graphql` で待ち受ける。

### 3. Frontend を起動

```bash
cd frontend
# .env.local を用意（Auth0 / GraphQL エンドポイント）
pnpm install
pnpm run dev
```

`http://localhost:3000` で開く。

## 開発コマンド

### Backend

```bash
cd backend
go run main.go                                    # サーバー起動
go run github.com/99designs/gqlgen generate       # GraphQL コード生成
```

### Frontend

```bash
cd frontend
pnpm run dev       # 開発サーバー
pnpm run build     # ビルド
pnpm run lint      # Lint
pnpm run format    # Format (prettier)
pnpm run codegen   # GraphQL コード生成
pnpm run test      # vitest
```

### E2E (Playwright)

backend (8080) と frontend (3000) を起動した状態で:

```bash
cd e2e
pnpm install
pnpm exec playwright test                          # 全件
pnpm exec playwright test tests/<file>.spec.ts     # 個別
pnpm exec playwright test --headed                 # ブラウザ表示
pnpm exec playwright test --ui                     # UI mode
```

`e2e/.env.e2e` に Auth0 設定とテストユーザー認証情報が必要（Resource Owner Password Grant が有効である必要あり）。

## GraphQL スキーマ変更フロー

1. `graphql/schema.graphqls` を編集
2. Backend: `go run github.com/99designs/gqlgen generate`
3. Frontend: `pnpm run codegen`

## 環境変数

### Backend (.env)

```
DB_HOST=localhost
DB_NAME=chat_rp_db
DB_USER=chatrp
DB_PASS=password
OAUTH_ISSUERURI={oauth issuer uri}
OAUTH_AUDIENCE={oauth audience}
```

### Frontend (.env.local)

Auth0 と GraphQL エンドポイントの設定が必要。
