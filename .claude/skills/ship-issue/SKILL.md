---
name: ship-issue
description: chat-role-play-graphql プロジェクトで `.issues/<n>-<slug>.md` を 1 PR 単位で消化するワークフロー。引数なしなら HANDOFF.md/README.md から最優先 Issue を自動選択。ブランチ作成 → 実装 → lint/build/E2E → release-note 追加 → PR 作成 → pr-reviewer サブエージェント → レビュー反映 → squash merge → 後片付け → HANDOFF.md 更新までを標準化する。`/ship-issue [番号]` で呼び出す。
---

# Ship Issue

`.issues/` 配下の Issue を 1 つ受け取り、PR まで持っていくための標準フロー。詳細は `.issues/README.md` と `.issues/HANDOFF.md` を必ず先に読むこと（本ファイルはサマリ）。

## 引数

- `<番号>`（省略可）: ローカル Issue 番号。`.issues/<番号>-<slug>.md` が存在する前提
- **省略時は §0 の手順で自動選択**

## 0. Issue の決定（引数省略時のみ）

以下の優先度で「次に着手する Issue」を決定する:

1. **`.issues/HANDOFF.md` の TL;DR / 「次セッション開始プロンプト」** で明示されている Issue 番号
   - 最も信頼できるソース。ユーザが手動で更新している = 着手意思が反映されている
2. **`.issues/README.md` の「進行中の Phase 計画」** で未完の最初の順番
   - HANDOFF.md と矛盾する場合は HANDOFF.md を優先（HANDOFF.md の方が新しい）
3. **`.issues/README.md` の一覧表 `優先度` カラム**（high > medium > low）
   - Phase 計画外の Issue（派生課題・hotfix）が混じっている場合のみ参照

依存関係チェック:
- `.issues/README.md`「関連の依存・順序メモ」で **先行マージが必要な Issue があれば後回し**
- schema 共有 Issue（例: #31 + #32）は片方マージ後に rebase が必要

**選択後、必ずユーザーに確認を取る**:

> Issue #XX (`<タイトル>`) で進めます。OK ですか？
> 根拠: <HANDOFF.md / Phase 計画 / 優先度 のどれを参照したか>

ユーザーが OK を返したら §事前確認 へ。別の Issue を指定された場合はそちらに切り替える。

## 事前確認（着手前）

1. `.issues/<番号>-<slug>.md` を Read して「対応案」「スコープ」を把握
2. `.issues/HANDOFF.md` の「必ず守るルール」「ユーザー手動確認待ち」「派生課題」を確認
3. `.issues/README.md` の「関連の依存・順序メモ」で依存関係（schema 共有・rebase 必要性など）を確認
4. **Issue 本文の用語が実意図と一致しないことがある**（PR #33 教訓）。画面文言とコード上のフィールド名が違いそうなら実装前にユーザーに確認

## 1. ブランチ作成

`main` から切る。命名規則は `.issues/README.md` §1 のとおり:

```
<type>/<番号>-<slug>
```

`type` の対応は Issue フロントマターの `type` に従う:
- `bug` → `fix`
- `design` / `refactor` → `refactor`
- `a11y` / `code-quality` → `refactor` または `chore`
- `enhancement` / `build` → `chore`
- `performance` → `perf`

```bash
git checkout main && git pull
git checkout -b <type>/<番号>-<slug>
```

## 2. 実装

- Issue の「対応案」を踏まえて修正。**スコープ外には踏み込まない**
- 同パターンが他にないか必ず grep して **面で修正**（PR #24/#26 教訓）
- 設定変更は dead config を疑い、grep で利用箇所を確認（PR #21 教訓）
- `frontend/src/lib/generated/` / `backend/middleware/graph/` は触らない。schema 変更がある場合は codegen で再生成
- backend の `Find*` メソッドは TX 外接続。同一 TX 内 read-modify-write が必要なら専用 Update メソッドを新設（PR #33 教訓）
- GORM の `tx.Update(...)` 系を新設する場合は `RowsAffected == 0` チェックを忘れない

### GraphQL schema 変更を含む場合

1. `graphql/schema.graphqls` 編集
2. `cd backend && go run github.com/99designs/gqlgen generate`
3. `cd frontend && pnpm run codegen`

## 3. 動作確認

毎回必須:

```bash
cd frontend && pnpm run lint
# 該当時
cd frontend && pnpm run build
# backend を触っていれば
cd backend && go build ./...
```

E2E は以下のフローで判断（`.issues/README.md` §3）:

1. **既存 E2E で回帰検知できるか** → `cd e2e && pnpm exec playwright test`
2. **E2E シナリオを追加可能か** → 追加して PR に含める（`e2e` skill 参照）
3. **どちらも困難な場合** → PR 本文に「ユーザー手動確認依頼: <具体的手順>」を明記

backend(8080) は事前起動。frontend は playwright が 3001 で fresh 起動するので触らない。

`game-flow.spec.ts` は flaky なので落ちたら 1 回再実行で OK。

## 4. release-note 追加（ユーザー影響ある変更のみ）

バグ修正・UI 変更・機能追加など利用者に見える変更には必須（純内部リファクタ・CI/Dockerfile 変更などは対象外）。

- `frontend/src/pages/release-note.tsx` の先頭に `<ReleaseContent date="YYYY-MM-DD">` を追加
- **同日付のエントリが既にあれば、その `<ReleaseContent>` 内の `<ul>` に `<li>` を追記**（新規ブロックを作らない）

## 5. コミット

Conventional Commits（日本語）。末尾にローカル Issue 番号:

```
fix: apollo-upload-client を ESM import に変更 (#14)
```

粒度は自由（squash merge 前提）。レビュー反映時は別コミットに分けて push（履歴で追えるように）。

## 6. PR 作成

```bash
gh pr create --title "<conventional commit と同じ>" --body "$(cat <<'EOF'
closes .issues/<番号>-<slug>.md

## 変更内容
- ...

## 動作確認
- [ ] pnpm run lint
- [ ] pnpm run build （該当時）
- [ ] 既存 E2E: cd e2e && pnpm exec playwright test
- [ ] 追加 E2E: <シナリオ名> （該当時）
- [ ] ユーザー手動確認依頼: <手順> （該当時）
EOF
)"
```

PR 本文を後から更新する場合は **`gh pr edit --body` ではなく `gh api -X PATCH`** を使う（projectCards deprecation エラー回避）:

```bash
gh api -X PATCH repos/h-orito/chat-role-play-graphql/pulls/<n> -F body=@/tmp/body.md
```

## 7. pr-reviewer サブエージェント呼び出し

**PR 作成直後に必ず実行**。実装意図や重点観点は **渡さない**（バイアス回避）:

```
Agent({ subagent_type: "pr-reviewer", prompt: "PR #<番号>" })
```

サブエージェントは `.reviews/PR-<番号>.md` にレビュー結果を書き出して完了報告を返す。

## 8. レビュー反映

1. `.reviews/PR-<番号>.md` を Read
2. **must-fix / should-fix は省略せず全件反映**（ユーザは省略を嫌う）。nits も基本反映、不採用は理由を持つ
3. 修正コミットを分けて push
   - dev server キャッシュ汚染で E2E が落ちることがある。落ちたらユーザーに dev server 再起動を依頼
4. 反映が必要だった場合は `pr-reviewer` を再呼び出しして再レビュー
5. 全完了後にユーザーへ簡潔に報告:
   - 指摘された内容（must-fix / should-fix / nits の件数 + 要点）
   - 修正した内容
   - 対応しなかった内容と理由（nits の不採用理由など）
6. `.reviews/PR-<番号>.md` を削除

## 9. マージ後の片付け

`.issues/HANDOFF.md` §マージ後の片付けに従う:

```bash
gh pr merge <PR番号> --squash --delete-branch
git checkout main && git pull
```

以下を実施:

1. `.issues/<番号>-<slug>.md` を削除
2. `.issues/README.md` の一覧表から該当行を削除
3. ローカル feature ブランチが残っていれば `git branch -D <ブランチ名>`
4. `.reviews/PR-<番号>.md` を削除（残っていれば）
5. `.issues/HANDOFF.md` を更新:
   - 「完了済みフェーズ」に追記
   - 「Phase X 計画」の該当行を「完了（PR #XX）」に更新
   - **「次セッション開始プロンプト」を §0 の自動選択ロジックで決まる Issue 用に更新**（次回の引数なし呼び出しで正しく選択されるよう、最新化を怠らない）
   - ユーザー手動確認待ちがあれば「ユーザー手動確認待ち」セクションに追記
   - 新しく確立した設計指針・教訓があれば「PR #XX で確立した〜」セクションを追加

## 必ず守るルール（再掲）

- **PR レビュー指摘は省略しない**: must/should-fix 反映、nits も基本反映。スコープ外は PR 本文に明記
- **PR 作成後は必ず pr-reviewer**: 実装意図は渡さない
- **ユーザー影響ある変更には release-note 追加**
- **generated/ は触らない**: lint/build 除外済み、コミットにも混ぜない
- **PR 本文更新は `gh api -X PATCH`**: `gh pr edit --body` は projectCards エラー
- **dead config を疑う**: 設定変更前に grep
- **同パターンが他にないか必ず grep**: 修正は単点でなく面で

## 例外パターン

- 同ファイル・密接依存の Issue（例: #10+#11+#25 / #27+#35）は **まとめて 1 PR** にする
- schema 共有 Issue（例: #31 + #32）は **片方 merge 後にもう片方を rebase + 再 codegen**
- レビュー待ちの間に次の Issue 着手したいときのみ `git worktree`（注意点は `.issues/README.md` §並行作業）
