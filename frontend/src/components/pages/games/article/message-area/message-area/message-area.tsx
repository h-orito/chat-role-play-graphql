import {
  GameMessagesDocument,
  GameMessagesQuery,
  Message,
  Messages,
  MessagesQuery
} from '@/lib/generated/graphql'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import { useLazyQuery } from '@apollo/client'
import MessagesArea, {
  MessagesAreaRefHandle
} from './messages-area/messages-area'
import {
  talkableGameStatuses,
  useGameValue,
  useMyselfValue
} from '@/components/pages/games/game-hook'
import { emptyMessageQuery, useMessagesQuery } from './messages-query'
import { useUserPagingSettings } from '../../../user-settings'
import TalkArea, { TalkAreaRefHandle } from './talk-area'
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
  (props: Props, ref: any) => {
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

    const [fetchMessages] =
      useLazyQuery<GameMessagesQuery>(GameMessagesDocument)
    const search = useCallback(
      async (query: MessagesQuery = messageQuery) => {
        setMessageQuery(query)
        const { data } = await fetchMessages({
          variables: {
            gameId: game.id,
            query: query
          } as MessagesQuery
        })
        if (data?.messages == null) return
        messagesAreaRef.current?.setMessages(data.messages as Messages)
        messagesAreaRef.current?.setLatestTime(
          data.messages.latestUnixTimeMilli as number
        )
        setExistUnread(false)
      },
      [game.id, messageQuery]
    )

    // 初回の取得
    const [initialMessagesQuery] = useMessagesQuery()
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
    }, [])

    const canTalk = useMemo(() => {
      return !!myself && talkableGameStatuses.includes(game.status)
    }, [myself, game.status])

    const messagesAreaRef = useRef({} as MessagesAreaRefHandle)
    const talkAreaRef = useRef({} as TalkAreaRefHandle)

    useImperativeHandle(ref, () => ({
      async fetchLatest() {
        return await search()
      },
      search(query: MessagesQuery = messageQuery) {
        return search(query)
      }
    }))

    const reply = (message: Message) => {
      talkAreaRef.current.reply(message)
    }

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
            ref={messagesAreaRef}
            messageQuery={messageQuery}
            canTalk={canTalk}
            search={search}
            reply={reply}
            searchable={!onlyToMe}
            talkAreaId={talkAreaId}
            scrollToTop={scrollToTop}
            isViewing={isViewing}
            existsUnread={existsUnread}
            setExistsUnread={setExistUnread}
          />
          <TalkArea
            ref={talkAreaRef}
            canTalk={canTalk}
            search={search}
            talkAreaId={talkAreaId}
          />
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
