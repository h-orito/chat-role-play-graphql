import {
  DeleteMessageFavorite,
  FavoriteDocument,
  FavoriteMutation,
  FavoriteMutationVariables,
  Game,
  GameParticipant,
  Message,
  NewMessageFavorite,
  UnfavoriteDocument,
  UnfavoriteMutation,
  UnfavoriteMutationVariables
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import { StarIcon } from '@heroicons/react/24/outline'
import { useCallback, useState } from 'react'

type Props = {
  game: Game
  message: Message
  myself: GameParticipant | null
  openFavoritesModal: (messageId: string) => void
}

export default function FavoriteButton({
  game,
  message,
  myself,
  openFavoritesModal
}: Props) {
  const canFav: boolean =
    myself != null && myself.id !== message.sender?.participantId
  const alreadyFav: boolean =
    myself != null &&
    message.reactions.favoriteParticipantIds.some((id) => id === myself.id)

  const [isFav, setIsFav] = useState<boolean>(alreadyFav)
  const [favCount, setFavCount] = useState<number>(
    message.reactions.favoriteCount
  )

  const [favorite] = useMutation<FavoriteMutation>(FavoriteDocument, {
    onCompleted(_) {
      setIsFav(true)
      setFavCount(favCount + 1)
    },
    onError(error) {
      console.error(error)
    }
  })
  const [unfavorite] = useMutation<UnfavoriteMutation>(UnfavoriteDocument, {
    onCompleted(_) {
      setIsFav(false)
      setFavCount(favCount - 1)
    },
    onError(error) {
      console.error(error)
    }
  })

  const handleFav = useCallback(() => {
    if (!canFav) return
    if (isFav) {
      unfavorite({
        variables: {
          input: {
            gameId: game.id,
            messageId: message.id
          } as DeleteMessageFavorite
        } as UnfavoriteMutationVariables
      })
    } else {
      favorite({
        variables: {
          input: {
            gameId: game.id,
            messageId: message.id
          } as NewMessageFavorite
        } as FavoriteMutationVariables
      })
    }
  }, [isFav, favorite, unfavorite])

  const starClass = isFav
    ? 'text-yellow-500'
    : myself != null && myself.id !== message.sender?.participantId
    ? 'hover:text-yellow-500'
    : 'text-gray-300'

  return (
    <>
      <button onClick={() => handleFav()} disabled={!canFav}>
        <StarIcon className={`y-6 h-6 text-gray-500 ${starClass}`} />
      </button>
      {favCount > 0 && (
        <button
          className='pr-2 hover:font-bold'
          onClick={() => openFavoritesModal(message.id)}
        >
          <p className='ml-1 self-center text-gray-500'>{favCount}</p>
        </button>
      )}
    </>
  )
}
