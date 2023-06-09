import { createClient, createInnerClient } from '@/components/graphql/client'
import { idToBase64 } from '@/components/graphql/convert'
import {
  Game,
  GameDocument,
  GameQuery,
  GameQueryVariables
} from '@/lib/generated/graphql'
import { gql } from '@apollo/client'

const game = gql`
  query Game($id: ID!) {
    game(id: $id) {
      id
      name
      status
      participants {
        id
      }
      periods {
        id
      }
      settings {
        chara {
          canOriginalCharacter
        }
        capacity {
          min
          max
        }
        rule {
          canShorten
          canSendDirectMessage
        }
        time {
          periodPrefix
          periodSuffix
          periodIntervalSeconds
          openAt
          startParticipateAt
          startGameAt
        }
        password {
          hasPassword
        }
      }
    }
  }
`

export const getServerSideProps = async (context: any) => {
  const { id } = context.params
  const client = createInnerClient()
  const { data } = await client.query<GameQuery>({
    query: GameDocument,
    variables: { id: idToBase64(id, 'Game') } as GameQueryVariables
  })
  return {
    props: {
      game: data.game
    }
  }
}

type Props = {
  game: Game
}

export default function GamePage({ game }: Props) {
  console.log(game)
  return (
    <main>
      <h1>{game.name}</h1>
    </main>
  )
}
