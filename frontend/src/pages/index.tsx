// import Image from 'next/image'
import styles from './index.module.css'
import { LoginButton, LogoutButton } from '@/components/auth/auth'
import useAuth from '@/components/auth/use-auth'
import { gql, useQuery } from '@apollo/client'
import {
  SimpleGame,
  IndexGamesDocument,
  IndexGamesQueryVariables,
  IndexGamesQuery
} from '@/lib/generated/graphql'

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

export default function Index() {
  const authState: AuthState = useAuth()
  if (authState.isLoading) return <div>Loading...</div>
  return (
    <main className={styles.main}>
      <p>{authState.userName}</p>
      <Games />
      {authState.isAuthenticated ? <LogoutButton /> : <LoginButton />}
    </main>
  )
}

const Games = () => {
  const { loading, error, data } = useQuery<IndexGamesQuery>(
    IndexGamesDocument,
    {
      variables: { pageSize: 10, pageNumber: 1 } as IndexGamesQueryVariables
    }
  )

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    console.error(error)
    return <div>Error!</div>
  }
  return (
    <div>
      {data?.games.map((g, idx) => {
        return (
          <div key={idx}>
            <p>
              {g.id}. {g.name} ({g.participantsCount}人)
            </p>
          </div>
        )
      })}
    </div>
  )
}
