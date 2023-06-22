import { createClient, createInnerClient } from '@/components/graphql/client'
import { idToBase64 } from '@/components/graphql/convert'
import Article from '@/components/pages/games/article/article'
import Sidebar from '@/components/pages/games/sidebar/sidebar'
import {
  Game,
  GameDocument,
  GameMessagesDocument,
  GameMessagesQuery,
  GameMessagesQueryVariables,
  GameQuery,
  GameQueryVariables,
  Messages
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

const messageQ = gql`
  query GameMessages($gameId: ID!) {
    messages(gameId: $gameId, query: {}) {
      list {
        id
        content {
          type
          text
          number
          isConvertDisabled
        }
        time {
          sendAt
          sendUnixTimeMilli
        }
        sender {
          participantId
          charaName
          charaImage {
            size {
              width
              height
            }
            url
          }
        }
        replyTo {
          messageId
          participantId
        }
        reactions {
          replyCount
          favoriteCount
        }
      }
      allPageCount
      hasPrePage
      hasNextPage
      currentPageNumber
      isDesc
    }
  }
`

export const getServerSideProps = async (context: any) => {
  const { id } = context.params
  const client = createInnerClient()
  const gameId = idToBase64(id, 'Game')
  const { data: gamedata } = await client.query<GameQuery>({
    query: GameDocument,
    variables: { id: gameId } as GameQueryVariables
  })
  const { data: messagedata } = await client.query<GameMessagesQuery>({
    query: GameMessagesDocument,
    variables: { gameId } as GameMessagesQueryVariables
  })
  return {
    props: {
      game: gamedata.game,
      messages: messagedata.messages
    }
  }
}

type Props = {
  game: Game
  messages: Messages
}

export default function GamePage({ game, messages }: Props) {
  return (
    <main className='flex'>
      <Sidebar game={game} />
      <Article game={game} messages={messages} />
    </main>
  )
}
