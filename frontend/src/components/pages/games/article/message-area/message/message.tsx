import { Game, GameParticipant, Message } from '@/lib/generated/graphql'
import TalkMessage from './talk-message'
import SystemMessage from './system-message'

type MessageProps = {
  game: Game
  myself: GameParticipant | null
  message: Message
  openProfileModal: (participantId: string) => void
  openFavoritesModal: (messageId: string) => void
}

export default function MessageComponent(props: MessageProps) {
  const isSystem = props.message.content.type.indexOf('System') !== -1
  return (
    <>
      {isSystem ? (
        <SystemMessage message={props.message} />
      ) : (
        <TalkMessage {...props} />
      )}
    </>
  )
}
