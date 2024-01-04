import {
  Game,
  GameMessagesQuery,
  GameParticipant,
  Messages,
  MessagesLatestQuery,
  MessagesQuery
} from '@/lib/generated/graphql'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import SearchCondition from './search-condition'
import { LazyQueryExecFunction, OperationVariables } from '@apollo/client'
import { useUserPagingSettings } from '../../../user-settings'
import MessagesArea, { MessagesAreaRefHandle } from './messages-area'
import { TalkButtonRefHandle } from './footer-menu/talk-button'
import FooterMenu from './footer-menu/footer-menu'

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
  searchable?: boolean
}

export interface MessageAreaRefHandle {
  fetchLatest: () => void
}

const MessageArea = forwardRef<MessageAreaRefHandle, Props>(
  (props: Props, ref: any) => {
    const {
      game,
      className,
      myself,
      fetchMessages,
      fetchMessagesLatest,
      isViewing,
      existsUnread,
      setExistUnread,
      onlyFollowing = false,
      searchable = false
    } = props

    const [pagingSettings] = useUserPagingSettings()
    const defaultMessageQuery: MessagesQuery = {
      senderIds: onlyFollowing
        ? [...myself!.followParticipantIds, myself!.id]
        : null,
      periodId: searchable ? null : game.periods[game.periods.length - 1].id,
      paging: {
        pageSize: pagingSettings.pageSize,
        pageNumber: 1,
        isDesc: pagingSettings.isDesc,
        isLatest: !pagingSettings.isDesc
      }
    }
    const defaultMessages: Messages = {
      list: [],
      allPageCount: 0,
      hasPrePage: false,
      hasNextPage: false,
      isDesc: pagingSettings.isDesc,
      isLatest: !pagingSettings.isDesc,
      latestUnixTimeMilli: 0
    }

    const [messages, setMessages] = useState<Messages>(defaultMessages)
    const [latestTime, setLatestTime] = useState<number>(0)
    const [messageQuery, setMessageQuery] = useState(defaultMessageQuery)

    useImperativeHandle(ref, () => ({
      async fetchLatest() {
        return await search()
      }
    }))

    const search = async (query: MessagesQuery = messageQuery) => {
      setMessageQuery(query)
      const { data } = await fetchMessages({
        variables: {
          gameId: game.id,
          query: query
        } as MessagesQuery
      })
      if (data?.messages == null) return
      setMessages(data.messages as Messages)
      setLatestTime(data.messages.latestUnixTimeMilli as number)
      setExistUnread(false)
    }

    const fetchLatestTime = async () => {
      if (!isViewing && existsUnread) return
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
        if (isViewing) search()
        else setExistUnread(true)
      }
    }

    // 初回の取得
    useEffect(() => {
      if (!searchable) search()
    }, [])

    // 30秒（検索タブは60秒）ごとに最新をチェックして更新されていれば取得
    const usePollingMessages = (callback: () => void) => {
      const ref = useRef<() => void>(callback)
      useEffect(() => {
        ref.current = callback
      }, [callback])

      useEffect(() => {
        const fetch = () => {
          ref.current()
        }
        const timer = setInterval(fetch, searchable ? 60000 : 30000)
        return () => clearInterval(timer)
      }, [])
    }
    usePollingMessages(() => fetchLatestTime())

    const canTalk =
      !!myself &&
      ['Closed', 'Opening', 'Recruiting', 'Progress', 'Epilogue'].includes(
        game.status
      )

    const talkButtonRef = useRef({} as TalkButtonRefHandle)
    const messagesAreaRef = useRef({} as MessagesAreaRefHandle)

    return (
      <div
        className={`${className} mut-height-guard relative flex flex-1 flex-col overflow-y-auto`}
      >
        <SearchArea messageQuery={messageQuery} search={search} {...props} />
        <MessagesArea
          ref={messagesAreaRef}
          messages={messages}
          messageQuery={messageQuery}
          canTalk={canTalk}
          search={search}
          talkButtonRef={talkButtonRef}
          {...props}
        />
        <FooterMenu
          {...props}
          search={search}
          canTalk={canTalk}
          talkButtonRef={talkButtonRef}
          messagesAreaRef={messagesAreaRef}
        />
      </div>
    )
  }
)

export default MessageArea

const SearchArea = (
  props: Props & {
    messageQuery: MessagesQuery
    search: (query?: MessagesQuery) => void
  }
) => {
  const { messageQuery, search, searchable } = props
  if (!searchable) return <></>
  return (
    <div className='flex'>
      <SearchCondition {...props} messageQuery={messageQuery} search={search} />
    </div>
  )
}
