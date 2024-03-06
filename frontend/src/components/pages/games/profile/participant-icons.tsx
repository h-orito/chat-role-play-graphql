import Image from 'next/image'
import { GameParticipantIcon } from '@/lib/generated/graphql'
import { useState } from 'react'
import PrimaryButton from '@/components/button/primary-button'
import Modal from '@/components/modal/modal'
import ParticipantIconEdit from './participant-icon-edit'
import { useMyselfValue } from '../game-hook'

type Props = {
  icons: Array<GameParticipantIcon>
  canEdit: boolean
  refetchIcons: () => Promise<Array<GameParticipantIcon>>
}

export default function ParticipantIcons({
  icons,
  canEdit,
  refetchIcons
}: Props) {
  const myself = useMyselfValue()
  const [isOpenIconEditModal, setIsOpenIconEditModal] = useState(false)

  const toggleIconEditModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenIconEditModal(!isOpenIconEditModal)
    }
  }

  const canIconEdit = canEdit && myself!.chara == null

  return (
    <div className='my-4'>
      <div className='flex flex-wrap'>
        {icons.length === 0 && (
          <div className=''>
            <Image
              className='block w-full'
              src={'/chat-role-play/images/no-image-icon.png'}
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
                className='block'
                src={icon.url}
                width={icon.width}
                height={icon.height}
                alt='アイコン'
              />
            </div>
          ))}
      </div>
      {canIconEdit && (
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
            icons={icons}
            refetchIcons={refetchIcons}
            close={toggleIconEditModal}
          />
        </Modal>
      )}
    </div>
  )
}
