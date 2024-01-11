import {
  Game,
  GameParticipant,
  Message,
  MessageType
} from '@/lib/generated/graphql'
import TalkMessage from './talk-message'
import SystemMessage from './system-message'
import DescriptionMessage from './description-message'

type MessageProps = {
  game: Game
  myself: GameParticipant | null
  message: Message
  openProfileModal: (participantId: string) => void
  openFavoritesModal: (messageId: string) => void
  handleReply: (message: Message) => void
  shouldDisplayReplyTo: boolean
}

export default function MessageComponent(props: MessageProps) {
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
}
