# フロントエンド改善提案

Next.js / React 初心者時代に作成されたコードのレビュー結果。優先度別に整理。

---

## 🔴 高優先度：Reactアンチパターン

### 1. propsをatomに同期する useEffect → `useHydrateAtoms` に置き換え

**`src/components/pages/games/game-hook.ts`**  
**`src/pages/games/[gameId].tsx`**

「SSRで受け取ったpropsをJotai atomに同期する」ために useEffect を使っているが、
これは「レンダリングと無関係な useEffect」の典型的なアンチパターン。

Jotaiはこのユースケースのために `useHydrateAtoms` を提供している。

```ts
// 現状 (BAD) — useEffect でpropsをatomに同期
export const useGame = (game: Game): Game => {
  const setGame = useSetAtom(gameAtom)
  useEffect(() => {
    setGame(game)
    return () => setGame(null)
  }, [game])
  return game
}

// [gameId].tsx
useEffect(() => {
  setInitialMessagesQuery(initialMessagesQuery)
}, [initialMessagesQuery])
```

```ts
// 修正 (GOOD) — useHydrateAtoms を使う
// game-hook.ts — useGame フックごと削除し、pageAtom を export するだけに
export const gameAtom = atom<Game | null>(null)
export const useGameValue = () => useAtomValue(gameAtom)!

// [gameId].tsx
import { useHydrateAtoms } from 'jotai/utils'

const GamePage = ({ game, messagesQuery: initialMessagesQuery }: Props) => {
  useHydrateAtoms([
    [gameAtom, game],
    [messagesQueryAtom, initialMessagesQuery],
  ])
  ...
}
```

---

### 2. データ取得の `useLazyQuery` + `useEffect` → `useQuery` に置き換え

**`src/components/pages/games/game-hook.ts`** (`useMyPlayer`, `useIcons`)

データ取得は「外部システムとの同期」なので useEffect 自体は誤りではないが、
Apollo の `useQuery` を使えば loading/error 管理も含めてより宣言的に書ける。

```ts
// 現状 (BAD) — useLazyQuery + useEffect の組み合わせ
export const useMyPlayer = (): Player | null => {
  const [fetchMyPlayer] = useLazyQuery<MyPlayerQuery>(MyPlayerDocument)
  const [myPlayer, setMyPlayer] = useAtom(myPlayerAtom)
  useEffect(() => {
    const fetch = async () => {
      const { data } = await fetchMyPlayer()
      if (data?.myPlayer == null) return
      setMyPlayer(data.myPlayer as Player)
    }
    fetch()
    return () => setMyPlayer(null)
  }, [])
  return myPlayer
}

// 修正 (GOOD) — useQuery を使う
export const useMyPlayer = (): Player | null => {
  const setMyPlayer = useSetAtom(myPlayerAtom)
  const { data } = useQuery<MyPlayerQuery>(MyPlayerDocument)
  useEffect(() => {
    if (data?.myPlayer) setMyPlayer(data.myPlayer)
  }, [data])
  return useAtomValue(myPlayerAtom)
}
// ※ atomが不要であれば data?.myPlayer を直接返すだけでもよい
```

---

### 3. useEffect の依存配列の欠落（stale closure リスク）

`exhaustive-deps` ESLint ルールで検出される箇所。空配列 `[]` にしているため、
参照している変数が古い値のままになる可能性がある。

| ファイル | hook | 欠落している依存 |
|---|---|---|
| `game-hook.ts:88` | `useMyselfInit` の useEffect | `refetchMyself` |
| `message-area.tsx:107` | 初回メッセージ取得 useEffect | `search`, `pagingSettings` など |
| `talk-message.tsx:281` | `ReplyToMessage` の useEffect | `fetchMessage`, `game.id`, `message.replyTo` |

`message-area.tsx` は「初回だけ実行したい」意図があるが、stale closure を防ぐために
`useRef` で関数を安定化するか、依存配列を明示的に管理するかを検討する。

---

## 🟠 中優先度：コード品質・保守性

### 4. `dayjs.extend` をコンポーネント内で呼んでいる

**`src/components/pages/games/sidebar/game-settings-edit.tsx:21-23`**

renderのたびに毎回実行される。モジュールのトップレベルに移動すべき。

```ts
// 現状 (BAD)
export default function GameSettingsEdit() {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.tz.setDefault('Asia/Tokyo')
  ...
}

// 修正 (GOOD)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Tokyo')

export default function GameSettingsEdit() { ... }
```

---

### 5. CommonJS `require` の混在

**`src/components/graphql/client.ts:35`**

ESモジュールのファイル内で CommonJS の `require` を使っている。バンドラの tree-shaking が効かなくなる。

```ts
// 現状 (BAD)
const { createUploadLink } = require('apollo-upload-client')

// 修正 (GOOD)
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'
// ※ パッケージのバージョンによりエントリポイントが異なる場合あり
```

---

### 6. ビルド時の ESLint 無効化

**`next.config.js`**

```js
eslint: {
  ignoreDuringBuilds: true,  // ← lint エラーがあってもビルドが通る
}
```

lint エラーを放置したままデプロイできてしまうため、削除を推奨。

---

### 7. Apollo の `fetchPolicy: 'no-cache'` 全適用

**`src/components/graphql/client.ts`**

全クエリ・全ミューテーションに `no-cache` を設定しているため、Apollo Client のキャッシュが完全に無効。

- リアルタイム性が必要なメッセージ → `no-cache` で OK
- ゲーム設定、参加者一覧など変化の少ないデータ → `cache-first` や `cache-and-network` でUXを改善できる

---

### 8. 型アサーション (`as`) の多用

`data.myPlayer as Player` のように TypeScript の型チェックを回避する `as` が多数ある。
codegen が生成する型を活かしつつ、null チェックは明示的に行う形に整理することで
実行時エラーを型レベルで防げる。

```ts
// 現状 (BAD)
setMyPlayer(data.myPlayer as Player)

// 修正 (GOOD)
if (data?.myPlayer) {
  setMyPlayer(data.myPlayer)
}
```

---

## 🟡 アクセシビリティ

### 9. `<a>` タグをボタン代わりに使用

**`src/pages/index.tsx:122-140`**

`href` のない `<a>` タグはスクリーンリーダーで正しく読み上げられない。フォーカス管理も壊れる。

```tsx
// 現状 (BAD)
<a className='cursor-pointer hover:text-blue-500' onClick={termModal.open}>
  利用規約
</a>

// 修正 (GOOD)
<button className='hover:text-blue-500' onClick={termModal.open}>
  利用規約
</button>
```

---

### 10. アイコンのみのボタンに `aria-label` がない

**`src/components/pages/games/article/message-area/message-area/message-area-footer-menu.tsx`**

モバイルではテキストが非表示（`hidden md:block`）になるため、スクリーンリーダーにはアイコンしか残らない。

```tsx
// 現状 (BAD)
<button onClick={scrollToTop}>
  <ArrowUpIcon className='size-5' />
  <span className='hidden md:block'>最上部へ</span>
</button>

// 修正 (GOOD)
<button aria-label='最上部へ' onClick={scrollToTop}>
  <ArrowUpIcon className='size-5' aria-hidden='true' />
  <span className='hidden md:block' aria-hidden='true'>最上部へ</span>
</button>
```

---

### 11. リストの `key` に index を使用

**`src/components/pages/games/sidebar/sidebar.tsx:322`**

要素の追加・削除・並び替えがあると、DOM の更新が正しく行われない可能性がある。

```tsx
// 現状 (BAD)
{game.labels.map((l: GameLabel, idx: number) => (
  <Label key={idx} label={l} />
))}

// 修正 (GOOD)
{game.labels.map((l: GameLabel) => (
  <Label key={l.name} label={l} />
))}
```

---

## ⚪ 低優先度：可読性・細かい改善

### 12. `<Link>` 内の `<button>` タグ（HTML 仕様違反）

**`src/components/pages/games/sidebar/sidebar.tsx:212-219`**

`<a>` の中に `<button>` を入れることは HTML 仕様違反。ブラウザによって動作が異なる。

```tsx
// 現状 (BAD)
<Link href='/'>
  <button className='sidebar-hover sidebar-text flex w-full ...'>
    <HomeIcon />
    <p>トップ画面</p>
  </button>
</Link>

// 修正 (GOOD)
<Link href='/' className='sidebar-hover sidebar-text flex w-full ...'>
  <HomeIcon />
  <p>トップ画面</p>
</Link>
```

---

### 13. `forwardRef` コンポーネントに `displayName` 未設定

**`src/components/pages/games/article/message-area/message-area/message-area.tsx`**

React DevTools で "ForwardRef" という名前になってしまう。

```ts
// 追加
MessageArea.displayName = 'MessageArea'
export default MessageArea
```

---

### 14. magic number (`pageSize: 100000`)

**`src/pages/index.tsx:28`**

10万件のゲームを一度に取得しようとしている。定数化 or ページネーション実装を検討。

```ts
const ALL_GAMES_PAGE_SIZE = 10000
```

---

### 15. `next.config.js` を TypeScript 化

CommonJS (`module.exports`) から `next.config.ts` に移行すると型補完が得られる。

---

## 優先度サマリー

| 優先度 | # | 内容 | 影響 |
|--------|---|------|------|
| 🔴 推奨 | 1 | propsのatom同期 → `useHydrateAtoms` | useEffect アンチパターン解消 |
| 🔴 推奨 | 2 | データ取得 → `useQuery` | コード簡潔化・状態管理の改善 |
| 🟠 推奨 | 3 | useEffect deps 欠落 | stale closure / 将来バグ |
| 🟠 推奨 | 4 | dayjs.extend in component | パフォーマンス劣化 |
| 🟠 推奨 | 5 | CommonJS require 混在 | バンドラ最適化阻害 |
| 🟠 推奨 | 6 | ignoreDuringBuilds | lint エラー放置でデプロイ可能 |
| 🟠 推奨 | 7 | Apollo no-cache 全適用 | UX 劣化（不要な再取得） |
| 🟠 推奨 | 8 | 型アサーション多用 | 実行時エラーの見逃し |
| 🟡 改善 | 9-11 | アクセシビリティ | 障害者対応・SEO |
| ⚪ 任意 | 12-15 | 細かい改善 | 可読性・仕様準拠 |
