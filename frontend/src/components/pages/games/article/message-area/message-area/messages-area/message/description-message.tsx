import { Game, GameParticipant, Message } from '@/lib/generated/graphql'
import MessageText from '../../../message-text/message-text'
import { iso2display } from '@/components/util/datetime/datetime'
import FavoriteButton from '@/components/pages/games/article/message-area/message-area/messages-area/message/favorite-button'

type Props = {
  game: Game
  message: Message
  myself: GameParticipant | null
  openProfileModal: (participantId: string) => void
  openFavoritesModal: (messageId: string) => void
  preview?: boolean
}

export default function DescriptionMessage({
  game,
  message,
  myself,
  openProfileModal,
  openFavoritesModal,
  preview = false
}: Props) {
  const handleProfileClick = (e: any) => {
    e.preventDefault()
    if (preview) return
    openProfileModal(message.sender!.participantId)
  }

  return (
    <div>
      <div className='w-full px-4 py-2'>
        {message.sender && (
          <div className='flex pb-1'>
            <button onClick={handleProfileClick}>
              <p className='primary-hover-text text-xs'>
                ENo.{message.sender.entryNumber}&nbsp;{message.sender.name}
              </p>
            </button>
            <p className='secondary-text ml-auto self-end text-xs'>
              {iso2display(message.time.sendAt)}
            </p>
          </div>
        )}
        <div className='flex'>
          <div className='flex-1 text-sm'>
            <div className={`message description min-h-[60px]`}>
              <MessageText
                rawText={message.content.text}
                isConvertDisabled={message.content.isConvertDisabled}
              />
            </div>
          </div>
        </div>
        <div className='flex justify-end pt-1'>
          <FavoriteButton
            game={game}
            message={message}
            myself={myself}
            openFavoritesModal={openFavoritesModal}
          />
        </div>
      </div>
    </div>
  )
}
