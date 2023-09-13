import {
  DebugMessagesDocument,
  DebugMessagesMutation,
  Game,
  GameLabel,
  GameParticipant,
  Player
} from '@/lib/generated/graphql'
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
import { useRef, useState } from 'react'
import GameSettings from './game-settings'
import Modal from '@/components/modal/modal'
import Participate from './participate'
import { useAuth0 } from '@auth0/auth0-react'
import ArticleModal from '@/components/modal/article-modal'
import Participants from '../participant/participants'
import Link from 'next/link'
import GameSettingsEdit from './game-settings-edit'
import { convertToGameStatusName } from '@/components/graphql/convert'
import { iso2display } from '@/components/util/datetime/datetime'
import TalkSystem, { TalkSystemRefHandle } from '../talk/talk-system'
import { GoogleAdsense } from '@/components/adsense/google-adsense'
import GameMasterEdit from './game-master-edit'
import GameStatusEdit from './game-status-edit'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import UserSettingsComponent from './user-settings'

type SidebarProps = {
  isSidebarOpen: boolean
  toggleSidebar: (e: any) => void
  game: Game
  myself: GameParticipant | null
  myPlayer: Player | null
  openProfileModal: (participantId: string) => void
  fetchHomeLatest: () => void
}

export default function Sidebar({
  isSidebarOpen,
  toggleSidebar,
  game,
  myself,
  myPlayer,
  openProfileModal,
  fetchHomeLatest
}: SidebarProps) {
  const { isAuthenticated } = useAuth0()

  const isGameMaster =
    myPlayer?.authorityCodes.includes('AuthorityAdmin') ||
    game.gameMasters.some((gm) => gm.player.id === myPlayer?.id)

  const canParticipate =
    isAuthenticated &&
    !myself &&
    ((['Closed', 'Opening'].includes(game.status) && isGameMaster) ||
      ['Recruiting', 'Progress'].includes(game.status))

  const canModify = [
    'Closed',
    'Opening',
    'Recruiting',
    'Progress',
    'Epilogue'
  ].includes(game.status)

  const displayClass = isSidebarOpen
    ? 'fixed z-30 bg-white md:static flex'
    : 'hidden'

  return (
    <>
      <nav
        className={`${displayClass} mut-height-guard h-screen w-64 flex-col border-r border-gray-300 py-4 md:flex`}
      >
        <h1 className='mb-2 px-4 text-xl font-bold'>{game.name}</h1>
        <GameLabels game={game} />
        <GameStatus game={game} />
        <div className='border-t border-gray-300 py-2'>
          <ParticipantsButton game={game} openProfileModal={openProfileModal} />
          <GameSettingsButton game={game} />
          <UserSettingsButton />
        </div>
        {isGameMaster && (
          <div className='border-t border-gray-300 py-2'>
            <GameSettingsEditButton game={game} />
            {canModify && (
              <>
                <GameStatusEditButton game={game} />
                <GameMasterEditButton game={game} />
              </>
            )}
            <SystemMessageButton
              game={game}
              fetchHomeLatest={fetchHomeLatest}
            />
          </div>
        )}
        {myself && (
          <div className='border-t border-gray-300 py-2'>
            <ProfileButton
              myself={myself}
              openProfileModal={openProfileModal}
            />
          </div>
        )}
        <DebugMenu game={game} />
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
          className='fixed inset-x-0 inset-y-0 z-20 h-screen w-screen bg-black/60 md:hidden'
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
  const time = game.settings.time
  let statusDescription: string | undefined
  switch (game.status) {
    case 'Closed':
      statusDescription = `公開開始: ${iso2display(time.openAt)}`
      break
    case 'Opening':
      statusDescription = `登録開始: ${iso2display(time.startParticipateAt)}`
      break
    case 'Recruiting':
      statusDescription = `ゲーム開始: ${iso2display(time.startGameAt)}`
      break
    case 'Progress':
      const epilogueAt = time.epilogueGameAt
      const periodEndAt = game.periods[game.periods.length - 1].endAt
      if (epilogueAt < periodEndAt) {
        statusDescription = `エピローグ開始: ${iso2display(epilogueAt)}`
      } else {
        statusDescription = `次回更新: ${iso2display(periodEndAt)}`
      }
      break
    case 'Epilogue':
      statusDescription = `ゲーム終了: ${iso2display(time.finishGameAt)}`
      break
  }

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
          <UserSettingsComponent close={toggleModal} />
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

type GameStatusEditButtonProps = {
  game: Game
}

const GameStatusEditButton = ({ game }: GameStatusEditButtonProps) => {
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
        <p className='flex-1 self-center text-left'>ステータス・期間変更</p>
      </button>
      {isOpenModal && (
        <Modal close={toggleModal}>
          <GameStatusEdit game={game} />
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
  fetchHomeLatest: () => void
}

const SystemMessageButton = ({
  game,
  fetchHomeLatest
}: SystemMessageButtonProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const talkRef = useRef({} as TalkSystemRefHandle)
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
  const messageRegisteredCallback = () => {
    setIsOpenModal(false)
    fetchHomeLatest()
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
          <TalkSystem
            ref={talkRef}
            game={game}
            messageRegisteredCallback={messageRegisteredCallback}
          />
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

const GameLabels = ({ game }: { game: Game }) => {
  return (
    <div className='mb-2 flex px-4'>
      {game.labels.map((l: GameLabel, idx: number) => (
        <Label key={idx} label={l} />
      ))}
    </div>
  )
}

const Label = ({ label }: { label: GameLabel }) => {
  const colorClass =
    label.type === 'success'
      ? 'bg-green-500'
      : label.type === 'danger'
      ? 'bg-red-500'
      : 'bg-gray-500'
  return (
    <span className={`mr-1 rounded-md px-2 text-xs text-white ${colorClass}`}>
      {label.name}
    </span>
  )
}

const DebugMenu = ({ game }: { game: Game }) => {
  const [registerMessage] = useMutation<DebugMessagesMutation>(
    DebugMessagesDocument
  )
  const router = useRouter()
  const registerDebugMessages = async () => {
    await registerMessage({
      variables: {
        input: {
          gameId: game.id
        }
      }
    })
    router.reload()
  }

  if (process.env.NEXT_PUBLIC_ENV !== 'local') return <></>
  return (
    <div className='border-t border-gray-300 py-2'>
      <button
        className='flex w-full justify-start px-4 py-2 hover:bg-slate-200'
        onClick={() => registerDebugMessages()}
      >
        <UserPlusIcon className='mr-1 h-6 w-6' />
        <p className='flex-1 self-center text-left'>100回発言</p>
      </button>
    </div>
  )
}
