import {
  Game,
  GameMessagesQuery,
  GameParticipant,
  Message,
  Messages,
  MessagesQuery,
  PageableQuery
} from '@/lib/generated/graphql'
import MessageComponent from './message'
import Paging from '../paging'
import { useEffect, useState } from 'react'
import SearchCondition from './search-condition'
import { LazyQueryExecFunction, OperationVariables } from '@apollo/client'

type Props = {
  game: Game
  className?: string
  myself: GameParticipant | null
  fetchMessages: LazyQueryExecFunction<GameMessagesQuery, OperationVariables>
  openProfileModal: (participantId: string) => void
  openFavoritesModal: (messageId: string) => void
  onlyFollowing?: boolean
}

export default function MessageArea({
  game,
  className,
  myself,
  fetchMessages,
  openProfileModal,
  openFavoritesModal,
  onlyFollowing = false
}: Props) {
  const defaultMessageQuery: MessagesQuery = {
    senderIds: onlyFollowing ? myself?.followParticipantIds : null,
    paging: {
      pageSize: 10,
      pageNumber: 1,
      isDesc: true
    }
  }

  const [messages, setMessages] = useState<Messages>({
    list: [],
    allPageCount: 0,
    hasPrePage: false,
    hasNextPage: false,
    isDesc: true
  })
  const [messageQuery, setMessageQuery] = useState(defaultMessageQuery)

  const search = async (query: MessagesQuery) => {
    const newQuery = {
      ...query
    }
    setMessageQuery(newQuery)
    const { data } = await fetchMessages({
      variables: {
        gameId: game.id,
        query: newQuery
      } as MessagesQuery
    })
    if (data?.messages == null) return
    setMessages(data.messages as Messages)
  }

  useEffect(() => {
    search(defaultMessageQuery)
  }, [])

  const setPageableQuery = (pageNumber: number) => {
    const newQuery = {
      ...messageQuery,
      paging: {
        ...messageQuery.paging,
        pageNumber
      } as PageableQuery
    } as MessagesQuery
    setMessageQuery(newQuery)
    search(newQuery)
  }

  return (
    <div className={`${className} flex flex-1 flex-col overflow-y-auto`}>
      <div className='flex'>
        <SearchCondition
          game={game}
          myself={myself}
          messageQuery={messageQuery}
          search={search}
          onlyFollowing={onlyFollowing}
        />
      </div>
      <Paging
        messages={messages}
        query={messageQuery.paging as PageableQuery | undefined}
        setQuery={setPageableQuery}
      />
      <div className='flex-1 overflow-y-auto'>
        {messages.list.map((message: Message) => (
          <MessageComponent
            game={game}
            message={message}
            myself={myself}
            key={message.id}
            openProfileModal={openProfileModal}
            openFavoritesModal={openFavoritesModal}
          />
        ))}
      </div>
      <Paging
        messages={messages}
        query={messageQuery.paging as PageableQuery | undefined}
        setQuery={setPageableQuery}
      />
    </div>
  )
}
