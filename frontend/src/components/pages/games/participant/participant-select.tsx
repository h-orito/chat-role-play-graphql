import { GameParticipant } from '@/lib/generated/graphql'
import Image from 'next/image'

type Props = {
  participants: GameParticipant[]
  handleSelect: (id: string) => void
}

export default function ParticipantSelect({
  participants,
  handleSelect
}: Props) {
  const displayParticipants = participants.filter((p) => !p.isGone)
  const handleClick = (e: any, id: string) => {
    e.preventDefault()
    handleSelect(id)
  }
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      {displayParticipants.map((participant) => {
        return (
          <label
            key={participant.id}
            className='flex rounded-md border p-4 hover:bg-gray-100'
            htmlFor={`participant-checkbox-${participant.id}`}
          >
            <button
              id={`participant-checkbox-${participant.id}`}
              className='mr-2 hidden'
              onClick={(e) => handleClick(e, participant.id)}
            />
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
          </label>
        )
      })}
    </div>
  )
}
