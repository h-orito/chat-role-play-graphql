import Modal from '@/components/modal/modal'
import { GameParticipantIcon } from '@/lib/generated/graphql'
import { useUserDisplaySettingsValue } from '../game-hook'
import Image from 'next/image'
import { useModal } from '@/components/hooks/use-modal'

type Props = {
  icons: Array<GameParticipantIcon>
  iconId: string
  setIconId: (iconId: string) => void
}

const IconButton = ({ icons, iconId, setIconId }: Props) => {
  const iconSelectModal = useModal()

  const selectedIcon = icons.find((icon) => icon.id === iconId)
  const imageSizeRatio = useUserDisplaySettingsValue().iconSizeRatio ?? 1
  if (icons.length <= 0 || selectedIcon == null) return <></>

  return (
    <div>
      <button
        onClick={(e: React.MouseEvent) => {
          e.preventDefault()
          iconSelectModal.open()
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
      {iconSelectModal.isOpen && (
        <Modal close={iconSelectModal.close} hideFooter>
          <IconSelect
            icons={icons}
            setIconId={setIconId}
            toggle={iconSelectModal.close}
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
  const handleSelect = (e: React.MouseEvent, iconId: string) => {
    e.preventDefault()
    setIconId(iconId)
    toggle()
  }
  const imageSizeRatio = useUserDisplaySettingsValue().iconSizeRatio ?? 1

  return (
    <div>
      {icons.map((icon) => (
        <button
          onClick={(e: React.MouseEvent) => handleSelect(e, icon.id)}
          key={icon.id}
        >
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
