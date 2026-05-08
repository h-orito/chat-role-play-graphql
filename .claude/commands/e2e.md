e2e テストを実行し、結果を報告する。

## 引数の扱い

- 引数なし: `e2e/` で `pnpm exec playwright test` を実行（全テスト）
- 引数あり: そのままplaywright testに渡す（例: `tests/game-flow.spec.ts`、`--ui`、`--debug`、`--headed` など）

## 実行前提

- **backend (`http://localhost:8080`) が起動している**（docker-compose の MySQL も含む）
- frontend は playwright の webServer 設定で `next dev -p 3001` を**毎回 fresh に自動起動**するため、ユーザーが手動で起動する必要はない（通常の dev server が 3000 で動いていても競合しない）
- `e2e/.env.e2e` に Auth0 設定とテストユーザー認証情報がある

実行前に backend の起動確認のみ行い、起動していなければユーザーに確認を取る。frontend は触らない。

## 結果報告

通った場合は通過件数のみ簡潔に報告。

失敗した場合は `e2e/test-results/<test-name>/error-context.md` を読んで原因を切り分ける：

- **UI変更（セレクタ・ラベル不一致）**: テスト側のセレクタ修正案を提示
- **機能不具合（API失敗・期待結果と異なる）**: 実装側の問題として報告。修正は別途依頼するか確認
- **テストデータの干渉**: ゲーム名のタイムスタンプ衝突や残存データの可能性を疑う

詳細なテスト追加・修正手順、既知のパターン（`#talk-area-home` スコープ、モーダルの dialog ロール、参加登録/発言/秘話の helper 等）は `e2e` skill を参照すること。
