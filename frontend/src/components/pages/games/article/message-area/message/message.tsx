import {
  DeleteMessageFavorite,
  FavoriteDocument,
  FavoriteMutation,
  FavoriteMutationVariables,
  Game,
  GameParticipant,
  Message,
  MessageRepliesDocument,
  MessageRepliesQuery,
  NewMessageFavorite,
  UnfavoriteDocument,
  UnfavoriteMutation,
  UnfavoriteMutationVariables
} from '@/lib/generated/graphql'
import Image from 'next/image'
import {
  StarIcon,
  ChatBubbleOvalLeftEllipsisIcon
} from '@heroicons/react/24/outline'
import { iso2display } from '@/components/util/datetime/datetime'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useCallback, useState } from 'react'

type MessageProps = {
  game: Game
  myself: GameParticipant | null
  message: Message
  openProfileModal: (participantId: string) => void
  openFavoritesModal: (messageId: string) => void
}

export default function MessageComponent({
  game,
  message,
  myself,
  openProfileModal,
  openFavoritesModal
}: MessageProps) {
  const canFav: boolean =
    myself != null && myself.id !== message.sender?.participantId
  const alreadyFav: boolean =
    myself != null &&
    message.reactions.favoriteParticipantIds.some((id) => id === myself.id)

  const [isFav, setIsFav] = useState<boolean>(alreadyFav)
  const [favCount, setFavCount] = useState<number>(
    message.reactions.favoriteCount
  )

  const starClass = isFav
    ? 'text-yellow-500'
    : myself != null && myself.id !== message.sender?.participantId
    ? 'hover:text-yellow-500'
    : ''

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

  const [showReplies, setShowReplies] = useState<boolean>(false)
  const [replies, setReplies] = useState<Message[]>([])
  const [fetchReplies] = useLazyQuery<MessageRepliesQuery>(
    MessageRepliesDocument
  )
  const toggleReplies = async () => {
    if (!showReplies && replies.length === 0) {
      const { data } = await fetchReplies({
        variables: {
          gameId: game.id,
          messageId: message.id
        }
      })
      if (data?.messageReplies == null) return
      setReplies(data.messageReplies as Message[])
    }
    setShowReplies(!showReplies)
  }

  return (
    <div>
      <div className='w-full border-t border-gray-300 p-4'>
        {message.sender && (
          <div className='flex pb-1'>
            <button
              onClick={() => openProfileModal(message.sender!.participantId)}
            >
              <p className='text-xs hover:text-blue-500'>
                {message.sender.name}
              </p>
            </button>
            <p className='ml-auto self-end text-xs text-gray-500'>
              {iso2display(message.time.sendAt)}
            </p>
          </div>
        )}
        <div className='flex'>
          {message.sender && (
            <div>
              <Image
                className='cursor-pointer'
                src={message.sender.icon.url}
                width={message.sender.icon.width}
                height={message.sender.icon.height}
                alt='キャラアイコン'
                onClick={() => openProfileModal(message.sender!.participantId)}
              />
            </div>
          )}
          <div className='ml-2 flex-1 text-sm'>
            <div className='min-h-[60px] w-full whitespace-pre-wrap break-words rounded border border-gray-300 p-2 text-gray-700'>
              {message.content.text}
            </div>
            <div className='flex pt-1'>
              <div className='flex-1'>
                <button
                  className='flex hover:font-bold'
                  onClick={() => toggleReplies()}
                  disabled={message.reactions.replyCount === 0}
                >
                  <ChatBubbleOvalLeftEllipsisIcon className='y-6 h-6 text-gray-500' />
                  {message.reactions.replyCount > 0 && (
                    <p className='ml-1 self-center text-gray-500'>
                      {message.reactions.replyCount}
                    </p>
                  )}
                </button>
              </div>
              <div className='flex flex-1'>
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
              </div>
            </div>
          </div>
        </div>
      </div>
      {showReplies && (
        <Replies
          replies={replies}
          game={game}
          myself={myself}
          openProfileModal={openProfileModal}
          openFavoritesModal={openFavoritesModal}
        />
      )}
    </div>
  )
}

type RepliesProps = {
  replies: Message[]
  game: Game
  myself: GameParticipant | null
  openProfileModal: (participantId: string) => void
  openFavoritesModal: (messageId: string) => void
}

const Replies = ({
  replies,
  game,
  myself,
  openProfileModal,
  openFavoritesModal
}: RepliesProps) => {
  return (
    <div className='ml-8'>
      {replies.map((message: Message) => (
        <MessageComponent
          game={game}
          message={message}
          myself={myself}
          key={message.id}
          openProfileModal={openProfileModal}
          openFavoritesModal={openFavoritesModal}
        />
      ))}
    </div>
  )
}
