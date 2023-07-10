import { Game, GameParticipant } from '@/lib/generated/graphql'
import {
  UsersIcon,
  InformationCircleIcon,
  WrenchIcon,
  UserCircleIcon,
  UserPlusIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import GameSettings from './game-settings'
import Modal from '@/components/modal/modal'
import Participate from './participate'
import { useAuth0 } from '@auth0/auth0-react'
import Talk from '../talk/talk'
import ArticleModal from '@/components/modal/article-modal'
import Participants from '../participant/participants'

type SidebarProps = {
  game: Game
  myself: GameParticipant | null
  openProfileModal: (participantId: string) => void
}

export default function Sidebar({
  game,
  myself,
  openProfileModal
}: SidebarProps) {
  const { isAuthenticated } = useAuth0()
  const [isOpenParticipantsModal, setIsParticipantsModal] = useState(false)
  const toggleParticipantsModal = (e: any) => {
    setIsParticipantsModal(!isOpenParticipantsModal)
  }

  const [isOpenGameSettingsModal, setIsOpenGameSettingsModal] = useState(false)
  const toggleGameSettingsModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenGameSettingsModal(!isOpenGameSettingsModal)
    }
  }
  const [isOpenParticipateModal, setIsOpenParticipateModal] = useState(false)
  const toggleParticipateModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenParticipateModal(!isOpenParticipateModal)
    }
  }
  const [isOpenTalkModal, setIsOpenTalkModal] = useState(false)
  const toggleTalkModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenTalkModal(!isOpenTalkModal)
    }
  }

  return (
    <nav className='flex h-screen w-48 flex-col border-r border-gray-300 py-4'>
      <h1 className='mb-4 px-4 text-xl font-bold'>{game.name}</h1>
      <div>
        <button
          className='flex w-full justify-start px-4 py-2 hover:bg-slate-200'
          onClick={() => setIsParticipantsModal(true)}
        >
          <UsersIcon className='mr-1 h-6 w-6' />
          <p className='flex-1 self-center text-left'>参加者</p>
        </button>
      </div>
      <div>
        <button
          className='flex w-full justify-start px-4 py-2 hover:bg-slate-200'
          onClick={() => setIsOpenGameSettingsModal(true)}
        >
          <InformationCircleIcon className='mr-1 h-6 w-6' />
          <p className='flex-1 self-center text-left'>ゲーム設定</p>
        </button>
      </div>
      <div>
        <button className='flex w-full justify-start px-4 py-2 hover:bg-slate-200'>
          <WrenchIcon className='mr-1 h-6 w-6' />
          <p className='flex-1 self-center text-left'>ユーザー設定</p>
        </button>
      </div>
      {myself && (
        <div className='mt-auto'>
          <button
            className='flex w-full justify-start px-4 py-2 hover:bg-slate-200'
            onClick={() => setIsOpenTalkModal(true)}
          >
            <PencilSquareIcon className='mr-1 h-6 w-6' />
            <p className='flex-1 self-center text-left'>発言</p>
          </button>
          <button
            className='flex w-full justify-start px-4 py-2 hover:bg-slate-200'
            onClick={() => openProfileModal(myself.id)}
          >
            <UserCircleIcon className='mr-1 h-6 w-6' />
            <p className='flex-1 self-center text-left'>{myself.name}</p>
          </button>
        </div>
      )}
      {isAuthenticated && !myself && (
        <div>
          <button
            className='flex w-full justify-start px-4 py-2 hover:bg-slate-200'
            onClick={() => setIsOpenParticipateModal(true)}
          >
            <UserPlusIcon className='mr-1 h-6 w-6' />
            <p className='flex-1 self-center text-left'>参加登録</p>
          </button>
        </div>
      )}
      {isOpenParticipantsModal && (
        <ArticleModal
          header='参加者一覧'
          close={toggleParticipantsModal}
          hideFooter
        >
          <Participants
            className='p-4'
            participants={game.participants}
            openProfileModal={openProfileModal}
          />
        </ArticleModal>
      )}
      {isOpenGameSettingsModal && (
        <Modal header='ゲーム設定' close={toggleGameSettingsModal}>
          <GameSettings game={game} close={toggleGameSettingsModal} />
        </Modal>
      )}
      {isOpenParticipateModal && (
        <Modal header='参加登録' close={toggleParticipateModal} hideFooter>
          <Participate game={game} close={toggleParticipateModal} />
        </Modal>
      )}
      {isOpenTalkModal && (
        <Modal close={toggleTalkModal} hideFooter>
          <Talk game={game} myself={myself!} close={toggleTalkModal} />
        </Modal>
      )}
    </nav>
  )
}
