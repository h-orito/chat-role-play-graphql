# フロントエンド改善提案

Next.js / React 初心者時代に作成されたコードのレビュー結果。優先度別に整理。

---

## 🔴 高優先度：Reactアンチパターン

### 1. ページスコープの状態を Jotai atom から React Context に移行

#### 現状の問題

現在の atom 利用には以下の構造的問題がある:

1. **ページスコープのデータを「アプリ全体のグローバル状態」である Jotai atom に入れている** ため、ページ遷移時にリセットされない
2. 結果として、ページ遷移時の同期問題やリーク（前ページの値が残る）が発生する
3. クリーンアップ useEffect で個別対応しているが、子コンポーネントの useEffect 実行順序やタイミングで取りこぼしが起きる

#### atomの分類

このプロジェクトの atom を**スコープ**で分類すると:

| atom | スコープ | 由来 | 現状の問題 |
|---|---|---|---|
| `gameAtom` | ページ | SSR | renderフェーズsetterで回避中 |
| `messagesQueryAtom` | ページ | SSR + ユーザー操作 | renderフェーズsetterで回避中 |
| `myselfAtom` | ページ | クライアントfetch | refetch中のnull期間で `myself!` が壊れるリスク |
| `iconsAtom` | ページ | クライアントfetch | refetch中の空配列期間 |
| `replyTargetAtom` | ページ | UI操作 | クリーンアップなし → ゲーム間でリーク |
| `talkPanelOpenAtom` | ページ | UI操作 | クリーンアップなし → ゲーム間でリーク |
| `fixedBottomAtom` | ページ | UI操作 | クリーンアップなし → ゲーム間でリーク |
| `sidebarOpenAtom` | ページ | UI操作 | クリーンアップあり ✅ |
| `myPlayerAtom` | **アプリ** | クライアントfetch | atomで適切 ✅ |
| `displaySettingsAtom` | **アプリ** | localStorage | atomで適切 ✅ |

ページスコープのものは本来 Context で扱うべき。

#### あるべき姿: スコープごとに状態管理を分ける

| データの性質 | 例 | 適切な手段 |
|---|---|---|
| ページスコープ・SSR由来 | `game`, `messagesQuery` 初期値 | **React Context** |
| ページスコープ・クライアントfetch | `myself`, `icons` | **React Context + 内部でfetch** |
| ページスコープ・UI操作 | `replyTarget`, `talkPanelOpen`, `fixedBottom`, `sidebarOpen` | **React Context** または ページ内の useState |
| アプリスコープ | `myPlayer`, `displaySettings` | Jotai atom |

#### リファクタの段階分け

##### Phase 1: SSR由来データのContext化（最優先）

`gameAtom`, `messagesQueryAtom` を Context 化する。これだけで現状の renderフェーズsetter回避策が不要になる。

具体的には:
- atom はグローバルなのでページ遷移しても自動的にリセットされない
- 子コンポーネントの useEffect（fetch 等）が親の useEffect より先に走るため、atom 更新前に古いデータで処理が実行される
- `useHydrateAtoms` はストア単位で1回しか hydrate しないため再利用できない

現状は **renderフェーズで条件付きにatomを更新する回避策**で動かしている:

```ts
export const useGame = (game: Game) => {
  const setGame = useSetAtom(gameAtom)
  const lastIdRef = useRef<string | null>(null)
  if (lastIdRef.current !== game.id) {
    lastIdRef.current = game.id
    setGame(game)
  }
}
```

これは React 公式が認めるパターンではあるが、本質的には**「ページスコープのデータをグローバル状態に入れている」設計ミス**を補正している状態。

##### Phase 1のコード例

**A. `GameContext` の作成**

```tsx
// src/components/pages/games/game-context.tsx
import { createContext, useContext, ReactNode } from 'react'
import { Game } from '@/lib/generated/graphql'

const GameContext = createContext<Game | null>(null)

export const GameProvider = ({
  game,
  children
}: {
  game: Game
  children: ReactNode
}) => <GameContext.Provider value={game}>{children}</GameContext.Provider>

export const useGameValue = (): Game => {
  const game = useContext(GameContext)
  if (!game) throw new Error('useGameValue must be used within GameProvider')
  return game
}
```

**B. ページコンポーネントでProviderを配置**

```tsx
// src/pages/games/[gameId].tsx
const GamePage = ({ game, messagesQuery: initialMessagesQuery }: Props) => {
  return (
    <GameProvider game={game}>
      <MessagesQueryProvider initialQuery={initialMessagesQuery}>
        {/* ... */}
      </MessagesQueryProvider>
    </GameProvider>
  )
}
```

**C. `messagesQueryAtom` の扱い**

`messagesQuery` は SSR 由来の初期値とユーザー操作による変更が混在する。
Context で「初期値の伝達」を行い、ページスコープの useState に変換する形が綺麗:

```tsx
// messages-query-context.tsx
const MessagesQueryContext = createContext<{
  query: MessagesQuery
  setQuery: (q: MessagesQuery) => void
} | null>(null)

export const MessagesQueryProvider = ({
  initialQuery,
  children
}: {
  initialQuery: MessagesQuery
  children: ReactNode
}) => {
  const [query, setQuery] = useState(initialQuery)
  return (
    <MessagesQueryContext.Provider value={{ query, setQuery }}>
      {children}
    </MessagesQueryContext.Provider>
  )
}
```

ページ単位でmount/unmountされるため、ページ遷移時の状態リセットが自然に行われる。

##### Phase 2: クライアントfetchデータのContext化

`myselfAtom`, `iconsAtom` を Context 化する。fetch ロジックも Provider 内に閉じ込める:

```tsx
// myself-context.tsx
const MyselfContext = createContext<{
  myself: GameParticipant | null
  refetch: () => void
} | null>(null)

export const MyselfProvider = ({
  gameId,
  children
}: {
  gameId: string
  children: ReactNode
}) => {
  const { data, refetch } = useQuery<MyGameParticipantQuery>(
    MyGameParticipantDocument,
    { variables: { gameId } }
  )
  const myself = (data?.myGameParticipant as GameParticipant) ?? null
  return (
    <MyselfContext.Provider value={{ myself, refetch }}>
      {children}
    </MyselfContext.Provider>
  )
}
```

ゲーム遷移時には Provider ごと unmount → 新Provider mount で fetch 開始されるため、stale データが残らない。
※ 項目2の `useQuery` 化と同時に行うと効率的。

##### Phase 3: UI状態atomの整理

| atom | 推奨対応 |
|---|---|
| `replyTargetAtom` | TalkPanelContext に移管（ゲームページ内で完結） |
| `talkPanelOpenAtom` | TalkPanelContext に移管 |
| `fixedBottomAtom` | FixedBottomContext に移管 |
| `sidebarOpenAtom` | クリーンアップで動いているが、Context化が望ましい |

これらは「ページ内で完結するUI状態」なので、ゲームページ Provider 配下に Context として配置するのが綺麗。

```tsx
// 例: TalkPanelContext
const TalkPanelContext = createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  replyTarget: Message | null
  reply: (m: Message) => void
  cancelReply: () => void
} | null>(null)

export const TalkPanelProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [replyTarget, setReplyTarget] = useState<Message | null>(null)
  // ...
}
```

#### 最終的なProvider構成イメージ

```tsx
const GamePage = ({ game, messagesQuery }: Props) => {
  return (
    <GameProvider game={game}>
      <MyselfProvider gameId={game.id}>
        <IconsProvider>
          <MessagesQueryProvider initialQuery={messagesQuery}>
            <TalkPanelProvider>
              <FixedBottomProvider>
                <SidebarProvider>
                  {/* 各種子コンポーネント */}
                </SidebarProvider>
              </FixedBottomProvider>
            </TalkPanelProvider>
          </MessagesQueryProvider>
        </IconsProvider>
      </MyselfProvider>
    </GameProvider>
  )
}
```

ネストが深くなる場合は、まとめた `GamePageProviders` コンポーネントに集約してもよい。

#### 移行による効果

- ✅ ページ遷移時の同期問題が消える（propsとContextは常に一致）
- ✅ renderフェーズ副作用の回避策（useRef + setAtom）が不要になる
- ✅ Concurrent Rendering / App Router で安全に動作する
- ✅ クリーンアップ忘れによるリークが構造的に防げる
- ✅ atom の責務が「真にグローバルな状態」（`myPlayer`, `displaySettings`）に絞られる

#### 影響範囲

各 `use***Value()` は多数のコンポーネントから呼ばれているため、Provider配置とimport差し替えが広範囲に及ぶ。
ただし、各呼び出し箇所のシグネチャ自体は変わらないので、機械的な置換で済む見込み。

主な影響ファイル:
- `src/pages/games/[gameId].tsx`
- `src/pages/games/[gameId]/profile/[participantId].tsx`
- `src/pages/games/[gameId]/thread/[messageId].tsx`
- `src/components/pages/games/**` 配下のほぼ全コンポーネント

#### 残す atom

以下は真にアプリスコープのため atom のままで OK:

- `myPlayerAtom` — ユーザー本人情報、全ページで共通
- `displaySettingsAtom` — localStorage 由来の表示設定、全ページで共通

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
| 🔴 推奨 | 1 | ページスコープデータを atom → React Context に移行 | 設計改善・ページ遷移時の同期問題解消 |
| 🔴 推奨 | 2 | データ取得 → `useQuery` | コード簡潔化・状態管理の改善 |
| 🟠 推奨 | 3 | useEffect deps 欠落 | stale closure / 将来バグ |
| 🟠 推奨 | 4 | dayjs.extend in component | パフォーマンス劣化 |
| 🟠 推奨 | 5 | CommonJS require 混在 | バンドラ最適化阻害 |
| 🟠 推奨 | 6 | ignoreDuringBuilds | lint エラー放置でデプロイ可能 |
| 🟠 推奨 | 7 | Apollo no-cache 全適用 | UX 劣化（不要な再取得） |
| 🟠 推奨 | 8 | 型アサーション多用 | 実行時エラーの見逃し |
| 🟡 改善 | 9-11 | アクセシビリティ | 障害者対応・SEO |
| ⚪ 任意 | 12-15 | 細かい改善 | 可読性・仕様準拠 |
