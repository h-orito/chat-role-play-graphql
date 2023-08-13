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
                2023/08/13
              </p>
            </div>
            <ul className='list-inside list-disc py-2 text-left text-xs'>
              <li>なし</li>
            </ul>
          </div>

          <hr />

          <div className='my-4 bg-gray-200 px-4 py-2'>
            <div className='flex border-b border-gray-500'>
              <p className='font-bold'>修正・機能追加</p>
              <p className='ml-auto mt-auto text-xs text-gray-500'>
                2023/08/13
              </p>
            </div>
            <ul className='list-inside list-disc py-2 text-left text-xs'>
              <li>
                不具合修正:
                Safariでサイト越えトラッキングを許可していない場合、リロードするとログアウト状態になる問題に対応
              </li>
              <li>
                不具合修正:
                期間の「分」を設定して保存し再度ゲーム設定画面を開くと「時間」に小数で表示される不具合を修正
              </li>
              <li>追加: GM機能「ステータス・期間変更」追加</li>
            </ul>
          </div>

          <div className='my-4 bg-gray-200 px-4 py-2'>
            <div className='flex border-b border-gray-500'>
              <p className='font-bold'>修正・機能追加</p>
              <p className='ml-auto mt-auto text-xs text-gray-500'>
                2023/08/12
              </p>
            </div>
            <ul className='list-inside list-disc py-2 text-left text-xs'>
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
            </ul>
          </div>

          <div className='my-4 bg-gray-200 px-4 py-2'>
            <div className='flex border-b border-gray-500'>
              <p className='font-bold'>追加実装</p>
              <p className='ml-auto mt-auto text-xs text-gray-500'>
                2023/08/11
              </p>
            </div>
            <ul className='list-inside list-disc py-2 text-left text-xs'>
              <li>追加: GMプレイヤー名をゲーム設定一覧に表示</li>
              <li>追加: 参加パスワードを実装</li>
            </ul>
          </div>
          <div className='my-4 bg-gray-200 px-4 py-2'>
            <div className='flex border-b border-gray-500'>
              <p className='font-bold'>公開</p>
              <p className='ml-auto mt-auto text-xs text-gray-500'>
                2023/08/10
              </p>
            </div>
            <ul className='list-inside list-disc py-2 text-left text-xs'>
              <li>公開してみました。</li>
            </ul>
          </div>

          <hr />

          <div className='my-4 bg-gray-200 px-4 py-2'>
            <div className='flex border-b border-gray-500'>
              <p className='font-bold'>未実装なものたち</p>
            </div>
            <ul className='list-inside list-disc py-2 text-left text-xs'>
              <li>エラーハンドリングもろもろ</li>
              <li>サイト紹介</li>
              <li>FAQ</li>
              <li>プレイヤープロフィール（参加履歴的な）</li>
              <li>
                エピローグの概念
                <ul className='list-inside list-disc pl-4 text-left text-xs'>
                  <li>エピローグ開始日時を設定</li>
                  <li>独り言やDMなどの秘匿発言を公開</li>
                </ul>
              </li>
              <li>
                ゲーム内機能
                <ul className='list-inside list-disc pl-4 text-left text-xs'>
                  <li>
                    ゲーム設定
                    <ul className='list-inside list-disc pl-4 text-left text-xs'>
                      <li>レーティング</li>
                      <li>キャッチ画像</li>
                      <li>テーマ（最低限ライトとダークモード）</li>
                      <li>
                        キャラチップ利用
                        <ul className='ml-8 list-inside list-disc text-left text-xs'>
                          <li>現在許可いただいているキャラチップ</li>
                          <li>灰色の研究</li>
                          <li>メトロポリス</li>
                          <li>バビロン</li>
                          <li>ギルガメシュ</li>
                          <li>ヴァルハラ</li>
                          <li>わんダフル</li>
                          <li>Mad Party</li>
                          <li>Fragment of Jewels</li>
                          <li>feel 僧 good</li>
                          <li>御常紀学園</li>
                          <li>他種族孤児院</li>
                          <li>花園女学院</li>
                          <li>おりふし学園</li>
                          <li>salute</li>
                        </ul>
                      </li>
                      <li>終了後DM公開</li>
                    </ul>
                  </li>
                  <li>
                    発言まわり
                    <ul className='list-inside list-disc pl-8 text-left text-xs'>
                      <li>独り言</li>
                      <li>返信</li>
                      <li>宛先</li>
                      <li>PL発言（PL発言タイムライン）</li>
                      <li>カットイン</li>
                      <li>
                        ランダム発言（ゲームごとに追加削除、diceなど全体で使えるものも）
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
                    </ul>
                  </li>
                  <li>日記</li>
                  <li>
                    ユーザー設定
                    <ul className='list-inside list-disc pl-8 text-left text-xs'>
                      <li>通知</li>
                      <li>表示設定</li>
                      <li>ミュート</li>
                      <li>ページングのページサイズ</li>
                      <li>上が新しい、下が新しい</li>
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
                      <li>PL秘匿オンオフ</li>
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
