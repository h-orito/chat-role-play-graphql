import { Game } from '@/lib/generated/graphql'
import {
  UsersIcon,
  InformationCircleIcon,
  WrenchIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import GameSettings from './game-settings'
import Modal from '@/components/modal/modal'

type SidebarProps = {
  game: Game
}

export default function Sidebar({ game }: SidebarProps) {
  const [isOpenGameSettingsModal, setIsOpenGameSettingsModal] = useState(false)
  const toggleGameSettingsModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenGameSettingsModal(!isOpenGameSettingsModal)
    }
  }

  return (
    <nav className='h-screen w-48 border-r border-gray-300 py-4'>
      <h1 className='mb-4 px-4 text-xl font-bold'>{game.name}</h1>
      <div>
        <button className='flex w-full justify-start px-4 py-2 hover:bg-slate-200'>
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
      <div>
        <button className='flex w-full justify-start px-4 py-2 hover:bg-slate-200'>
          <UserCircleIcon className='mr-1 h-6 w-6' />
          <p className='flex-1 self-center text-left'>プロフィール</p>
        </button>
      </div>
      {isOpenGameSettingsModal && (
        <Modal header='ゲーム設定' close={toggleGameSettingsModal}>
          <GameSettings game={game} close={toggleGameSettingsModal} />
        </Modal>
      )}
    </nav>
  )
}
