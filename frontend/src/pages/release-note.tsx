import PageHeader from '@/components/pages/page-header'
import Head from 'next/head'

export default function CreateGame() {
  return (
    <main className='w-full lg:flex lg:justify-center'>
      <Head>
        <title>ロールをプレイ！ | 更新履歴</title>
      </Head>
      <article className='min-h-screen w-full text-center lg:w-[960px] lg:justify-center lg:border-x lg:border-gray-300'>
        <PageHeader href='/' header='更新履歴' />
        <div className='p-4'>
          <div className='my-4 bg-gray-200 px-4 py-2'>
            <div className='flex border-b border-gray-500'>
              <p className='font-bold'>公開</p>
              <p className='ml-auto mt-auto text-xs text-gray-500'>
                2023/07/25
              </p>
            </div>
            <ul className='list-inside list-disc py-2 text-left text-xs'>
              <li>公開してみました。</li>
            </ul>
          </div>
          <div className='my-4 bg-gray-200 px-4 py-2'>
            <div className='flex border-b border-gray-500'>
              <p className='font-bold'>未実装なものたち</p>
            </div>
            <ul className='list-inside list-disc py-2 text-left text-xs'>
              <li>エラーハンドリングもろもろ</li>
              <li>サイト紹介</li>
              <li>利用規約</li>
              <li>プライバシーポリシー</li>
              <li>FAQ</li>
              <li>プレイヤープロフィール（参加履歴的な）</li>
              <li>
                ゲーム内機能
                <ul className='list-inside list-disc pl-4 text-left text-xs'>
                  <li>
                    GM機能
                    <ul className='list-inside list-disc pl-4 text-left text-xs'>
                      <li>ゲーム削除</li>
                      <li>手動期間更新、ステータス更新</li>
                    </ul>
                  </li>
                  <li>
                    ゲーム設定
                    <ul className='list-inside list-disc pl-4 text-left text-xs'>
                      <li>参加パスワード（あるけど機能してない）</li>
                      <li>レーティング</li>
                      <li>キャッチ画像</li>
                      <li>テーマ（最低限ライトとダークモード）</li>
                      <li>キャラチップ利用</li>
                    </ul>
                  </li>
                  <li>
                    発言まわり
                    <ul className='list-inside list-disc pl-8 text-left text-xs'>
                      <li>発言したら最新取得</li>
                      <li>返信</li>
                      <li>宛先</li>
                      <li>PL発言（PL発言タイムライン）</li>
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
                    </ul>
                  </li>
                  <li>開いているタブの保持</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </article>
    </main>
  )
}
