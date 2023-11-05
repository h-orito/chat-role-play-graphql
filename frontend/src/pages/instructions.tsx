import MessageText from '@/components/pages/games/article/message-area/message-text/message-text'
import PageHeader from '@/components/pages/page-header'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import Head from 'next/head'
import Link from 'next/link'

export default function Instructions() {
  const decorates = [
    '[b]文字列[/b]',
    '[i]文字列[/i]',
    '[u]文字列[/u]',
    '[s]文字列[/s]',
    'e[sup]2[/sup]',
    '[sub]4[/sub]C[sub]2[/sub]',
    '[small]文字列[/small]',
    '[large]文字列[/large]',
    '[huge]文字列[/huge]',
    '[kusodeka]文字列[/kusodeka]',
    '[#fff]文字列[/#]',
    '[#ffffff]文字列[/#]',
    '[ruby]漢字[rt]かんじ[/rt][/ruby]'
  ]
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
                <ul className='ml-4 list-inside list-disc py-1 text-left text-xs leading-5'>
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
                <ul className='ml-4 list-inside list-disc py-1 text-left text-xs leading-5'>
                  <li>このユーザー名は公開情報です</li>
                  <li>
                    このユーザー名はいわゆるPL名であり、PC名ではありません（PC名は各ゲーム参加時に設定します）
                  </li>
                </ul>
              </li>
              <li>
                いよいよゲームへの参加です
                <ul className='ml-4 list-inside list-disc py-1 text-left text-xs leading-5'>
                  <li>
                    開催中のゲームを選択し、ゲーム画面に遷移してください
                    <ul className='ml-4 list-inside list-disc py-1 text-left text-xs leading-5'>
                      <li>
                        状態が「公開中」の場合、ゲーム自体は閲覧できますが、まだ参加することはできません
                      </li>
                      <li>
                        同様に、状態が「終了」「中止」の場合は参加することができません
                      </li>
                      <li>
                        状態が「参加者募集中」「開催中」の場合、参加できます
                      </li>
                    </ul>
                  </li>
                  <li>
                    画面左の「参加登録」から参加することができます（スマホの場合、フッターメニューの一番左の項目をタップすると左メニューを表示できます）
                    <ul className='ml-4 list-inside list-disc py-1 text-left text-xs leading-5'>
                      <li>
                        キャラチップを利用できるゲーム設定の場合、オリジナルキャラクターで参加するか、キャラチップを利用して参加するかを選べます
                      </li>
                      <li>
                        オリジナルキャラクターで参加する場合は、
                        <Link
                          href={'/rules'}
                          target='_blank'
                          className='text-blue-500'
                        >
                          ルール
                        </Link>
                        のオリジナルキャラクターまわりをご確認のうえ参加してください
                      </li>
                      <li>
                        キャラチップを利用して参加する場合も、
                        <Link
                          href={'/rules'}
                          target='_blank'
                          className='text-blue-500'
                        >
                          ルール
                        </Link>
                        のキャラチップ利用まわりをご確認のうえ参加してください
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                プロフィールの編集
                <ul className='ml-4 list-inside list-disc py-1 text-left text-xs leading-5'>
                  <li>
                    参加登録後、同じく左メニューから自分のプロフィール画面を開くと、アイコン登録やプロフィール編集などが行なえます
                    <ul className='ml-8 list-inside list-disc py-1 text-left text-xs leading-5'>
                      <li>
                        キャラチップ利用の場合、アイコン登録やプロフィール画像登録などは行えません
                      </li>
                      <li>
                        名称変更不可キャラチップ利用の場合、名前も変更できません
                      </li>
                    </ul>
                  </li>
                  <li>
                    アイコンを1つ以上登録しないとプロフィールアイコン（参加者一覧に表示する用のアイコン）を設定することはできません
                  </li>
                </ul>
              </li>
              <li>
                発言
                <ul className='ml-4 list-inside list-disc py-1 text-left text-xs leading-5'>
                  <li>
                    アイコンを1つ以上登録しないと発言することができません
                    <ul className='ml-8 list-inside list-disc py-1 text-left text-xs leading-5'>
                      <li>
                        キャラチップ利用の場合、最初からキャラに応じたアイコンが登録されています
                      </li>
                    </ul>
                  </li>
                  <li>
                    ホーム画面またはフォロー画面の右下に表示される{' '}
                    <PencilSquareIcon className='h-4 w-4' />{' '}
                    をクリックすると発言フォームを表示できます
                  </li>
                </ul>
              </li>
              <li>
                ユーザー設定
                <ul className='ml-4 list-inside list-disc py-1 text-left text-xs leading-5'>
                  <li>
                    メッセージの表示順や、1ページあたりの表示件数を変更することができます。
                  </li>
                  <li>
                    ゲーム開始、返信、DM、キーワード通知をDiscord Webhook
                    URLを設定することで通知することができます。
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div className='my-4 bg-gray-200 px-4 py-2'>
            <div className='flex border-b border-gray-500'>
              <p className='font-bold'>ゲームの状態と期間</p>
            </div>
            <ul className='list-inside list-disc py-2 text-left text-xs leading-5'>
              <li>
                ゲームの状態は以下の7つです
                <ul className='ml-4 list-inside list-disc py-1 text-left text-xs leading-5'>
                  <li>
                    公開前:
                    ゲームを作成するとこの状態になります。トップページのゲーム一覧には表示されません。
                  </li>
                  <li>
                    公開中:
                    トップページのゲーム一覧に表示されますが、ゲームマスター以外は参加登録ができません。
                  </li>
                  <li>参加者募集中: 参加登録が可能です。</li>
                  <li>
                    開催中: ゲームが開始された状態です。参加登録が可能です。
                  </li>
                  <li>
                    エピローグ:
                    プレイヤーや独り言、秘話などの秘匿情報が公開されます。
                  </li>
                  <li>
                    終了:
                    ゲームが終了した状態です。発言など各種操作が行えなくなります。
                  </li>
                  <li>
                    中止: ゲームを中止した状態です。人狼ゲームでいうと廃村です。
                  </li>
                </ul>
              </li>
              <li>
                状態のほかに、期間の概念があります。人狼ゲームでいうと、1日目,
                2日目, ..などです。
                <ul className='ml-4 list-inside list-disc py-1 text-left text-xs leading-5'>
                  <li>
                    公開前～参加者募集中の間は、「プロローグ」という期間になります。
                  </li>
                  <li>
                    ゲームが開始され、「開催中」になると、1つ目の期間が始まります。例.
                    1日目
                  </li>
                  <li>
                    開催中は、1期間ごとの時間が経過するごとに、2日目, 3日目,
                    ..と進んでいきます。
                  </li>
                  <li>
                    期間名の法則や長さはGMが自由に決めることができます。例えば接頭辞を「第」、接尾辞を「学期」にすれば、第1学期,
                    第2学期, ..と進んでいきます。
                  </li>
                  <li>
                    エピローグを迎えると、「エピローグ」という期間になります。
                  </li>
                  <li>
                    プロローグやエピローグを含め、後からGMが期間名を編集・削除することもできます。
                  </li>
                  <li>
                    1期間ごとに日記を作成することができます（未実装）。日記は、次の期間になると他の人が閲覧することができるようになります。
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div className='my-4 bg-gray-200 px-4 py-2'>
            <div className='flex border-b border-gray-500'>
              <p className='font-bold'>文字装飾とランダムキーワード</p>
            </div>
            <ul className='list-inside list-disc py-2 text-left text-xs leading-5'>
              <li>
                発言やプロフィールの自己紹介に以下の文言を含めると、文字を装飾できます。
                <br />
                入力中の文字列を選択しながら装飾ボタンを押すと、その文字列に対して装飾が適用されます。
                <ul className='ml-4 list-inside list-disc py-1 text-left text-xs leading-5'>
                  {decorates.map((d) => (
                    <li key={d}>
                      {d} →&nbsp;
                      <MessageText rawText={d} />
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                発言に以下のランダムキーワードを含めると、キーワードに応じてランダムな内容に変換されます。
                <ul className='ml-4 list-inside list-disc py-1 text-left text-xs leading-5'>
                  <li>
                    [2d6] →&nbsp;
                    <MessageText rawText='7(3,4)[2d6]' />:
                    mDnとすると、n面ダイスをm回振った結果が出力されます。
                  </li>
                  <li>
                    [fortune] →&nbsp;
                    <MessageText rawText='99[fortune]' />:
                    1~100のランダムな数字が出力されます。
                  </li>
                  <li>
                    [AAAorBBBorCCC] →&nbsp;
                    <MessageText rawText='AAA[AAAorBBBorCCC]' />:
                    orで区切ったもののいずれかが出力されます。
                  </li>
                  <li>
                    [who] →&nbsp;
                    <MessageText rawText='太郎[who]' />:
                    参加者のいずれかの名前が出力されます。
                  </li>
                </ul>
              </li>
              <li>
                発言の際「装飾やランダム変換しない」にチェックを入れた場合は、装飾や変換されず、そのまま表示されます。
              </li>
            </ul>
          </div>
          <div className='my-4 bg-gray-200 px-4 py-2'>
            <div className='flex border-b border-gray-500'>
              <p className='font-bold'>ゲーム作成</p>
            </div>
            <ul className='list-inside list-disc py-2 text-left text-xs leading-5'>
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
                一部項目を除き後から変更できるうえ、「公開開始日時」を迎えるまでは作成したゲームはトップページやゲーム一覧に表示されないので、作成時点でミスがあっても大丈夫です
              </li>
              <li>変更できない項目は作成画面上に明記しています</li>
            </ul>
          </div>
          <div className='my-4 bg-gray-200 px-4 py-2'>
            <div className='flex border-b border-gray-500'>
              <p className='font-bold'>その他</p>
            </div>
            <ul className='list-inside list-disc py-2 text-left text-xs leading-5'>
              <li>
                <Link className='text-blue-500' href='/release-note'>
                  更新履歴
                </Link>
                に更新情報や実装予定の機能などを記載しています
              </li>
              <li>
                動作確認はGoogle Chrome（Windows, iPhone）で行っています。
              </li>
              <li>
                個人開発のため、全体的にベストエフォートでの対応となります。
              </li>
              <li>
                サイト名略称は「ロルオプ」「をプ」と呼んでいただけると（エゴサ的に）ありがたいです。
              </li>
            </ul>
          </div>
        </div>
      </article>
    </main>
  )
}
