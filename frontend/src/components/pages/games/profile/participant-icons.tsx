import Image from 'next/image'
import {
  Game,
  GameParticipantIcon,
  GameParticipant
} from '@/lib/generated/graphql'
import { useState } from 'react'
import PrimaryButton from '@/components/button/primary-button'
import Modal from '@/components/modal/modal'
import ParticipantIconEdit from './participant-icon-edit'

type Props = {
  game: Game
  myself: GameParticipant | null
  icons: Array<GameParticipantIcon>
  canEdit: boolean
  refetchIcons: () => Promise<Array<GameParticipantIcon>>
}

export default function ParticipantIcons({
  game,
  myself,
  icons,
  canEdit,
  refetchIcons
}: Props) {
  const [isOpenIconEditModal, setIsOpenIconEditModal] = useState(false)

  const toggleIconEditModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenIconEditModal(!isOpenIconEditModal)
    }
  }

  return (
    <div className='my-4'>
      <div className='flex'>
        {icons.length === 0 && (
          <div className='relative flex'>
            <Image
              className='block w-full'
              src={
                'https://placehold.jp/cccccc/999/120x120.png?text=no%20image'
              }
              width={60}
              height={60}
              alt='アイコン'
            />
          </div>
        )}
        {icons.length > 0 &&
          icons.map((icon) => (
            <div className='relative flex' key={icon.id}>
              <Image
                className='block w-full'
                src={icon.url}
                width={60}
                height={60}
                alt='アイコン'
              />
            </div>
          ))}
      </div>
      {canEdit && (
        <PrimaryButton
          className='mt-2'
          click={() => setIsOpenIconEditModal(true)}
        >
          アイコン管理
        </PrimaryButton>
      )}
      {isOpenIconEditModal && (
        <Modal header='アイコン管理' close={toggleIconEditModal} hideFooter>
          <ParticipantIconEdit
            game={game}
            myself={myself}
            icons={icons}
            refetchIcons={refetchIcons}
            close={toggleIconEditModal}
          />
        </Modal>
      )}
    </div>
  )
}