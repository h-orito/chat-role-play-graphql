import { createInnerClient } from '@/components/graphql/client'
import CharachipCards from '@/components/pages/charachips/charachip-cards'
import PageHeader from '@/components/pages/page-header'
import {
  CharachipDetailsQuery,
  CharachipDetailsDocument,
  CharachipDetailsQueryVariables,
  CharachipsQuery,
  Charachip,
  Chara,
  PageableQuery
} from '@/lib/generated/graphql'
import Head from 'next/head'

export const getServerSideProps = async () => {
  const client = createInnerClient()
  const { data, error } = await client.query<CharachipDetailsQuery>({
    query: CharachipDetailsDocument,
    variables: {
      query: {
        paging: {
          pageSize: 100000,
          pageNumber: 1,
          isDesc: false,
          isLatest: false
        } as PageableQuery
      } as CharachipsQuery
    } as CharachipDetailsQueryVariables
  })
  if (error) {
    console.log(error)
    return {
      props: {
        charachips: []
      }
    }
  }
  return {
    props: {
      charachips: data.charachips.map((c) => {
        // 最初の5キャラに絞る
        const charas = c.charas == null ? [] : c.charas.slice(0, 5)
        return {
          ...c,
          charas: charas.map((ch) => {
            const cis = ch.images == null ? [] : ch.images
            return {
              ...ch,
              images: cis.filter((ci) => ci.type === 'NORMAL') // 通常画像のみ
            } as Chara
          })
        } as Charachip
      })
    }
  }
}

type Props = {
  charachips: Charachip[]
}

export default function CharachipsPage({ charachips }: Props) {
  return (
    <main className='w-full lg:flex lg:justify-center'>
      <Head>
        <title>ロールをプレイ！ | キャラチップ一覧</title>
      </Head>
      <article className='min-h-screen w-full text-center lg:w-[960px] lg:justify-center lg:border-x lg:border-gray-300'>
        <PageHeader href='/' header='キャラチップ一覧' />
        <div className='p-4'>
          {charachips.length > 0 ? (
            <CharachipCards charachips={charachips} />
          ) : (
            <p>キャラチップがありません。</p>
          )}
          <div className='my-4'>
            <label className='text-lg font-bold'>キャラチップ制作者様へ</label>
            <ul className='list-inside list-disc py-2 text-left text-xs leading-5'>
              <li>キャラチップを提供いただきありがとうございます。</li>

              <li>
                ロールをプレイ！専用のキャラチップを提供いただける場合、以下の設定ファイル生成補助機能を利用いただき、キャラチップ画像と共にzipに含めていただけますと幸いです。
              </li>
              <li>
                <a
                  className='text-blue-500'
                  href='https://docs.google.com/spreadsheets/d/1mY5Du8Mu6HXnBYqoKHNOiMLBjCgFU2R9C2EaCUXwVaM/edit?usp=sharing'
                  target='blank_'
                >
                  キャラチップ設定ファイル作成補助
                </a>
              </li>
              <li>
                上記ツール内にも記載していますが、各画像のサイズや比率は以下の仕様となっております。
                <ul className='ml-4 list-inside list-disc py-2 text-left text-xs leading-5'>
                  <li>
                    プロフィール画像（キャラごとに0-1枚）:
                    幅400px高さ可変で表示。幅400pxの倍数で作成を推奨
                  </li>
                  <li>
                    アイコン画像（キャラごとに1枚以上）:
                    指定されたサイズで表示可能。オリジナルキャラクターが60pxで表示なので、合わせるのであれば60pxの倍数で作成を推奨
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
