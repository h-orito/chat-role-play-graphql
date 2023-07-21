import { GameParticipant } from '@/lib/generated/graphql'
import {
  HomeIcon,
  UsersIcon,
  EnvelopeIcon,
  Bars4Icon
} from '@heroicons/react/24/outline'

type Props = {
  myself: GameParticipant | null
  tab: string
  setTab: (tabName: string) => void
  existsHomeUnread: boolean
  existsFollowsUnread: boolean
  toggleSidebar: (e: any) => void
  footer?: boolean
}

export default function ArticleMenu({
  myself,
  tab,
  setTab,
  existsHomeUnread,
  existsFollowsUnread,
  toggleSidebar,
  footer = false
}: Props) {
  const wrapperClass = footer
    ? 'flex md:hidden border-t'
    : 'hidden md:flex border-b'
  return (
    <div className={`${wrapperClass} border-gray-300`}>
      <div className={`flex flex-1 text-center md:hidden`}>
        <button
          className='flex w-full justify-center px-4 py-2 hover:bg-slate-200'
          onClick={toggleSidebar}
        >
          <Bars4Icon className={`mr-1 h-6 w-6`} />
        </button>
      </div>
      <HomeButton
        isActive={tab === 'home'}
        isFooter={footer}
        existsUnread={existsHomeUnread}
        onClickTab={() => setTab('home')}
      />
      {myself != null && (
        <>
          <FollowsButton
            isActive={tab === 'follow'}
            isFooter={footer}
            existsUnread={existsFollowsUnread}
            onClickTab={() => setTab('follow')}
          />
          <DirectMessageButton
            isActive={tab === 'dm'}
            isFooter={footer}
            existsUnread={false}
            onClickTab={() => setTab('dm')}
          />
        </>
      )}
    </div>
  )
}

type ButtonProps = {
  isActive: boolean
  isFooter: boolean
  existsUnread: boolean
  onClickTab: () => void
  children?: React.ReactNode
}

const MenuButton = ({
  isActive,
  isFooter,
  existsUnread,
  onClickTab,
  children
}: ButtonProps) => {
  const borderClass = isActive
    ? `box-border ${isFooter ? '' : 'border-b-2'} border-blue-500`
    : ''
  return (
    <div className={`flex-1 text-center ${borderClass}`}>
      <button
        className='flex w-full justify-center px-4 py-2 hover:bg-slate-200'
        onClick={() => onClickTab()}
      >
        {existsUnread && <span className='mr-2 text-xs text-blue-500'>●</span>}
        {children}
      </button>
    </div>
  )
}

const HomeButton = (props: ButtonProps) => {
  return (
    <MenuButton {...props}>
      <HomeIcon
        className={`mr-1 h-6 w-6 ${
          props.isActive && props.isFooter ? 'text-blue-500' : ''
        }`}
      />
      <span className='hidden md:block'>ホーム</span>
    </MenuButton>
  )
}

const FollowsButton = (props: ButtonProps) => {
  return (
    <MenuButton {...props}>
      <UsersIcon
        className={`mr-1 h-6 w-6 ${
          props.isActive && props.isFooter ? 'text-blue-500' : ''
        }`}
      />
      <span className='hidden md:block'>フォロー中</span>
    </MenuButton>
  )
}

const DirectMessageButton = (props: ButtonProps) => {
  return (
    <MenuButton {...props}>
      <EnvelopeIcon
        className={`mr-1 h-6 w-6 ${
          props.isActive && props.isFooter ? 'text-blue-500' : ''
        }`}
      />
      <span className='hidden md:block'>ダイレクトメッセージ</span>
    </MenuButton>
  )
}
