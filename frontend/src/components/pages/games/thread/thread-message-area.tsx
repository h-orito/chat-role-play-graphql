import { GoogleAdsense } from '@/components/adsense/google-adsense'
import {
  Game,
  Message,
  MessagesQuery,
  ThreadMessagesDocument,
  ThreadMessagesQuery
} from '@/lib/generated/graphql'
import {
  forwardRef,
  useRef,
  useImperativeHandle,
  useState,
  useCallback,
  useMemo,
  useEffect
} from 'react'
import MessageComponent from '../article/message-area/message-area/messages-area/message/message'
import {
  talkableGameStatuses,
  useGameValue,
  useMyselfValue
} from '../game-hook'
import { useLazyQuery } from '@apollo/client'
import { useUserPagingSettings } from '../user-settings'
import TalkArea, {
  TalkAreaRefHandle
} from '../article/message-area/message-area/talk-area'
import MessageAreaFooterMenu from '../article/message-area/message-area/message-area-footer-menu'

type Props = {
  game: Game
  messageId: string
  threadMessages: Array<Message>
}

const ThreadMessageArea = (props: Props) => {
  const game = useGameValue()
  const myself = useMyselfValue()
  const [fetchMessages] = useLazyQuery<ThreadMessagesQuery>(
    ThreadMessagesDocument
  )
  const [userPagingSettings] = useUserPagingSettings()
  const search = useCallback(async () => {
    const { data } = await fetchMessages({
      variables: {
        gameId: game.id,
        messageId: props.messageId
      } as MessagesQuery
    })
    if (data?.threadMessages == null) return
    let messages = data.threadMessages as Array<Message>
    if (userPagingSettings.isDesc) {
      messages = messages.reverse()
    }
    messagesAreaRef.current?.setMessages(messages)
  }, [game.id, props.messageId])

  const canTalk = useMemo(() => {
    return !!myself && talkableGameStatuses.includes(game.status)
  }, [myself, game.status])

  const reply = (message: Message) => {
    talkAreaRef.current.reply(message)
  }

  const scrollToTop = () => {
    document.getElementById('message-area')!.scroll({
      top: 0,
      behavior: 'smooth'
    })
  }

  const scrollToBottom = () => {
    const messageAreaElement = document.getElementById('message-area')!
    messageAreaElement.scroll({
      top: messageAreaElement.scrollHeight,
      behavior: 'smooth'
    })
  }

  const messagesAreaRef = useRef({} as ThreadMessagesAreaRefHandle)
  const talkAreaRef = useRef({} as TalkAreaRefHandle)

  return (
    <div className='mut-height-guard relative flex h-screen max-h-screen w-full flex-1 flex-col'>
      <div
        id='message-area'
        className='flex w-full flex-1 flex-col overflow-y-auto'
      >
        <ThreadMessagesArea
          ref={messagesAreaRef}
          messageId={props.messageId}
          threadMessages={props.threadMessages}
          canTalk={canTalk}
          search={search}
          reply={reply}
        />
        <TalkArea
          ref={talkAreaRef}
          canTalk={canTalk}
          search={search}
          talkAreaId='talk-area'
        />
      </div>
      <div id='talk-area-fixed'></div>
      <MessageAreaFooterMenu
        scrollToTop={scrollToTop}
        scrollToBottom={scrollToBottom}
        searchable={false}
      />
    </div>
  )
}

export default ThreadMessageArea

interface ThreadMessagesAreaRefHandle {
  setMessages: (messages: Array<Message>) => void
}
type ThreadMessagesAreaProps = {
  messageId: string
  threadMessages: Array<Message>
  canTalk: boolean
  search: () => void
  reply: (message: Message) => void
}
const ThreadMessagesArea = forwardRef<
  ThreadMessagesAreaRefHandle,
  ThreadMessagesAreaProps
>((props: ThreadMessagesAreaProps, ref: any) => {
  const [messages, _setMessages] = useState<Array<Message>>(
    props.threadMessages
  )

  const handleReply = (message: Message) => {
    if (!props.canTalk) return
    props.reply(message)
  }

  const [userPagingSettings] = useUserPagingSettings()
  useEffect(() => {
    if (userPagingSettings.isDesc) {
      _setMessages(messages.reverse())
    }
  }, [])

  useImperativeHandle(ref, () => ({
    setMessages(messages: Array<Message>) {
      _setMessages(messages)
    }
  }))

  return (
    <div className='relative flex-1'>
      <div id='talk-area-top'></div>
      <div id='talk-area-top-preview'></div>
      {messages.map((message: Message) => (
        <MessageComponent
          {...props}
          message={message}
          key={message.id}
          handleReply={handleReply}
          shouldDisplayReplyTo={true}
        />
      ))}
      <div id='talk-area-bottom-preview'></div>
      <div className='p-4'>
        <GoogleAdsense slot='1577139382' format='auto' responsive='true' />
      </div>
      <div id='talk-area-bottom'></div>
    </div>
  )
})
