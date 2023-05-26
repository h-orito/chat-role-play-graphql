# chat-role-play backend

### GraphQL スキーマ定義変更

1. ../graphql/schema.graphqls を変更
1. `gqlgen generate`

### 環境変数

- config/config.yaml を用意

例

```
db:
  host: localhost
  name: chat_rp_db
  user: chatrp
  pass: password
oauth:
  issueruri: {oauth issuer uri}
  audience: {oauth audience (comma separated)}
```

### サーバー起動

```
go run main.go
```

### library

- GraphQL: gqlgen
- ORM: gorm
- Auth: Auth0 JWT
