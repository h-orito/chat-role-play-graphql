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
          isDesc: false
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
        </div>
      </article>
    </main>
  )
}
