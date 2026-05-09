import {
  GameMessagesDocument,
  GameMessagesQuery,
  GameMessagesQueryVariables,
  Messages,
  MessagesQuery
} from '@/lib/generated/graphql'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState
} from 'react'
import { useLazyQuery } from '@apollo/client'
import MessagesArea from './messages-area/messages-area'
import {
  talkableGameStatuses,
  useGameValue,
  useMyselfValue
} from '@/components/pages/games/game-hook'
import { emptyMessageQuery, useInitialMessagesQuery } from './messages-query'
import { useUserPagingSettings } from '../../../user-settings'
import TalkArea from './talk-area'
import MessageAreaFooterMenu from './message-area-footer-menu'

type Props = {
  className?: string
  isViewing: boolean
  existsUnread: boolean
  setExistUnread: (exist: boolean) => void
  onlyToMe?: boolean
}

export interface MessageAreaRefHandle {
  fetchLatest: () => void
  search: (query?: MessagesQuery) => void
}

const MessageArea = forwardRef<MessageAreaRefHandle, Props>(
  (props: Props, ref: React.ForwardedRef<MessageAreaRefHandle>) => {
    const {
      className,
      isViewing,
      existsUnread,
      setExistUnread,
      onlyToMe = false
    } = props
    const game = useGameValue()
    const myself = useMyselfValue()

    const [messageQuery, setMessageQuery] = useState(emptyMessageQuery)

    // messages state をここで管理（MessagesArea に props で渡す）
    const [messages, setMessages] = useState<Messages>({
      list: [],
      allPageCount: 0,
      hasPrePage: false,
      hasNextPage: false,
      isDesc: true,
      isLatest: false,
      latestUnixTimeMilli: 0
    })
    const [latestTime, setLatestTime] = useState<number>(0)

    const [fetchMessages] = useLazyQuery<
      GameMessagesQuery,
      GameMessagesQueryVariables
    >(GameMessagesDocument)
    const search = useCallback(
      async (query: MessagesQuery = messageQuery) => {
        setMessageQuery(query)
        const { data } = await fetchMessages({
          variables: {
            gameId: game.id,
            query: query
          }
        })
        if (data?.messages == null) return
        setMessages(data.messages as Messages)
        setLatestTime(Number(data.messages.latestUnixTimeMilli))
        setExistUnread(false)
      },
      [game.id, messageQuery, fetchMessages, setExistUnread]
    )

    // 初回の取得
    const initialMessagesQuery = useInitialMessagesQuery()
    const [pagingSettings] = useUserPagingSettings()
    useEffect(() => {
      const paging = {
        pageSize: pagingSettings.pageSize,
        pageNumber: 1,
        isDesc: pagingSettings.isDesc,
        isLatest: !pagingSettings.isDesc
      }
      const q = onlyToMe
        ? {
            ...emptyMessageQuery,
            recipientIds: [myself!.id],
            paging
          }
        : {
            ...initialMessagesQuery,
            paging
          }
      search(q)
      // mount 時のみ初回取得（initialMessagesQuery / pagingSettings / search 等は意図的に依存に含めない）
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const canTalk = useMemo(() => {
      return !!myself && talkableGameStatuses.includes(game.status)
    }, [myself, game.status])

    useImperativeHandle(ref, () => ({
      async fetchLatest() {
        return await search()
      },
      search(query: MessagesQuery = messageQuery) {
        return search(query)
      }
    }))

    const messageAreaId = useMemo(
      () => `message-area-${onlyToMe ? 'tome' : 'home'}`,
      [onlyToMe]
    )
    const talkAreaId = useMemo(
      () => `talk-area-${onlyToMe ? 'tome' : 'home'}`,
      [onlyToMe]
    )

    const scrollToTop = () => {
      document.getElementById(messageAreaId)!.scroll({
        top: 0,
        behavior: 'smooth'
      })
    }

    const scrollToBottom = () => {
      const messageAreaElement = document.getElementById(messageAreaId)!
      messageAreaElement.scroll({
        top: messageAreaElement.scrollHeight,
        behavior: 'smooth'
      })
    }

    return (
      <div
        className={`${className} mut-height-guard relative flex flex-1 flex-col overflow-y-auto`}
      >
        <div
          id={messageAreaId}
          className={`flex flex-1 flex-col overflow-y-auto`}
        >
          <MessagesArea
            messages={messages}
            latestTime={latestTime}
            messageQuery={messageQuery}
            canTalk={canTalk}
            search={search}
            searchable={!onlyToMe}
            talkAreaId={talkAreaId}
            scrollToTop={scrollToTop}
            isViewing={isViewing}
            existsUnread={existsUnread}
            setExistsUnread={setExistUnread}
          />
          <TalkArea canTalk={canTalk} search={search} talkAreaId={talkAreaId} />
        </div>
        <div id={`${talkAreaId}-fixed`}></div>
        <MessageAreaFooterMenu
          scrollToTop={scrollToTop}
          scrollToBottom={scrollToBottom}
          searchable={!onlyToMe}
          messageQuery={messageQuery}
          search={search}
        />
      </div>
    )
  }
)

export default MessageArea
