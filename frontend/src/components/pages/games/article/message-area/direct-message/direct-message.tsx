import {
  DeleteDirectMessageFavorite,
  DirectMessage,
  FavoriteDirectDocument,
  FavoriteDirectMutation,
  FavoriteDirectMutationVariables,
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
import {
  useGameValue,
  useMyselfValue,
  useUserDisplaySettingsValue
} from '@/components/pages/games/game-hook'
import Link from 'next/link'
import { base64ToId } from '@/components/graphql/convert'
import DirectFavoriteButton from './direct-favorite-button'

type MessageProps = {
  directMessage: DirectMessage
  preview?: boolean
}

export default function DirectMessageComponent({
  directMessage,
  preview = false
}: MessageProps) {
  const game = useGameValue()
  const myself = useMyselfValue()
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

  const messageClass =
    directMessage.content.type === 'TalkNormal'
      ? 'talk-normal'
      : directMessage.content.type === 'Monologue'
      ? 'talk-monologue'
      : directMessage.content.type === 'Description'
      ? 'description'
      : ''

  const imageSizeRatio = useUserDisplaySettingsValue().iconSizeRatio ?? 1

  return (
    <div>
      <div className='w-full px-4 py-2'>
        {directMessage.sender && (
          <div className='flex pb-1'>
            <SenderName directMessage={directMessage} preview={preview} />
            <p className='secondary-text ml-auto self-end text-xs'>
              {iso2display(directMessage.time.sendAt)}
            </p>
          </div>
        )}
        <div className='flex'>
          <div>
            <SenderIcon
              directMessage={directMessage}
              preview={preview}
              imageSizeRatio={imageSizeRatio}
            />
          </div>
          <div className='ml-2 flex-1 text-sm'>
            <div
              className={`message ${messageClass}`}
              style={{
                minHeight: `${
                  directMessage.sender!.icon!.height * imageSizeRatio
                }px`
              }}
            >
              <MessageText
                rawText={directMessage.content.text}
                isConvertDisabled={directMessage.content.isConvertDisabled}
              />
            </div>
            <div className='flex justify-end pt-1'>
              <div className='flex'>
                <DirectFavoriteButton message={directMessage} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const SenderName = ({
  directMessage,
  preview
}: {
  directMessage: DirectMessage
  preview: boolean
}) => {
  const game = useGameValue()
  const NameComponent = () => (
    <p className='primary-hover-text text-xs'>
      ENo.{directMessage.sender.entryNumber}&nbsp;
      {directMessage.sender.name}
    </p>
  )
  if (preview) {
    return <NameComponent />
  }
  return (
    <Link
      href={`/games/${base64ToId(game.id)}/profile/${base64ToId(
        directMessage.sender!.participantId
      )}`}
      target='_blank'
    >
      <NameComponent />
    </Link>
  )
}

const SenderIcon = ({
  directMessage,
  preview,
  imageSizeRatio
}: {
  directMessage: DirectMessage
  preview: boolean
  imageSizeRatio: number
}) => {
  const game = useGameValue()
  const IconComponent = () => (
    <Image
      src={directMessage.sender!.icon!.url}
      width={directMessage.sender!.icon!.width * imageSizeRatio}
      height={directMessage.sender!.icon!.height * imageSizeRatio}
      alt='キャラアイコン'
    />
  )

  if (preview) {
    return <IconComponent />
  }
  return (
    <Link
      href={`/games/${base64ToId(game.id)}/profile/${base64ToId(
        directMessage.sender!.participantId
      )}`}
      target='_blank'
    >
      <IconComponent />
    </Link>
  )
}
