import { GameParticipant } from '@/lib/generated/graphql'
import Image from 'next/image'
import Link from 'next/link'
import { useGameValue } from '../game-hook'
import { base64ToId } from '@/components/graphql/convert'

type Props = {
  className?: string
  participants: GameParticipant[]
}

export default function Participants({ className, participants }: Props) {
  const game = useGameValue()
  const displayParticipants = participants.filter((p) => !p.isGone)
  return (
    <div className={`${className} grid grid-cols-1 gap-4 md:grid-cols-2`}>
      {displayParticipants.length === 0 && <p>まだ参加登録されていません。</p>}
      {displayParticipants.map((participant) => (
        <Link
          href={`/games/${base64ToId(game.id)}/profile/${base64ToId(
            participant.id
          )}`}
          target='_blank'
          key={participant.id}
          className='base-border flex rounded-md border p-4 hover:bg-gray-100'
        >
          <div>
            <Image
              className='cursor-pointer'
              src={
                participant.profileIcon?.url ??
                '/chat-role-play/images/no-image-icon.png'
              }
              width={60}
              height={60}
              alt='キャラアイコン'
            />
          </div>
          <div className='ml-2 flex-1'>
            <p className='text-left'>
              ENo.{participant.entryNumber} {participant.name}
            </p>
            {participant.memo && (
              <p className='text-left'>{participant.memo}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
