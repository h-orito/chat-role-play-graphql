import PageHeader from '@/components/pages/page-header'
import Head from 'next/head'
import Link from 'next/link'

export default function CreateGame() {
  return (
    <main className='w-full lg:flex lg:justify-center'>
      <Head>
        <title>ロールをプレイ！ | 更新履歴</title>
      </Head>
      <article className='min-h-screen w-full text-center lg:w-[960px] lg:justify-center lg:border-x lg:border-gray-300'>
        <PageHeader href='/' header='更新履歴' />
        <div className='p-4'>
          <div className='my-4 bg-red-200 px-4 py-2'>
            <div className='flex border-b border-gray-500'>
              <p className='font-bold'>既知の不具合</p>
              <p className='ml-auto mt-auto text-xs text-gray-500'>
                2023/09/11
              </p>
            </div>
            <ul className='list-inside list-disc py-2 text-left text-xs'>
              <li>なし</li>
            </ul>
          </div>

          <hr />

          <ReleaseContent label='機能追加' date='2023/11/29'>
            <li>追加: ゲームのキャッチ画像、紹介文を追加</li>
          </ReleaseContent>

          <ReleaseContent label='機能追加' date='2023/10/03'>
            <li>追加: 期間削除機能を追加</li>
            <li>追加: 発言種別に秘話を追加</li>
          </ReleaseContent>

          <ReleaseContent label='機能追加' date='2023/09/25'>
            <li>
              追加: ユーザープロフィール設定に「プレイヤー情報を公開する」を追加
            </li>
          </ReleaseContent>

          <ReleaseContent label='機能追加' date='2023/09/20'>
            <li>追加: ゲーム設定にゲームオリジナルテーマ設定を追加</li>
          </ReleaseContent>

          <ReleaseContent label='機能追加' date='2023/09/17'>
            <li>追加: ユーザー設定にテーマ変更機能を追加（ライト、ダーク）</li>
          </ReleaseContent>

          <ReleaseContent label='不具合修正' date='2023/09/16'>
            <li>
              不具合修正: ブラウザを閉じるとユーザー設定が初期化される不具合修正
            </li>
            <li>
              不具合修正:
              キーワード通知でキーワードが含まれていなくても通知される不具合修正
            </li>
            <li>
              不具合修正: 昇順指定のとき時系列順に表示されていない不具合を修正
            </li>
          </ReleaseContent>

          <ReleaseContent label='機能追加' date='2023/09/15'>
            <li>
              追加:
              （参加者限定）ユーザー設定にゲーム開始Discord通知、リプライ通知、DM通知、キーワード通知設定を追加
            </li>
          </ReleaseContent>

          <ReleaseContent label='仕様変更' date='2023/09/14'>
            <li>仕様変更: 自分以外のフォロー/フォロワーが見えないように変更</li>
          </ReleaseContent>

          <ReleaseContent label='機能追加' date='2023/09/13'>
            <li>追加: ユーザー設定に1ページあたりの表示件数と昇順降順を追加</li>
          </ReleaseContent>

          <ReleaseContent label='機能追加' date='2023/09/12'>
            <li>追加: 募集範囲、年齢制限ラベルを追加</li>
          </ReleaseContent>

          <ReleaseContent label='機能追加' date='2023/08/27'>
            <li>追加: 退出機能を追加</li>
          </ReleaseContent>

          <ReleaseContent label='機能追加' date='2023/08/25'>
            <li>追加: 返信機能を追加</li>
          </ReleaseContent>

          <ReleaseContent label='機能追加' date='2023/08/24'>
            <li>追加: ランダムキーワードを追加</li>
          </ReleaseContent>

          <ReleaseContent label='機能追加' date='2023/08/18'>
            <li>追加: 発言種別にト書きを追加</li>
          </ReleaseContent>

          <ReleaseContent label='機能追加' date='2023/08/17'>
            <li>追加: エピローグの概念を追加</li>
            <li>追加: 発言種別に独り言を追加</li>
          </ReleaseContent>

          <ReleaseContent label='機能追加' date='2023/08/16'>
            <li>追加: キャラチップ利用</li>
          </ReleaseContent>

          <ReleaseContent label='修正・機能追加' date='2023/08/13'>
            <li>
              不具合修正:
              Safariでサイト越えトラッキングを許可していない場合、リロードするとログアウト状態になる問題に対応
            </li>
            <li>
              不具合修正:
              期間の「分」を設定して保存し再度ゲーム設定画面を開くと「時間」に小数で表示される不具合を修正
            </li>
            <li>追加: GM機能「ステータス・期間変更」追加</li>
          </ReleaseContent>

          <ReleaseContent label='修正・機能追加' date='2023/08/12'>
            <li>
              不具合修正:
              5ページを超えるとページングの動作がおかしくなっていたのを修正
            </li>
            <li>
              追加:{' '}
              <Link className='text-blue-500' href='/rules'>
                ルール
              </Link>
              に「ゲーム作成ルール」を追加
            </li>
            <li>
              追加:
              ホームまたはフォロー中に未読マークがついた状態で切り替えたらすぐに発言取得
            </li>
            <li>追加: GM発言後、ホームタブですぐに発言取得</li>
          </ReleaseContent>

          <ReleaseContent label='機能追加' date='2023/08/11'>
            <li>追加: GMプレイヤー名をゲーム設定一覧に表示</li>
            <li>追加: 参加パスワードを実装</li>
          </ReleaseContent>

          <ReleaseContent label='公開' date='2023/08/10'>
            <li>公開してみました。</li>
          </ReleaseContent>

          <hr />

          <div className='my-4 bg-gray-200 px-4 py-2'>
            <div className='flex border-b border-gray-500'>
              <p className='font-bold'>未実装なものたち</p>
            </div>
            <ul className='list-inside list-disc py-2 text-left text-xs'>
              <li>エラーハンドリングもろもろ</li>
              <li>FAQ</li>
              <li>プレイヤープロフィール（参加履歴的な）</li>
              <li>
                ゲーム内機能
                <ul className='list-inside list-disc pl-4 text-left text-xs'>
                  <li>
                    ゲーム設定
                    <ul className='list-inside list-disc pl-4 text-left text-xs'>
                      <li>終了後DM公開</li>
                    </ul>
                  </li>
                  <li>
                    GM機能
                    <ul className='list-inside list-disc pl-4 text-left text-xs'>
                      <li>kick</li>
                    </ul>
                  </li>

                  <li>
                    発言まわり
                    <ul className='list-inside list-disc pl-8 text-left text-xs'>
                      <li>宛先</li>
                      <li>PL発言（PL発言タイムライン）</li>
                      <li>カットイン</li>
                      <li>
                        ユーザー定義ランダム（ゲームごとに追加削除、diceなど全体で使えるものも）
                      </li>
                      <li>
                        チャットルーム
                        <ul className='list-inside list-disc pl-4 text-left text-xs'>
                          <li>イメージはdiscord</li>
                          <li>GMのみ、誰でも追加可能、発言可能などの設定</li>
                        </ul>
                      </li>
                      <li>DM未読通知・管理</li>
                    </ul>
                  </li>
                  <li>
                    発言抽出
                    <ul className='list-inside list-disc pl-8 text-left text-xs'>
                      <li>宛先</li>
                      <li>自分宛発言</li>
                      <li>ふぁぼった発言</li>
                    </ul>
                  </li>
                  <li>日記</li>
                  <li>
                    ユーザー設定
                    <ul className='list-inside list-disc pl-8 text-left text-xs'>
                      <li>表示設定</li>
                      <li>ミュート</li>
                      <li>画像の大きさ2倍</li>
                      <li>文字の大きさ2倍</li>
                    </ul>
                  </li>
                  <li>開いているタブの保持</li>
                  <li>
                    プロフィール
                    <ul className='list-inside list-disc pl-8 text-left text-xs'>
                      <li>ひとことメモ</li>
                      <li>フォローフリーとか連れ出し歓迎とかのタグ機能</li>
                    </ul>
                  </li>
                  <li>
                    その他UI
                    <ul className='list-inside list-disc pl-8 text-left text-xs'>
                      <li>最上部最下部遷移ボタン</li>
                      <li>発言欄を最下部固定</li>
                      <li>DMの発言を作る際返信のように参照できるようにする</li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </article>
    </main>
  )
}

type ReleaseContentProps = {
  date: string
  label: string
  children: React.ReactNode
}
const ReleaseContent = (props: ReleaseContentProps) => {
  return (
    <div className='my-4 bg-gray-200 px-4 py-2'>
      <div className='flex border-b border-gray-500'>
        <p className='font-bold'>{props.label}</p>
        <p className='ml-auto mt-auto text-xs text-gray-500'>{props.date}</p>
      </div>
      <ul className='list-inside list-disc py-2 text-left text-xs'>
        {props.children}
      </ul>
    </div>
  )
}
