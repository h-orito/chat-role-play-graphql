import { GameLabel } from '@/lib/generated/graphql'
import {
  UsersIcon,
  InformationCircleIcon,
  WrenchIcon,
  UserCircleIcon,
  UserPlusIcon,
  HomeIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'
import { useMemo } from 'react'
import { useModal } from '@/components/hooks/use-modal'
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
import UserSettingsComponent from './user-settings'
import { GameIntroButton } from './game-intro-modal'
import { DebugMenu } from './debug-menu'
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
          className='fixed inset-0 z-20 h-screen w-screen bg-black/60 md:hidden'
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

const ParticipantsButton = () => {
  const game = useGameValue()
  const modal = useModal()

  return (
    <>
      <div>
        <button
          className='sidebar-hover sidebar-text flex w-full justify-start px-4 py-2 text-sm'
          onClick={modal.open}
        >
          <UsersIcon className='mr-1 size-5' />
          <p className='flex-1 self-center text-left'>参加者</p>
        </button>
      </div>
      {modal.isOpen && (
        <ArticleModal header='参加者一覧' close={modal.close} hideFooter>
          <Participants className='p-4' participants={game.participants} />
        </ArticleModal>
      )}
    </>
  )
}

const GameSettingsButton = () => {
  const modal = useModal()

  return (
    <>
      <div>
        <button
          className='sidebar-hover sidebar-text flex w-full justify-start px-4 py-2 text-sm'
          onClick={modal.open}
        >
          <InformationCircleIcon className='mr-1 size-5' />
          <p className='flex-1 self-center text-left'>ゲーム設定</p>
        </button>
      </div>
      {modal.isOpen && (
        <Modal header='ゲーム設定' close={modal.close}>
          <GameSettings close={modal.close} />
        </Modal>
      )}
    </>
  )
}

const UserSettingsButton = () => {
  const modal = useModal()
  return (
    <>
      <div>
        <button
          className='sidebar-hover sidebar-text flex w-full justify-start px-4 py-2 text-sm'
          onClick={modal.open}
        >
          <WrenchIcon className='mr-1 size-5' />
          <p className='flex-1 self-center text-left'>ユーザー設定</p>
        </button>
      </div>
      {modal.isOpen && (
        <Modal close={modal.close} hideFooter>
          <UserSettingsComponent close={modal.close} />
        </Modal>
      )}
    </>
  )
}

const TopPageButton = () => (
  <div>
    <Link href='/'>
      <button className='sidebar-hover sidebar-text flex w-full justify-start px-4 py-2 text-sm'>
        <HomeIcon className='mr-1 size-5' />
        <p className='flex-1 self-center text-left'>トップ画面</p>
      </button>
    </Link>
  </div>
)

const GameSettingsEditButton = () => {
  const modal = useModal()
  return (
    <>
      <button
        className='sidebar-text sidebar-hover flex w-full justify-start px-4 py-2 text-sm'
        onClick={modal.open}
      >
        <LockClosedIcon className='mr-1 size-5' />
        <p className='flex-1 self-center text-left'>ゲーム設定変更</p>
      </button>
      {modal.isOpen && (
        <Modal close={modal.close} hideOnClickOutside={false}>
          <GameSettingsEdit />
        </Modal>
      )}
    </>
  )
}

const GameStatusEditButton = () => {
  const modal = useModal()
  return (
    <>
      <button
        className='sidebar-hover sidebar-text flex w-full justify-start px-4 py-2 text-sm'
        onClick={modal.open}
      >
        <LockClosedIcon className='mr-1 size-5' />
        <p className='flex-1 self-center text-left'>ステータス・期間変更</p>
      </button>
      {modal.isOpen && (
        <Modal close={modal.close}>
          <GameStatusEdit />
        </Modal>
      )}
    </>
  )
}

const GameMasterEditButton = () => {
  const modal = useModal()
  return (
    <>
      <button
        className='sidebar-text sidebar-hover flex w-full justify-start px-4 py-2 text-sm'
        onClick={modal.open}
      >
        <LockClosedIcon className='mr-1 size-5' />
        <p className='flex-1 self-center text-left'>GM追加削除</p>
      </button>
      {modal.isOpen && (
        <Modal close={modal.close} header='ゲームマスター追加削除'>
          <GameMasterEdit close={modal.close} />
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
        <UserCircleIcon className='mr-1 size-5' />
        <p className='flex-1 self-center text-left'>{myself.name}</p>
      </Link>
    </>
  )
}

const ParticipateButton = () => {
  const modal = useModal()
  return (
    <>
      <button
        className='sidebar-text sidebar-hover flex w-full justify-start px-4 py-2 text-sm'
        onClick={modal.open}
      >
        <UserPlusIcon className='mr-1 size-5' />
        <p className='flex-1 self-center text-left'>参加登録</p>
      </button>
      {modal.isOpen && (
        <Modal header='参加登録' close={modal.close} hideFooter>
          <Participate close={modal.close} />
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
