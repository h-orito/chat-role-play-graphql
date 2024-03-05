import {
  Message,
  Messages,
  MessagesLatestDocument,
  MessagesLatestQuery,
  MessagesQuery,
  PageableQuery
} from '@/lib/generated/graphql'
import MessageComponent from './message/message'
import Paging from './paging'
import GamePeriodLinks from './game-period-links'
import { GoogleAdsense } from '@/components/adsense/google-adsense'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { useLazyQuery } from '@apollo/client'
import { useGameValue } from '@/components/pages/games/game-hook'

type Props = {
  className?: string
  reply: (message: Message) => void
  searchable?: boolean
  messageQuery: MessagesQuery
  canTalk: boolean
  search: (query?: MessagesQuery) => void
  scrollToTop: () => void
  talkAreaId: string
  isViewing: boolean
  existsUnread: boolean
  setExistsUnread: (existsUnread: boolean) => void
}

export interface MessagesAreaRefHandle {
  setMessages: (messages: Messages) => void
  setLatestTime: (latestTime: number) => void
}

const MessagesArea = forwardRef<MessagesAreaRefHandle, Props>(
  (props: Props, ref: any) => {
    const game = useGameValue()
    const {
      messageQuery,
      search,
      canTalk,
      scrollToTop,
      isViewing,
      existsUnread,
      setExistsUnread
    } = props
    const [messages, _setMessages] = useState<Messages>({
      list: [],
      allPageCount: 0,
      hasPrePage: false,
      hasNextPage: false,
      isDesc: true,
      isLatest: false,
      latestUnixTimeMilli: 0
    })
    const [latestTime, _setLatestTime] = useState<number>(0)

    useImperativeHandle(ref, () => ({
      setMessages(messages: Messages) {
        _setMessages(messages)
      },
      setLatestTime(latestTime: number) {
        _setLatestTime(latestTime)
      }
    }))

    const [fetchMessagesLatest] = useLazyQuery<MessagesLatestQuery>(
      MessagesLatestDocument
    )

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
        else setExistsUnread(true)
      }
    }

    // 1分ごとに最新をチェックして更新されていれば取得
    const usePollingMessages = (callback: () => void) => {
      const ref = useRef<() => void>(callback)
      useEffect(() => {
        ref.current = callback
      }, [callback])

      useEffect(() => {
        const fetch = () => {
          ref.current()
        }
        const timer = setInterval(fetch, 60000)
        return () => clearInterval(timer)
      }, [])
    }
    usePollingMessages(() => fetchLatestTime())

    const setPageableQuery = (q: PageableQuery) => {
      const newQuery = {
        ...messageQuery,
        paging: q
      } as MessagesQuery
      search(newQuery)
    }

    const handleReply = (message: Message) => {
      if (!canTalk) return
      props.reply(message)
    }

    return (
      <div className='flex-1'>
        <GamePeriodLinksArea
          {...props}
          messageQuery={messageQuery}
          search={search}
        />
        <Paging
          messages={messages}
          query={messageQuery.paging as PageableQuery | undefined}
          setPageableQuery={setPageableQuery}
          scrollToTop={scrollToTop}
        />
        <div className='relative flex-1'>
          <div id={`${props.talkAreaId}-top`}></div>
          <div id={`${props.talkAreaId}-top-preview`}></div>
          {messages.list.map((message: Message) => (
            <MessageComponent
              {...props}
              message={message}
              key={message.id}
              handleReply={handleReply}
              shouldDisplayReplyTo={true}
            />
          ))}
          <div id={`${props.talkAreaId}-bottom-preview`}></div>
          {isViewing && (
            <div className='p-4'>
              <GoogleAdsense
                slot='1577139382'
                format='auto'
                responsive='true'
              />
            </div>
          )}
          <div id={`${props.talkAreaId}-bottom`}></div>
        </div>
        <Paging
          messages={messages}
          query={messageQuery.paging as PageableQuery | undefined}
          setPageableQuery={setPageableQuery}
          scrollToTop={scrollToTop}
        />
      </div>
    )
  }
)

export default MessagesArea

const GamePeriodLinksArea = (
  props: Props & {
    messageQuery: MessagesQuery
    search: (query?: MessagesQuery) => void
  }
) => {
  const { messageQuery, search, searchable } = props

  const setPeriodQuery = (periodId: string) => {
    const newQuery = {
      ...messageQuery,
      periodId,
      paging: {
        // 期間移動したら1ページ目に戻す
        ...messageQuery.paging,
        pageNumber: 1,
        isLatest: false
      } as PageableQuery
    } as MessagesQuery
    search(newQuery)
  }

  if (!searchable) return <></>
  return (
    <GamePeriodLinks
      periodId={messageQuery.periodId}
      setQuery={setPeriodQuery}
    />
  )
}
