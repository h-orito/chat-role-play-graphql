import { GameParticipant } from '@/lib/generated/graphql'
import Image from 'next/image'
import React from 'react'

type Props = {
  participants: GameParticipant[]
  selects: GameParticipant[]
  setSelects: (selects: GameParticipant[]) => void
  children?: React.ReactNode
}

export default function ParticipantsCheckbox({
  participants,
  selects,
  setSelects,
  children
}: Props) {
  const displayParticipants = participants.filter((p) => !p.isGone)
  return (
    <>
      {children && <div className='mb-4'>{children}</div>}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {displayParticipants.map((participant) => {
          const checked = selects.includes(participant)
          const checkedClass = checked
            ? 'primary-border primary-background'
            : 'base-border'
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
    </>
  )
}
