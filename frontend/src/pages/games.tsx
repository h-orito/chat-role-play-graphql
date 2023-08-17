import { createInnerClient } from '@/components/graphql/client'
import Games from '@/components/pages/index/games'
import PageHeader from '@/components/pages/page-header'
import {
  IndexGamesQuery,
  IndexGamesDocument,
  IndexGamesQueryVariables,
  SimpleGame,
  GameStatus
} from '@/lib/generated/graphql'
import Head from 'next/head'

export const getServerSideProps = async () => {
  const client = createInnerClient()
  const { data, error } = await client.query<IndexGamesQuery>({
    query: IndexGamesDocument,
    variables: {
      pageSize: 100000,
      pageNumber: 1,
      statuses: [
        GameStatus.Cancelled,
        GameStatus.Opening,
        GameStatus.Recruiting,
        GameStatus.Progress,
        GameStatus.Epilogue,
        GameStatus.Finished
      ]
    } as IndexGamesQueryVariables
  })
  if (error) {
    console.log(error)
    return {
      props: {
        games: []
      }
    }
  }
  return {
    props: {
      games: data.games
    }
  }
}

type Props = {
  games: SimpleGame[]
}

export default function GamesPage({ games }: Props) {
  return (
    <main className='w-full lg:flex lg:justify-center'>
      <Head>
        <title>ロールをプレイ！ | ゲーム一覧</title>
      </Head>
      <article className='min-h-screen w-full text-center lg:w-[960px] lg:justify-center lg:border-x lg:border-gray-300'>
        <PageHeader href='/' header='ゲーム一覧' />
        <div className='p-4'>
          {games.length > 0 ? (
            <Games games={games} />
          ) : (
            <p>ゲームがありません。</p>
          )}
        </div>
      </article>
    </main>
  )
}
