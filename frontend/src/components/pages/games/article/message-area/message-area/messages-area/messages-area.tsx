import {
  Message,
  Messages,
  MessagesLatestDocument,
  MessagesLatestQuery,
  MessagesLatestQueryVariables,
  MessagesQuery,
  PageableQuery
} from '@/lib/generated/graphql'
import MessageComponent from './message/message'
import Paging from './paging'
import GamePeriodLinks from './game-period-links'
import { GoogleAdsense } from '@/components/adsense/google-adsense'
import { useLazyQuery } from '@apollo/client'
import { usePollingMessages } from '@/components/hooks/use-polling-messages'
import { useGameValue } from '@/components/pages/games/game-hook'
import { useTalkPanel } from '@/components/pages/games/talk/use-talk-panel'

type Props = {
  className?: string
  messages: Messages
  latestTime: number
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

const MessagesArea = (props: Props) => {
  const game = useGameValue()
  const { reply } = useTalkPanel()
  const {
    messages,
    latestTime,
    messageQuery,
    search,
    canTalk,
    scrollToTop,
    isViewing,
    existsUnread,
    setExistsUnread
  } = props

  const [fetchMessagesLatest] = useLazyQuery<
    MessagesLatestQuery,
    MessagesLatestQueryVariables
  >(MessagesLatestDocument, { fetchPolicy: 'no-cache' })

  const fetchLatestTime = async () => {
    if (!isViewing && existsUnread) return
    const { data } = await fetchMessagesLatest({
      variables: {
        gameId: game.id,
        query: {
          ...messageQuery,
          offsetUnixTimeMilli: latestTime
        }
      }
    })
    if (data?.messagesLatestUnixTimeMilli == null) return
    const latest = Number(data.messagesLatestUnixTimeMilli)
    if (latestTime < latest) {
      if (isViewing) search()
      else setExistsUnread(true)
    }
  }

  usePollingMessages(() => fetchLatestTime())

  const setPageableQuery = (q: PageableQuery) => {
    const newQuery: MessagesQuery = {
      ...messageQuery,
      paging: q
    }
    search(newQuery)
  }

  const handleReply = (message: Message) => {
    if (!canTalk) return
    reply(message)
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
            message={message}
            key={message.id}
            handleReply={handleReply}
            shouldDisplayReplyTo={true}
          />
        ))}
        <div id={`${props.talkAreaId}-bottom-preview`}></div>
        {isViewing && (
          <div className='p-4'>
            <GoogleAdsense slot='1577139382' format='auto' responsive='true' />
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

export default MessagesArea

const GamePeriodLinksArea = (
  props: Props & {
    messageQuery: MessagesQuery
    search: (query?: MessagesQuery) => void
  }
) => {
  const { messageQuery, search, searchable } = props

  const setPeriodQuery = (periodId: string) => {
    // paging は MessageArea 初期化時に必ず設定済み
    const paging = messageQuery.paging!
    const newQuery: MessagesQuery = {
      ...messageQuery,
      periodId,
      paging: {
        ...paging,
        // 期間移動したら1ページ目に戻す
        pageNumber: 1,
        isLatest: false
      }
    }
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
