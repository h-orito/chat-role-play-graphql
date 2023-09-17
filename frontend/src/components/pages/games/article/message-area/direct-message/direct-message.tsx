import {
  DeleteDirectMessageFavorite,
  DirectMessage,
  FavoriteDirectDocument,
  FavoriteDirectMutation,
  FavoriteDirectMutationVariables,
  Game,
  GameParticipant,
  NewDirectMessageFavorite,
  UnfavoriteDirectDocument,
  UnfavoriteDirectMutation,
  UnfavoriteDirectMutationVariables
} from '@/lib/generated/graphql'
import Image from 'next/image'
import { StarIcon } from '@heroicons/react/24/outline'
import { iso2display } from '@/components/util/datetime/datetime'
import { useMutation } from '@apollo/client'
import { useCallback, useState } from 'react'
import MessageText from '../message-text/message-text'

type MessageProps = {
  game: Game
  myself: GameParticipant | null
  directMessage: DirectMessage
  openProfileModal: (participantId: string) => void
  openFavoritesModal: (messageId: string) => void
  preview?: boolean
}

export default function DirectMessageComponent({
  game,
  directMessage,
  myself,
  openProfileModal,
  openFavoritesModal,
  preview = false
}: MessageProps) {
  const canFav: boolean =
    myself != null && myself.id !== directMessage.sender?.participantId
  const alreadyFav: boolean =
    myself != null &&
    directMessage.reactions.favoriteParticipantIds.some(
      (id) => id === myself.id
    )

  const [isFav, setIsFav] = useState<boolean>(alreadyFav)
  const [favCount, setFavCount] = useState<number>(
    directMessage.reactions.favoriteCounts
  )

  const starClass = isFav
    ? 'text-yellow-500'
    : myself != null && myself.id !== directMessage.sender?.participantId
    ? 'hover:text-yellow-500 secondary-text'
    : 'secondary-text'

  const [favorite] = useMutation<FavoriteDirectMutation>(
    FavoriteDirectDocument,
    {
      onCompleted(_) {
        setIsFav(true)
        setFavCount(favCount + 1)
      },
      onError(error) {
        console.error(error)
      }
    }
  )
  const [unfavorite] = useMutation<UnfavoriteDirectMutation>(
    UnfavoriteDirectDocument,
    {
      onCompleted(_) {
        setIsFav(false)
        setFavCount(favCount - 1)
      },
      onError(error) {
        console.error(error)
      }
    }
  )

  const handleFav = useCallback(() => {
    if (!canFav) return
    if (isFav) {
      unfavorite({
        variables: {
          input: {
            gameId: game.id,
            directMessageId: directMessage.id
          } as DeleteDirectMessageFavorite
        } as UnfavoriteDirectMutationVariables
      })
    } else {
      favorite({
        variables: {
          input: {
            gameId: game.id,
            directMessageId: directMessage.id
          } as NewDirectMessageFavorite
        } as FavoriteDirectMutationVariables
      })
    }
  }, [isFav, favorite, unfavorite])

  const handleProfileClick = (e: any) => {
    e.preventDefault()
    if (preview) return
    openProfileModal(directMessage.sender!.participantId)
  }

  const messageClass =
    directMessage.content.type === 'TalkNormal'
      ? 'talk-normal'
      : directMessage.content.type === 'Monologue'
      ? 'talk-monologue'
      : directMessage.content.type === 'Description'
      ? 'description'
      : ''

  return (
    <div>
      <div className='w-full px-4 py-2'>
        {directMessage.sender && (
          <div className='flex pb-1'>
            <button onClick={handleProfileClick}>
              <p className='primary-hover-text text-xs'>
                ENo.{directMessage.sender.entryNumber}&nbsp;
                {directMessage.sender.name}
              </p>
            </button>
            <p className='secondary-text ml-auto self-end text-xs'>
              {iso2display(directMessage.time.sendAt)}
            </p>
          </div>
        )}
        <div className='flex'>
          <div>
            <Image
              className='cursor-pointer'
              src={directMessage.sender!.icon!.url}
              width={directMessage.sender!.icon!.width}
              height={directMessage.sender!.icon!.height}
              alt='キャラアイコン'
              onClick={handleProfileClick}
            />
          </div>
          {!preview && (
            <div className='ml-2 flex-1 text-sm'>
              <div
                className={`message ${messageClass}`}
                style={{ minHeight: `${directMessage.sender!.icon!.height}px` }}
              >
                <MessageText
                  rawText={directMessage.content.text}
                  isConvertDisabled={directMessage.content.isConvertDisabled}
                />
              </div>
              <div className='flex justify-end pt-1'>
                <div className='flex'>
                  <button onClick={() => handleFav()} disabled={!canFav}>
                    <StarIcon className={`y-4 h-4 ${starClass}`} />
                  </button>
                  {favCount > 0 && (
                    <button
                      className='pr-2 hover:font-bold'
                      onClick={() => openFavoritesModal(directMessage.id)}
                    >
                      <p className='secondary-text ml-1 self-center'>
                        {favCount}
                      </p>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
