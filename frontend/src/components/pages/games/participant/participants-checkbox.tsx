import { GameParticipant } from '@/lib/generated/graphql'
import Image from 'next/image'

type Props = {
  participants: GameParticipant[]
  selects: GameParticipant[]
  setSelects: (selects: GameParticipant[]) => void
}

export default function ParticipantsCheckbox({
  participants,
  selects,
  setSelects
}: Props) {
  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      {participants.map((participant) => {
        const checked = selects.includes(participant)
        const checkedClass = checked
          ? 'border-blue-500 bg-blue-100'
          : 'border-gray-300'
        return (
          <label
            key={participant.id}
            className={`flex rounded-md border p-4 hover:bg-gray-100 ${checkedClass}`}
            htmlFor={`participant-checkbox-${participant.id}`}
          >
            <input
              id={`participant-checkbox-${participant.id}`}
              type='checkbox'
              className='mr-2 hidden'
              checked={checked}
              onChange={() => {
                if (selects.includes(participant)) {
                  setSelects(selects.filter((s) => s.id !== participant.id))
                } else {
                  setSelects([...selects, participant])
                }
              }}
            />
            <div>
              <Image
                className='cursor-pointer'
                src={
                  participant.profileIcon?.url ??
                  'https://placehold.jp/120x120.png'
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
