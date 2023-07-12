import {
  Game,
  GameMessagesQuery,
  GameParticipant,
  Message,
  Messages,
  MessagesLatestQuery,
  MessagesQuery,
  PageableQuery
} from '@/lib/generated/graphql'
import MessageComponent from './message'
import Paging from '../paging'
import { useEffect, useRef, useState } from 'react'
import SearchCondition from './search-condition'
import { LazyQueryExecFunction, OperationVariables } from '@apollo/client'

type Props = {
  game: Game
  className?: string
  myself: GameParticipant | null
  fetchMessages: LazyQueryExecFunction<GameMessagesQuery, OperationVariables>
  fetchMessagesLatest: LazyQueryExecFunction<
    MessagesLatestQuery,
    OperationVariables
  >
  openProfileModal: (participantId: string) => void
  openFavoritesModal: (messageId: string) => void
  isViewing: boolean
  existsUnread: boolean
  setExistUnread: (exist: boolean) => void
  onlyFollowing?: boolean
}

export default function MessageArea({
  game,
  className,
  myself,
  fetchMessages,
  fetchMessagesLatest,
  openProfileModal,
  openFavoritesModal,
  isViewing,
  existsUnread,
  setExistUnread,
  onlyFollowing = false
}: Props) {
  const defaultMessageQuery: MessagesQuery = {
    senderIds: onlyFollowing
      ? [...myself!.followParticipantIds, myself!.id]
      : null,
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
    isDesc: true,
    latestUnixTimeMilli: 0
  })
  const [latestTime, setLatestTime] = useState<number>(0)
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
    setLatestTime(data.messages.latestUnixTimeMilli as number)
    setExistUnread(false)
  }

  const fetchLatestTime = async () => {
    if (existsUnread) return
    const { data } = await fetchMessagesLatest({
      variables: {
        gameId: game.id,
        query: {
          ...messageQuery,
          offsetUnixTimeMilli: latestTime
        }
      } as MessagesQuery
    })
    if (data?.messagesLatestUnixTimeMilli == null) return
    const latest = data.messagesLatestUnixTimeMilli as number
    if (latestTime < latest) {
      if (isViewing) search(messageQuery)
      else setExistUnread(true)
    }
  }

  // 初回の取得
  useEffect(() => {
    search(defaultMessageQuery)
  }, [])

  // 30秒ごとに最新をチェックして更新されていれば取得
  const usePollingMessages = (callback: () => void) => {
    const ref = useRef<() => void>(callback)
    useEffect(() => {
      ref.current = callback
    }, [callback])

    useEffect(() => {
      const fetch = () => {
        ref.current()
      }
      const timer = setInterval(fetch, 30000)
      return () => clearInterval(timer)
    }, [])
  }
  usePollingMessages(() => fetchLatestTime())

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
