import { base64ToId } from '@/components/graphql/convert'
import { useGameValue } from '@/components/pages/games/game-hook'
import { Message } from '@/lib/generated/graphql'
import Link from 'next/link'

type Props = {
  message: Message
  preview: boolean
}

export const SenderName = ({ message, preview }: Props) => {
  const game = useGameValue()
  const NameComponent = () => (
    <p className='primary-hover-text text-xs'>
      ENo.{message.sender!.entryNumber}&nbsp;
      {message.sender!.name}
    </p>
  )
  if (preview) {
    return <NameComponent />
  }
  return (
    <Link
      href={`/games/${base64ToId(game.id)}/profile/${base64ToId(
        message.sender!.participantId
      )}`}
      target='_blank'
    >
      <NameComponent />
    </Link>
  )
}
