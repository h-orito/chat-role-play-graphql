// import Image from 'next/image'
import styles from './index.module.css'
import { LoginButton, LogoutButton } from '@/components/auth/auth'
import useAuth from '@/components/auth/use-auth'
import { gql, useQuery } from '@apollo/client'
import { createClient, createInnerClient } from '@/components/graphql/client'
import {
  SimpleGame,
  IndexGamesDocument,
  IndexGamesQueryVariables,
  IndexGamesQuery
} from '@/lib/generated/graphql'
import Link from 'next/link'
import { base64ToId } from '@/components/graphql/convert'

const indexGames = gql`
  query IndexGames($pageSize: Int!, $pageNumber: Int!) {
    games(
      query: {
        paging: { pageSize: $pageSize, pageNumber: $pageNumber, isDesc: true }
      }
    ) {
      id
      name
      participantsCount
    }
  }
`

export const getServerSideProps = async () => {
  const client = createInnerClient()
  const { data, error } = await client.query<IndexGamesQuery>({
    query: IndexGamesDocument,
    variables: { pageSize: 10, pageNumber: 1 } as IndexGamesQueryVariables
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

export default function Index({ games }: Props) {
  console.log(games)
  return (
    <main className={styles.main}>
      <UserInfo />
      <Games games={games} />
    </main>
  )
}

type GamesProps = {
  games: SimpleGame[]
}

const Games = ({ games }: GamesProps) => {
  // const { loading, error, data } = useQuery<IndexGamesQuery>(
  //   IndexGamesDocument,
  //   {
  //     variables: { pageSize: 10, pageNumber: 1 } as IndexGamesQueryVariables
  //   }
  // )

  // if (loading) {
  //   return <div>Loading...</div>
  // }
  // if (error) {
  //   console.error(error)
  //   return <div>Error!</div>
  // }
  return (
    <div>
      {games.map((g, idx) => {
        const id = base64ToId(g.id)

        return (
          <div key={idx}>
            <p>
              <Link href={`/games/${id}`}>{g.name}</Link>
            </p>
          </div>
        )
      })}
    </div>
  )
}

const UserInfo = () => {
  const authState: AuthState = useAuth()
  if (authState.isLoading) return <div>Authentication Loading...</div>
  if (!authState.isAuthenticated) {
    return <LoginButton />
  }
  return (
    <div>
      <p>{authState.userName}</p>
      <LogoutButton />
    </div>
  )
}
