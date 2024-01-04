import { Game, GameParticipant, MessagesQuery } from '@/lib/generated/graphql'
import { useRef, useState } from 'react'
import Modal from '@/components/modal/modal'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import { TalkRefHandle } from '@/components/pages/games/talk/talk'
import TalkDescription from '@/components/pages/games/talk/talk-description'

type Props = {
  game: Game
  myself: GameParticipant | null
  search: (query?: MessagesQuery) => void
}

const DescriptionButton = ({ game, myself, search }: Props) => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const talkRef = useRef({} as TalkRefHandle)
  const toggleModal = (e: any) => {
    if (e.target === e.currentTarget) {
      const shouldWarning = talkRef.current && talkRef.current.shouldWarnClose()
      if (
        shouldWarning &&
        !window.confirm('発言内容が失われますが、閉じてよろしいですか？')
      )
        return
      setIsOpenModal(!isOpenModal)
    }
  }
  return (
    <div className='flex flex-1 text-center'>
      <button
        className='sidebar-background flex w-full justify-center px-4 py-2'
        onClick={() => setIsOpenModal(true)}
      >
        <DocumentTextIcon className='h-5 w-5' />
        <span className='my-auto ml-1 hidden text-xs md:block'>ト書き</span>
      </button>
      {isOpenModal && (
        <Modal close={toggleModal} hideFooter>
          <TalkDescription
            game={game}
            myself={myself!}
            closeWithoutWarning={() => setIsOpenModal(false)}
            search={search}
            ref={talkRef}
          />
        </Modal>
      )}
    </div>
  )
}

export default DescriptionButton
