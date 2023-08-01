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
    ? 'hover:text-yellow-500'
    : ''

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

  return (
    <div>
      <div className='w-full border-t border-gray-300 p-4'>
        {directMessage.sender && (
          <div className='flex pb-1'>
            <button onClick={handleProfileClick}>
              <p className='text-xs hover:text-blue-500'>
                {directMessage.sender.name}
              </p>
            </button>
            <p className='ml-auto self-end text-xs text-gray-500'>
              {iso2display(directMessage.time.sendAt)}
            </p>
          </div>
        )}
        <div className='flex'>
          {directMessage.sender && (
            <div>
              <Image
                className='cursor-pointer'
                src={directMessage.sender.icon.url}
                width={directMessage.sender.icon.width}
                height={directMessage.sender.icon.height}
                alt='キャラアイコン'
                onClick={handleProfileClick}
              />
            </div>
          )}
          {!preview && (
            <div className='ml-2 flex-1 text-sm'>
              <div className='min-h-[60px] w-full whitespace-pre-wrap break-words rounded border border-gray-300 p-2 text-gray-700'>
                {directMessage.content.text}
              </div>
              <div className='flex pt-1'>
                <div className='flex flex-1'>
                  <button onClick={() => handleFav()} disabled={!canFav}>
                    <StarIcon
                      className={`y-6 h-6 text-gray-500 ${starClass}`}
                    />
                  </button>
                  {favCount > 0 && (
                    <button
                      className='pr-2 hover:font-bold'
                      onClick={() => openFavoritesModal(directMessage.id)}
                    >
                      <p className='ml-1 self-center text-gray-500'>
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
