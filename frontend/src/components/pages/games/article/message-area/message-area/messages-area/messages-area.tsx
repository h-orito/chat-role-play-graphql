import {
  Game,
  GameParticipant,
  Message,
  Messages,
  MessagesQuery,
  PageableQuery
} from '@/lib/generated/graphql'
import MessageComponent from './message/message'
import Paging from './paging'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import GamePeriodLinks from '../../game-period-links'
import { GoogleAdsense } from '@/components/adsense/google-adsense'
import { useUserDisplaySettings } from '@/components/pages/games/user-settings'

type Props = {
  game: Game
  className?: string
  myself: GameParticipant | null
  reply: (message: Message) => void
  openProfileModal: (participantId: string) => void
  openFavoritesModal: (messageId: string) => void
  isViewing: boolean
  existsUnread: boolean
  onlyFollowing?: boolean
  searchable?: boolean
  messageQuery: MessagesQuery
  messages: Messages
  canTalk: boolean
  search: (query?: MessagesQuery) => void
}

export interface MessagesAreaRefHandle {
  scrollToTop: () => void
  scrollToBottom: () => void
}

const MessagesArea = forwardRef<MessagesAreaRefHandle, Props>(
  (props: Props, ref: any) => {
    const {
      messages,
      messageQuery,
      searchable,
      search,
      onlyFollowing,
      canTalk
    } = props
    const messageAreaRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      scrollToTop() {
        messageAreaRef?.current?.scroll({ top: 0, behavior: 'smooth' })
      },
      scrollToBottom() {
        messageAreaRef?.current?.scroll({
          top: messageAreaRef?.current?.scrollHeight,
          behavior: 'smooth'
        })
      }
    }))

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

    const [userDisplaySettings] = useUserDisplaySettings()

    return (
      <div className='flex-1 overflow-y-auto' ref={messageAreaRef}>
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
        <div className='relative flex-1 pb-12'>
          {messages.list.map((message: Message) => (
            <MessageComponent
              {...props}
              message={message}
              key={message.id}
              handleReply={handleReply}
              shouldDisplayReplyTo={true}
              imageSizeRatio={userDisplaySettings.iconSizeRatio ?? 1}
            />
          ))}
          {!onlyFollowing && !searchable && (
            <div className='p-4'>
              <GoogleAdsense
                slot='1577139382'
                format='auto'
                responsive='true'
              />
            </div>
          )}
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
)

export default MessagesArea

const GamePeriodLinksArea = (
  props: Props & {
    messageQuery: MessagesQuery
    search: (query?: MessagesQuery) => void
  }
) => {
  const { game, messageQuery, search, searchable } = props

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

  if (searchable) return <></>
  return (
    <GamePeriodLinks
      game={game}
      periodId={messageQuery.periodId}
      setQuery={setPeriodQuery}
    />
  )
}
