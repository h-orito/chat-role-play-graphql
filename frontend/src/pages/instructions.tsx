import PageHeader from '@/components/pages/page-header'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import Head from 'next/head'
import Link from 'next/link'

export default function Instructions() {
  return (
    <main className='w-full lg:flex lg:justify-center'>
      <Head>
        <title>ロールをプレイ！ | 説明書</title>
      </Head>
      <article className='min-h-screen w-full text-center lg:w-[960px] lg:justify-center lg:border-x lg:border-gray-300'>
        <PageHeader href='/' header='説明書' />
        <div className='p-4'>
          <div className='my-4 bg-gray-200 px-4 py-2'>
            <div className='flex border-b border-gray-500'>
              <p className='font-bold'>ゲーム参加までの流れ</p>
            </div>
            <ul className='list-inside list-disc py-2 text-left text-xs'>
              <li>
                トップページ「Register /
                Login」より「ログイン」してください（新規登録もこのボタンです）
                <ul className='ml-4 list-inside list-disc py-2 text-left text-xs'>
                  <li>
                    未登録の場合は表示された画面下側の「サインアップ」より新規登録してください
                  </li>
                  <li>
                    登録済みの場合はユーザー名またはメールアドレスとパスワードを入力してログインしてください
                  </li>
                  <li>
                    ここで入力されたユーザー名、メールアドレス、パスワードは他利用者に公表されることはありません
                  </li>
                </ul>
              </li>
              <li>
                ロールをプレイ！トップページに戻ってきたら、「ようこそ
                未登録さん」になっているはずなので、「ユーザー編集」よりユーザー名を変更してください
                <ul className='ml-4 list-inside list-disc py-2 text-left text-xs'>
                  <li>
                    このユーザー名は公開情報です（現状は他人のユーザー名が参照できる導線がありませんが、いずれ増えます）
                  </li>
                  <li>
                    このユーザー名はいわゆるPL名であり、PC名ではありません（PL名は各ゲーム参加時に設定します）
                  </li>
                </ul>
              </li>
              <li>
                いよいよゲームへの参加です
                <ul className='ml-4 list-inside list-disc py-2 text-left text-xs'>
                  <li>開催中のゲームを選択し、ゲーム画面に遷移してください</li>
                  <li>
                    状態が「公開中」の場合、ゲーム自体は閲覧できますが、まだ参加することはできません
                  </li>
                  <li>
                    同様に、状態が「終了」「中止」の場合は参加することができません
                  </li>
                  <li>状態が「参加者募集中」「開催中」の場合、参加できます</li>
                  <li>
                    画面左の「参加登録」から参加することができます（スマホの場合、フッターメニューの一番左の項目をタップすると左メニューを表示できます）
                  </li>
                  <li>
                    参加登録後、同じく左メニューから自分のプロフィール画面を開くと、アイコン登録やプロフィール編集などが行なえます
                  </li>
                </ul>
              </li>
              <li>
                プロフィールの編集
                <ul className='ml-4 list-inside list-disc py-2 text-left text-xs'>
                  <li>
                    参加登録後、同じく左メニューから自分のプロフィール画面を開くと、アイコン登録やプロフィール編集などが行なえます
                  </li>
                  <li>
                    アイコンを1つ以上登録しないとプロフィールアイコン（参加者一覧に表示する用のアイコン）を設定することはできません
                  </li>
                </ul>
              </li>
              <li>
                発言
                <ul className='ml-4 list-inside list-disc py-2 text-left text-xs'>
                  <li>アイコンを1つ以上登録しないと発言することができません</li>
                  <li>
                    ホーム画面またはフォロー画面の右下に表示される{' '}
                    <PencilSquareIcon className='h-4 w-4' />{' '}
                    をクリックすると発言フォームを表示できます
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div className='my-4 bg-gray-200 px-4 py-2'>
            <div className='flex border-b border-gray-500'>
              <p className='font-bold'>ゲーム作成</p>
            </div>
            <ul className='list-inside list-disc py-2 text-left text-xs'>
              <li>
                トップページ「Register /
                Login」より「ログイン」してください（新規登録もこのボタンです）
              </li>
              <li>
                トップページ「ゲーム作成」よりゲーム作成画面に遷移してください
              </li>
              <li>
                ゲーム作成画面の項目ごとに説明があるため、それに従って入力してください
              </li>
              <li>
                全項目後から変更できるうえ、「公開開始日時」を迎えるまでは作成したゲームはトップページやゲーム一覧に表示されないので、作成時点でミスがあっても大丈夫です
              </li>
            </ul>
          </div>
          <div className='my-4 bg-gray-200 px-4 py-2'>
            <div className='flex border-b border-gray-500'>
              <p className='font-bold'>その他</p>
            </div>
            <ul className='list-inside list-disc py-2 text-left text-xs'>
              <li>
                <Link className='text-blue-500' href='/release-note'>
                  更新履歴
                </Link>
                に更新情報や実装予定の機能などを記載しています
              </li>
            </ul>
          </div>
        </div>
      </article>
    </main>
  )
}
