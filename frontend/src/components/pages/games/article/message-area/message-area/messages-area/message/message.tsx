import { Message, MessageType } from '@/lib/generated/graphql'
import { memo } from 'react'
import TalkMessage from './talk-message'
import SystemMessage from './system-message'
import DescriptionMessage from './description-message'

type MessageProps = {
  message: Message
  handleReply: (message: Message) => void
  shouldDisplayReplyTo: boolean
}

const MessageComponent = memo(function MessageComponent(props: MessageProps) {
  const type = props.message.content.type
  const isSystem = type.indexOf('System') !== -1
  const isDescription = type === MessageType.Description
  return (
    <div>
      {isSystem ? (
        <SystemMessage message={props.message} />
      ) : isDescription ? (
        <DescriptionMessage {...props} />
      ) : (
        <TalkMessage {...props} />
      )}
    </div>
  )
})

export default MessageComponent
