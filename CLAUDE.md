# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

ロールプレイ用チャットアプリケーション。GraphQL API をベースとしたモノレポ構成。

## 開発コマンド

### Backend (Go)

```bash
cd backend

# サーバー起動
go run main.go

# GraphQL スキーマからコード生成
go run github.com/99designs/gqlgen generate
```

### Frontend (Next.js)

パッケージマネージャは **pnpm** を使用（`packageManager` フィールドで固定）。

```bash
cd frontend

# 依存インストール
pnpm install

# 開発サーバー起動
pnpm run dev

# ビルド
pnpm run build

# Lint
pnpm run lint

# Format
pnpm run format

# GraphQL コード生成
pnpm run codegen
```

### Docker (MySQL)

```bash
cd docker-compose
docker compose up -d
```

## アーキテクチャ

### Backend

クリーンアーキテクチャベースの4層構造:

- **adaptor/graphql/**: GraphQL リゾルバ、コンバータ、DataLoader
- **application/**: usecase（ユースケース）と app_service（アプリケーションサービス）
- **domain/**: model（エンティティ、リポジトリインターフェース）と dom_service（ドメインサービス）
- **infrastructure/rdb/**: GORM を使用したリポジトリ実装
- **middleware/graph/**: gqlgen 生成コード
- **inject/**: DI コンテナ（手動ワイヤリング）

主要ライブラリ:
- GraphQL: gqlgen
- ORM: GORM
- Auth: Auth0 JWT

### Frontend

- **src/pages/**: Next.js Pages Router
- **src/components/**: UIコンポーネント（graphql/配下にクエリ定義）
- **src/lib/generated/**: graphql-codegen 生成コード

主要ライブラリ:
- 状態管理: jotai
- 認証: Auth0
- CSS: Tailwind CSS
- アイコン: Heroicons

### GraphQL スキーマ変更フロー

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

Auth0 とGraphQL エンドポイントの設定が必要。
