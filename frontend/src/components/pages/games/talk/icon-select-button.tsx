import Modal from '@/components/modal/modal'
import { GameParticipantIcon } from '@/lib/generated/graphql'
import { useState } from 'react'
import { useUserDisplaySettingsValue } from '../game-hook'
import Image from 'next/image'

type Props = {
  icons: Array<GameParticipantIcon>
  iconId: string
  setIconId: (iconId: string) => void
}

const IconButton = ({ icons, iconId, setIconId }: Props) => {
  const [isOpenIconSelectModal, setIsOpenIconSelectModal] = useState(false)
  const toggleIconSelectModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenIconSelectModal(!isOpenIconSelectModal)
    }
  }

  const selectedIcon = icons.find((icon) => icon.id === iconId)
  const imageSizeRatio = useUserDisplaySettingsValue().iconSizeRatio ?? 1
  if (icons.length <= 0 || selectedIcon == null) return <></>

  return (
    <div>
      <button
        onClick={(e: any) => {
          e.preventDefault()
          setIsOpenIconSelectModal(true)
        }}
        disabled={icons.length <= 0}
      >
        <Image
          src={selectedIcon.url}
          width={selectedIcon.width * imageSizeRatio}
          height={selectedIcon.height * imageSizeRatio}
          alt='キャラアイコン'
        />
      </button>
      {isOpenIconSelectModal && (
        <Modal close={toggleIconSelectModal} hideFooter>
          <IconSelect
            icons={icons}
            setIconId={setIconId}
            toggle={() => setIsOpenIconSelectModal(false)}
          />
        </Modal>
      )}
    </div>
  )
}

export default IconButton

type IconSelectProps = {
  icons: Array<GameParticipantIcon>
  setIconId: (iconId: string) => void
  toggle: () => void
}
const IconSelect = ({ icons, setIconId, toggle }: IconSelectProps) => {
  const handleSelect = (e: any, iconId: string) => {
    e.preventDefault()
    setIconId(iconId)
    toggle()
  }
  const imageSizeRatio = useUserDisplaySettingsValue().iconSizeRatio ?? 1

  return (
    <div>
      {icons.map((icon) => (
        <button onClick={(e: any) => handleSelect(e, icon.id)} key={icon.id}>
          <Image
            src={icon.url}
            width={icon.width * imageSizeRatio}
            height={icon.height * imageSizeRatio}
            alt='キャラアイコン'
          />
        </button>
      ))}
    </div>
  )
}
