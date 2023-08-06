import { Game, GameParticipant, Player } from '@/lib/generated/graphql'
import {
  UsersIcon,
  InformationCircleIcon,
  WrenchIcon,
  UserCircleIcon,
  UserPlusIcon,
  PencilSquareIcon,
  HomeIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import GameSettings from './game-settings'
import Modal from '@/components/modal/modal'
import Participate from './participate'
import { useAuth0 } from '@auth0/auth0-react'
import Talk from '../talk/talk'
import ArticleModal from '@/components/modal/article-modal'
import Participants from '../participant/participants'
import Link from 'next/link'
import GameSettingsEdit from './game-settings-edit'
import { convertToGameStatusName } from '@/components/graphql/convert'
import { iso2display } from '@/components/util/datetime/datetime'
import TalkSystem from '../talk/talk-system'
import { GoogleAdsense } from '@/components/adsense/google-adsense'
import GameMasterEdit from './game-master-edit'

type SidebarProps = {
  isSidebarOpen: boolean
  toggleSidebar: (e: any) => void
  game: Game
  myself: GameParticipant | null
  myPlayer: Player | null
  openProfileModal: (participantId: string) => void
}

export default function Sidebar({
  isSidebarOpen,
  toggleSidebar,
  game,
  myself,
  myPlayer,
  openProfileModal
}: SidebarProps) {
  const { isAuthenticated } = useAuth0()

  const isGameMaster = game.gameMasters.some(
    (gm) => gm.player.id === myPlayer?.id
  )

  const canParticipate =
    isAuthenticated &&
    !myself &&
    ((['Closed', 'Opening'].includes(game.status) && isGameMaster) ||
      ['Recruiting', 'Progress'].includes(game.status))

  const canModify = ['Opening', 'Recruiting', 'Progress'].includes(game.status)

  const displayClass = isSidebarOpen
    ? 'fixed z-20 bg-white md:static flex'
    : 'hidden'

  return (
    <>
      <nav
        className={`${displayClass} mut-height-guard h-screen w-64 flex-col border-r border-gray-300 py-4 md:flex`}
      >
        <h1 className='mb-2 px-4 text-xl font-bold'>{game.name}</h1>
        <GameStatus game={game} />
        <div className='border-t border-gray-300 py-2'>
          <ParticipantsButton game={game} openProfileModal={openProfileModal} />
          <GameSettingsButton game={game} />
          <UserSettingsButton />
        </div>
        {isGameMaster && (
          <div className='border-t border-gray-300 py-2'>
            <GameSettingsEditButton game={game} />
            {canModify && <GameMasterEditButton game={game} />}
            <SystemMessageButton game={game} />
          </div>
        )}
        {myself && (
          <div className='border-t border-gray-300 py-2'>
            {canModify && <TalkButton game={game} myself={myself} />}
            <ProfileButton
              myself={myself}
              openProfileModal={openProfileModal}
            />
          </div>
        )}
        {canParticipate && (
          <div className='border-t border-gray-300 py-2'>
            <ParticipateButton game={game} />
          </div>
        )}
        <div className='border-t border-gray-300 py-2'>
          <TopPageButton />
        </div>
        {isSidebarOpen && (
          <div className='my-4'>
            <GoogleAdsense slot='1577139382' format='auto' responsive='true' />
          </div>
        )}
      </nav>
      {isSidebarOpen && (
        <div
          className='fixed inset-x-0 inset-y-0 z-10 h-screen w-screen bg-black/60 md:hidden'
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  )
}

type StatusProps = {
  game: Game
}

const GameStatus = ({ game }: StatusProps) => {
  const statusName = convertToGameStatusName(game.status)
  const statusDescription =
    game.status === 'Closed'
      ? `${iso2display(game.settings.time.openAt)}から公開開始`
      : game.status === 'Opening'
      ? `${iso2display(game.settings.time.startParticipateAt)}から参加登録開始`
      : game.status === 'Recruiting'
      ? `${iso2display(game.settings.time.startGameAt)}からゲーム開始`
      : game.status === 'Progress'
      ? `${iso2display(game.settings.time.finishGameAt)}にゲーム終了`
      : null

  return (
    <div className='mb-4 px-4 text-xs'>
      <span className='rounded-md border border-blue-500 px-1 text-blue-500'>
        {statusName}
      </span>
      {statusDescription && <p>{statusDescription}</p>}
    </div>
  )
}

type ParticipantsProps = {
  game: Game
  openProfileModal: (participantId: string) => void
}

const ParticipantsButton = ({ game, openProfileModal }: ParticipantsProps) => {
  const [isOpenParticipantsModal, setIsParticipantsModal] = useState(false)
  const toggleParticipantsModal = (e: any) => {
    setIsParticipantsModal(!isOpenParticipantsModal)
  }

  return (
    <>
      <div>
        <button
          className='flex w-full justify-start px-4 py-2 hover:bg-slate-200'
          onClick={() => setIsParticipantsModal(true)}
        >
          <UsersIcon className='mr-1 h-6 w-6' />
          <p className='flex-1 self-center text-left'>参加者</p>
        </button>
      </div>
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
    </>
  )
}

type GameSettingsButtonProps = {
  game: Game
}

const GameSettingsButton = ({ game }: GameSettingsButtonProps) => {
  const [isOpenGameSettingsModal, setIsOpenGameSettingsModal] = useState(false)
  const toggleGameSettingsModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenGameSettingsModal(!isOpenGameSettingsModal)
    }
  }

  return (
    <>
      <div>
        <button
          className='flex w-full justify-start px-4 py-2 hover:bg-slate-200'
          onClick={() => setIsOpenGameSettingsModal(true)}
        >
          <InformationCircleIcon className='mr-1 h-6 w-6' />
          <p className='flex-1 self-center text-left'>ゲーム設定</p>
        </button>
      </div>
      {isOpenGameSettingsModal && (
        <Modal header='ゲーム設定' close={toggleGameSettingsModal}>
          <GameSettings game={game} close={toggleGameSettingsModal} />
        </Modal>
      )}
    </>
  )
}

type UserSettingsButtonProps = {}

const UserSettingsButton = ({}: UserSettingsButtonProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const toggleModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenModal(!isOpenModal)
    }
  }
  return (
    <>
      <div>
        <button
          className='flex w-full justify-start px-4 py-2 hover:bg-slate-200'
          onClick={() => setIsOpenModal(true)}
        >
          <WrenchIcon className='mr-1 h-6 w-6' />
          <p className='flex-1 self-center text-left'>ユーザー設定</p>
        </button>
      </div>
      {isOpenModal && (
        <Modal close={toggleModal} hideFooter>
          <div>準備中</div>
        </Modal>
      )}
    </>
  )
}

const TopPageButton = () => (
  <div>
    <Link href='/'>
      <button className='flex w-full justify-start px-4 py-2 hover:bg-slate-200'>
        <HomeIcon className='mr-1 h-6 w-6' />
        <p className='flex-1 self-center text-left'>トップ画面</p>
      </button>
    </Link>
  </div>
)

type GameSettingsEditButtonProps = {
  game: Game
}

const GameSettingsEditButton = ({ game }: GameSettingsEditButtonProps) => {
  const [isOpenGameSettingsEditModal, setIsOpenGameSettingsEditModal] =
    useState(false)
  const toggleGameSettingsEditModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenGameSettingsEditModal(!isOpenGameSettingsEditModal)
    }
  }
  return (
    <>
      <button
        className='flex w-full justify-start px-4 py-2 hover:bg-slate-200'
        onClick={() => setIsOpenGameSettingsEditModal(true)}
      >
        <LockClosedIcon className='mr-1 h-6 w-6' />
        <p className='flex-1 self-center text-left'>ゲーム設定変更</p>
      </button>
      {isOpenGameSettingsEditModal && (
        <Modal close={toggleGameSettingsEditModal}>
          <GameSettingsEdit game={game} />
        </Modal>
      )}
    </>
  )
}

type GameMasterEditButtonProps = {
  game: Game
}

const GameMasterEditButton = ({ game }: GameMasterEditButtonProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const toggleModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenModal(!isOpenModal)
    }
  }
  return (
    <>
      <button
        className='flex w-full justify-start px-4 py-2 hover:bg-slate-200'
        onClick={() => setIsOpenModal(true)}
      >
        <LockClosedIcon className='mr-1 h-6 w-6' />
        <p className='flex-1 self-center text-left'>GM追加削除</p>
      </button>
      {isOpenModal && (
        <Modal close={toggleModal} header='ゲームマスター追加削除'>
          <GameMasterEdit game={game} close={toggleModal} />
        </Modal>
      )}
    </>
  )
}

type SystemMessageButtonProps = {
  game: Game
}

const SystemMessageButton = ({ game }: SystemMessageButtonProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const toggleModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenModal(!isOpenModal)
    }
  }
  return (
    <>
      <button
        className='flex w-full justify-start px-4 py-2 hover:bg-slate-200'
        onClick={() => setIsOpenModal(true)}
      >
        <PencilSquareIcon className='mr-1 h-6 w-6' />
        <p className='flex-1 self-center text-left'>GM発言</p>
      </button>
      {isOpenModal && (
        <Modal close={toggleModal} hideFooter>
          <TalkSystem game={game} close={toggleModal} />
        </Modal>
      )}
    </>
  )
}

type TalkButtonProps = {
  game: Game
  myself: GameParticipant | null
}

const TalkButton = ({ game, myself }: TalkButtonProps) => {
  const [isOpenTalkModal, setIsOpenTalkModal] = useState(false)
  const toggleTalkModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenTalkModal(!isOpenTalkModal)
    }
  }
  return (
    <>
      <button
        className='flex w-full justify-start px-4 py-2 hover:bg-slate-200'
        onClick={() => setIsOpenTalkModal(true)}
      >
        <PencilSquareIcon className='mr-1 h-6 w-6' />
        <p className='flex-1 self-center text-left'>発言</p>
      </button>
      {isOpenTalkModal && (
        <Modal close={toggleTalkModal} hideFooter>
          <Talk game={game} myself={myself!} close={toggleTalkModal} />
        </Modal>
      )}
    </>
  )
}

type ProfileButtonProps = {
  myself: GameParticipant
  openProfileModal: (participantId: string) => void
}

const ProfileButton = ({ myself, openProfileModal }: ProfileButtonProps) => {
  return (
    <>
      <button
        className='flex w-full justify-start px-4 py-2 hover:bg-slate-200'
        onClick={() => openProfileModal(myself.id)}
      >
        <UserCircleIcon className='mr-1 h-6 w-6' />
        <p className='flex-1 self-center text-left'>{myself.name}</p>
      </button>
    </>
  )
}

type ParticipateButtonProps = {
  game: Game
}

const ParticipateButton = ({ game }: ParticipateButtonProps) => {
  const [isOpenParticipateModal, setIsOpenParticipateModal] = useState(false)
  const toggleParticipateModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenParticipateModal(!isOpenParticipateModal)
    }
  }
  return (
    <>
      <button
        className='flex w-full justify-start px-4 py-2 hover:bg-slate-200'
        onClick={() => setIsOpenParticipateModal(true)}
      >
        <UserPlusIcon className='mr-1 h-6 w-6' />
        <p className='flex-1 self-center text-left'>参加登録</p>
      </button>
      {isOpenParticipateModal && (
        <Modal header='参加登録' close={toggleParticipateModal} hideFooter>
          <Participate game={game} close={toggleParticipateModal} />
        </Modal>
      )}
    </>
  )
}
