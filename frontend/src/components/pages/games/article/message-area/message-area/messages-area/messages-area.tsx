import {
  Message,
  Messages,
  MessagesQuery,
  PageableQuery
} from '@/lib/generated/graphql'
import MessageComponent from './message/message'
import Paging from './paging'
import GamePeriodLinks from './game-period-links'
import { GoogleAdsense } from '@/components/adsense/google-adsense'
import { RefObject } from 'react'

type Props = {
  className?: string
  reply: (message: Message) => void
  openFavoritesModal: (messageId: string) => void
  isViewing: boolean
  existsUnread: boolean
  searchable?: boolean
  messageQuery: MessagesQuery
  messages: Messages
  canTalk: boolean
  search: (query?: MessagesQuery) => void
  messageAreaRef: RefObject<HTMLDivElement>
  talkAreaId: string
}

const MessagesArea = (props: Props, ref: any) => {
  const { messages, messageQuery, search, canTalk, messageAreaRef } = props
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
        messageAreaRef={messageAreaRef}
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
        <div className='p-4'>
          <GoogleAdsense slot='1577139382' format='auto' responsive='true' />
        </div>
        <div id={`${props.talkAreaId}-bottom`}></div>
      </div>
      <Paging
        messages={messages}
        query={messageQuery.paging as PageableQuery | undefined}
        setPageableQuery={setPageableQuery}
        messageAreaRef={messageAreaRef}
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
