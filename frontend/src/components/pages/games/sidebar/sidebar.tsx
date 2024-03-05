import {
  DebugMessagesDocument,
  DebugMessagesMutation,
  Game,
  GameLabel
} from '@/lib/generated/graphql'
import {
  UsersIcon,
  InformationCircleIcon,
  WrenchIcon,
  UserCircleIcon,
  UserPlusIcon,
  HomeIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'
import { Dispatch, SetStateAction, useMemo, useRef, useState } from 'react'
import GameSettings from './game-settings'
import Modal from '@/components/modal/modal'
import Participate from './participate'
import ArticleModal from '@/components/modal/article-modal'
import Participants from '../participant/participants'
import Link from 'next/link'
import GameSettingsEdit from './game-settings-edit'
import {
  base64ToId,
  convertToGameStatusName
} from '@/components/graphql/convert'
import { iso2display } from '@/components/util/datetime/datetime'
import { GoogleAdsense } from '@/components/adsense/google-adsense'
import GameMasterEdit from './game-master-edit'
import GameStatusEdit from './game-status-edit'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import UserSettingsComponent from './user-settings'
import { useCookies } from 'react-cookie'
import Image from 'next/image'
import MessageText from '@/components/pages/games/article/message-area/message-text/message-text'
import {
  isGameMaster as _isGameMaster,
  canParticipate as _canParticipate,
  canModifyGameSetting,
  useGameValue,
  useMyPlayer,
  useMyselfValue,
  useSidebarOpen
} from '../game-hook'

export default function Sidebar() {
  const [isSidebarOpen, toggleSidebar] = useSidebarOpen()
  const game = useGameValue()
  const myself = useMyselfValue()
  const myPlayer = useMyPlayer()

  const isGameMaster = _isGameMaster(myPlayer, game)
  const canParticipate = _canParticipate(game, myPlayer, myself, isGameMaster)
  const canModify = canModifyGameSetting(game, myPlayer)

  const displayClass = isSidebarOpen
    ? 'fixed z-30 bg-white md:static flex'
    : 'hidden'

  return (
    <>
      <nav
        className={`${displayClass} sidebar-background mut-height-guard base-border h-screen w-64 flex-col border-r py-4 md:flex`}
      >
        <h1 className='mb-2 px-4 text-xl font-bold'>{game.name}</h1>
        <GameLabels />
        <GameStatus />
        <div className='base-border border-t py-2'>
          <GameIntroButton />
          <ParticipantsButton />
          <GameSettingsButton />
          <UserSettingsButton />
        </div>
        {canModify && (
          <div className='base-border border-t py-2'>
            <GameSettingsEditButton />
            <GameStatusEditButton />
            <GameMasterEditButton />
          </div>
        )}
        {myself && (
          <div className='base-border border-t py-2'>
            <ProfileButton />
          </div>
        )}
        <DebugMenu />
        {canParticipate && (
          <div className='base-border border-t py-2'>
            <ParticipateButton />
          </div>
        )}
        <div className='base-border border-t py-2'>
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

const GameStatus = () => {
  const game = useGameValue()
  const statusName = convertToGameStatusName(game.status)
  const time = game.settings.time
  const statusDescription = useMemo(() => {
    switch (game.status) {
      case 'Closed':
        return `公開開始: ${iso2display(time.openAt)}`
      case 'Opening':
        return `登録開始: ${iso2display(time.startParticipateAt)}`
      case 'Recruiting':
        return `ゲーム開始: ${iso2display(time.startGameAt)}`
      case 'Progress':
        const epilogueAt = time.epilogueGameAt
        const periodEndAt = game.periods[game.periods.length - 1].endAt
        if (epilogueAt < periodEndAt) {
          return `エピローグ開始: ${iso2display(epilogueAt)}`
        } else {
          return `次回更新: ${iso2display(periodEndAt)}`
        }
      case 'Epilogue':
        return `ゲーム終了: ${iso2display(time.finishGameAt)}`
    }
  }, [game.status, game.settings.time, game.periods])

  return (
    <div className='mb-4 px-4 text-xs'>
      <span className='primary-border base-link rounded-md border px-1'>
        {statusName}
      </span>
      {statusDescription && <p>{statusDescription}</p>}
    </div>
  )
}

const GameIntroButton = () => {
  const game = useGameValue()
  const [getCookie, setCookie] = useCookies()
  const introCookie: IntroCookie = getCookie['intro'] || {}
  const alreadyConfiemed = !!introCookie && introCookie[game.id] === true
  const background = game.settings.background
  const hasIntro =
    (background.introduction != null && background.introduction !== '') ||
    (background.catchImageUrl != null && background.catchImageUrl !== '')
  const shouldShowModal = hasIntro && !alreadyConfiemed
  const [showModal, setShowModal] = useState(shouldShowModal)

  if (!hasIntro) return <></>

  return (
    <>
      <div>
        <button
          className='sidebar-hover sidebar-text flex w-full justify-start px-4 py-2 text-sm'
          onClick={() => setShowModal(true)}
        >
          <UsersIcon className='mr-1 h-5 w-5' />
          <p className='flex-1 self-center text-left'>ゲーム紹介</p>
        </button>
      </div>
      {showModal && (
        <GameIntroModal
          setCookie={setCookie}
          introCookie={introCookie}
          setShowModal={setShowModal}
        />
      )}
    </>
  )
}

const GameIntroModal = ({
  introCookie,
  setCookie,
  setShowModal
}: {
  introCookie: IntroCookie
  setCookie: any
  setShowModal: Dispatch<SetStateAction<boolean>>
}) => {
  const game = useGameValue()
  const handleClose = () => {
    introCookie[game.id] = true
    setCookie('intro', introCookie, {
      path: '/chat-role-play',
      maxAge: 60 * 60 * 24 * 365
    })
    setShowModal(false)
  }

  const background = game.settings.background
  const hasIntro =
    background.introduction != null && background.introduction !== ''
  const hasImage =
    background.catchImageUrl != null && background.catchImageUrl !== ''

  return (
    <Modal
      header={game.name}
      close={() => handleClose()}
      hideOnClickOutside={true}
    >
      <div className='text-center'>
        {hasImage && (
          <div
            className='relative flex h-96 justify-center'
            style={{ maxWidth: '80vw' }}
          >
            <Image
              src={background.catchImageUrl!}
              fill
              style={{ objectFit: 'contain' }}
              alt='ゲーム紹介画像'
            />
          </div>
        )}
        {hasIntro && (
          <p className='my-2 whitespace-pre-wrap break-words rounded-md bg-gray-100 p-4 text-xs text-gray-700'>
            <MessageText rawText={background.introduction!} />
          </p>
        )}
      </div>
    </Modal>
  )
}

type IntroCookie = {
  [gameId: string]: boolean
}

const ParticipantsButton = () => {
  const game = useGameValue()
  const [isOpenParticipantsModal, setIsParticipantsModal] = useState(false)
  const toggleParticipantsModal = (e: any) => {
    setIsParticipantsModal(!isOpenParticipantsModal)
  }

  return (
    <>
      <div>
        <button
          className='sidebar-hover sidebar-text flex w-full justify-start px-4 py-2 text-sm'
          onClick={() => setIsParticipantsModal(true)}
        >
          <UsersIcon className='mr-1 h-5 w-5' />
          <p className='flex-1 self-center text-left'>参加者</p>
        </button>
      </div>
      {isOpenParticipantsModal && (
        <ArticleModal
          header='参加者一覧'
          close={toggleParticipantsModal}
          hideFooter
        >
          <Participants className='p-4' participants={game.participants} />
        </ArticleModal>
      )}
    </>
  )
}

const GameSettingsButton = () => {
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
          className='sidebar-hover sidebar-text flex w-full justify-start px-4 py-2 text-sm'
          onClick={() => setIsOpenGameSettingsModal(true)}
        >
          <InformationCircleIcon className='mr-1 h-5 w-5' />
          <p className='flex-1 self-center text-left'>ゲーム設定</p>
        </button>
      </div>
      {isOpenGameSettingsModal && (
        <Modal header='ゲーム設定' close={toggleGameSettingsModal}>
          <GameSettings close={toggleGameSettingsModal} />
        </Modal>
      )}
    </>
  )
}

const UserSettingsButton = () => {
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
          className='sidebar-hover sidebar-text flex w-full justify-start px-4 py-2 text-sm'
          onClick={() => setIsOpenModal(true)}
        >
          <WrenchIcon className='mr-1 h-5 w-5' />
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
      <button className='sidebar-hover sidebar-text flex w-full justify-start px-4 py-2 text-sm'>
        <HomeIcon className='mr-1 h-5 w-5' />
        <p className='flex-1 self-center text-left'>トップ画面</p>
      </button>
    </Link>
  </div>
)

const GameSettingsEditButton = () => {
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
        className='sidebar-text sidebar-hover flex w-full justify-start px-4 py-2 text-sm'
        onClick={() => setIsOpenGameSettingsEditModal(true)}
      >
        <LockClosedIcon className='mr-1 h-5 w-5' />
        <p className='flex-1 self-center text-left'>ゲーム設定変更</p>
      </button>
      {isOpenGameSettingsEditModal && (
        <Modal close={toggleGameSettingsEditModal} hideOnClickOutside={false}>
          <GameSettingsEdit />
        </Modal>
      )}
    </>
  )
}

const GameStatusEditButton = () => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const toggleModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenModal(!isOpenModal)
    }
  }
  return (
    <>
      <button
        className='sidebar-hover sidebar-text flex w-full justify-start px-4 py-2 text-sm'
        onClick={() => setIsOpenModal(true)}
      >
        <LockClosedIcon className='mr-1 h-5 w-5' />
        <p className='flex-1 self-center text-left'>ステータス・期間変更</p>
      </button>
      {isOpenModal && (
        <Modal close={toggleModal}>
          <GameStatusEdit />
        </Modal>
      )}
    </>
  )
}

const GameMasterEditButton = () => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const toggleModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenModal(!isOpenModal)
    }
  }
  return (
    <>
      <button
        className='sidebar-text sidebar-hover flex w-full justify-start px-4 py-2 text-sm'
        onClick={() => setIsOpenModal(true)}
      >
        <LockClosedIcon className='mr-1 h-5 w-5' />
        <p className='flex-1 self-center text-left'>GM追加削除</p>
      </button>
      {isOpenModal && (
        <Modal close={toggleModal} header='ゲームマスター追加削除'>
          <GameMasterEdit close={toggleModal} />
        </Modal>
      )}
    </>
  )
}

const ProfileButton = () => {
  const game = useGameValue()
  const myself = useMyselfValue()!
  return (
    <>
      <Link
        href={`/games/${base64ToId(game.id)}/profile/${base64ToId(myself.id)}`}
        target='_blank'
        className='sidebar-text sidebar-hover flex w-full justify-start px-4 py-2 text-sm'
      >
        <UserCircleIcon className='mr-1 h-5 w-5' />
        <p className='flex-1 self-center text-left'>{myself.name}</p>
      </Link>
    </>
  )
}

const ParticipateButton = () => {
  const [isOpenParticipateModal, setIsOpenParticipateModal] = useState(false)
  const toggleParticipateModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenParticipateModal(!isOpenParticipateModal)
    }
  }
  return (
    <>
      <button
        className='sidebar-text sidebar-hover flex w-full justify-start px-4 py-2 text-sm'
        onClick={() => setIsOpenParticipateModal(true)}
      >
        <UserPlusIcon className='mr-1 h-5 w-5' />
        <p className='flex-1 self-center text-left'>参加登録</p>
      </button>
      {isOpenParticipateModal && (
        <Modal header='参加登録' close={toggleParticipateModal} hideFooter>
          <Participate close={toggleParticipateModal} />
        </Modal>
      )}
    </>
  )
}

const GameLabels = () => {
  const game = useGameValue()
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

const DebugMenu = () => {
  const game = useGameValue()
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
    <div className='base-border border-t py-2'>
      <button
        className='sidebar-text sidebar-hover flex w-full justify-start px-4 py-2 text-sm'
        onClick={() => registerDebugMessages()}
      >
        <UserPlusIcon className='mr-1 h-5 w-5' />
        <p className='flex-1 self-center text-left'>100回発言</p>
      </button>
    </div>
  )
}
