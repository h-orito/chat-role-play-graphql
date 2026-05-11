import { GoogleAdsense } from '@/components/adsense/google-adsense'
import {
  Game,
  Message,
  ThreadMessagesDocument,
  ThreadMessagesQuery,
  ThreadMessagesQueryVariables
} from '@/lib/generated/graphql'
import { useState, useCallback, useMemo, useEffect } from 'react'
import MessageComponent from '../article/message-area/message-area/messages-area/message/message'
import {
  talkableGameStatuses,
  useGameValue,
  useMyselfValue
} from '../game-hook'
import { useLazyQuery } from '@apollo/client'
import { useUserPagingSettings } from '../user-settings'
import TalkArea from '../article/message-area/message-area/talk-area'
import MessageAreaFooterMenu from '../article/message-area/message-area/message-area-footer-menu'
import { useTalkPanel } from '../talk/use-talk-panel'

type Props = {
  game: Game
  messageId: string
  threadMessages: Array<Message>
}

const ThreadMessageArea = (props: Props) => {
  const game = useGameValue()
  const myself = useMyselfValue()
  const { reply } = useTalkPanel()
  const [fetchMessages] = useLazyQuery<
    ThreadMessagesQuery,
    ThreadMessagesQueryVariables
  >(ThreadMessagesDocument, { fetchPolicy: 'no-cache' })
  const [userPagingSettings] = useUserPagingSettings()

  // messages state をここで管理
  const [messages, setMessages] = useState<Array<Message>>(() => {
    return userPagingSettings.isDesc
      ? [...props.threadMessages].reverse()
      : props.threadMessages
  })

  const search = useCallback(async () => {
    const { data } = await fetchMessages({
      variables: {
        gameId: game.id,
        messageId: props.messageId
      }
    })
    if (data?.threadMessages == null) return
    let msgs = data.threadMessages as Array<Message>
    if (userPagingSettings.isDesc) {
      msgs = msgs.reverse()
    }
    setMessages(msgs)
  }, [game.id, props.messageId, fetchMessages, userPagingSettings.isDesc])

  const canTalk = useMemo(() => {
    return !!myself && talkableGameStatuses.includes(game.status)
  }, [myself, game.status])

  const handleReply = (message: Message) => {
    if (!canTalk) return
    reply(message)
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

  return (
    <div className='mut-height-guard relative flex h-screen max-h-screen w-full flex-1 flex-col'>
      <div
        id='message-area'
        className='flex w-full flex-1 flex-col overflow-y-auto'
      >
        <ThreadMessagesArea
          messages={messages}
          messageId={props.messageId}
          canTalk={canTalk}
          handleReply={handleReply}
        />
        <TalkArea canTalk={canTalk} search={search} talkAreaId='talk-area' />
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

type ThreadMessagesAreaProps = {
  messages: Array<Message>
  messageId: string
  canTalk: boolean
  handleReply: (message: Message) => void
}

const ThreadMessagesArea = ({
  messages,
  handleReply
}: ThreadMessagesAreaProps) => {
  return (
    <div className='relative flex-1'>
      <div id='talk-area-top'></div>
      <div id='talk-area-top-preview'></div>
      {messages.map((message: Message) => (
        <MessageComponent
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
}
