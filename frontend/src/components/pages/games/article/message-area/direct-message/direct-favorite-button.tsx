import Modal from '@/components/modal/modal'
import {
  useGameValue,
  useMyselfValue
} from '@/components/pages/games/game-hook'
import {
  DeleteMessageFavorite,
  DirectMessage,
  FavoriteDocument,
  FavoriteMutation,
  FavoriteMutationVariables,
  NewMessageFavorite,
  UnfavoriteDocument,
  UnfavoriteMutation,
  UnfavoriteMutationVariables
} from '@/lib/generated/graphql'
import { useMutation } from '@apollo/client'
import { StarIcon } from '@heroicons/react/24/outline'
import { useCallback, useState } from 'react'
import DirectFavoriteParticipants from './direct-favorite-participants'

type Props = {
  message: DirectMessage
}

export default function DirectFavoriteButton({ message }: Props) {
  const game = useGameValue()
  const myself = useMyselfValue()
  const canFav: boolean =
    myself != null && myself.id !== message.sender?.participantId
  const alreadyFav: boolean =
    myself != null &&
    message.reactions.favoriteParticipantIds.some((id) => id === myself.id)

  const [isFav, setIsFav] = useState<boolean>(alreadyFav)
  const [favCount, setFavCount] = useState<number>(
    message.reactions.favoriteCounts
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
    : canFav
    ? 'hover:text-yellow-500 secondary-text'
    : 'secondary-text'

  const [isOpenFavoritesModal, setIsOpenFavoritesModal] = useState(false)
  const toggleFavoritesModal = () =>
    setIsOpenFavoritesModal(!isOpenFavoritesModal)

  return (
    <>
      <button onClick={() => handleFav()} disabled={!canFav}>
        <StarIcon className={`y-4 h-4 ${starClass}`} />
      </button>
      {favCount > 0 && (
        <button
          className='pr-2 hover:font-bold'
          onClick={() => setIsOpenFavoritesModal(true)}
        >
          <p className='secondary-text ml-1 self-center'>{favCount}</p>
        </button>
      )}
      {isOpenFavoritesModal && (
        <Modal header='ふぁぼした人' close={toggleFavoritesModal} hideFooter>
          <DirectFavoriteParticipants
            messageId={message.id}
            close={toggleFavoritesModal}
          />
        </Modal>
      )}
    </>
  )
}
