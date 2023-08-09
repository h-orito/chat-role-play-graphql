import { GameParticipant } from '@/lib/generated/graphql'
import Image from 'next/image'

type Props = {
  className?: string
  participants: GameParticipant[]
  openProfileModal: (participantId: string) => void
}

export default function Participants({
  className,
  participants,
  openProfileModal
}: Props) {
  return (
    <div className={`${className} grid grid-cols-1 gap-4 md:grid-cols-2`}>
      {participants.length === 0 && <p>まだ参加登録されていません。</p>}
      {participants.map((participant) => (
        <button
          key={participant.id}
          className='flex rounded-md border border-gray-300 p-4 hover:bg-gray-100'
          onClick={() => openProfileModal(participant.id)}
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
        </button>
      ))}
    </div>
  )
}
