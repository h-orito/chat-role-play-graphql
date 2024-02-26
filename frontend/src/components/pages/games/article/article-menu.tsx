import {
  HomeIcon,
  UsersIcon,
  EnvelopeIcon,
  Bars4Icon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { useMemo } from 'react'
import { useMyPlayerValue, useMyselfValue, useSidebarOpen } from '../game-hook'

type Props = {
  tab: string
  setTab: (tabName: string) => void
  existsHomeUnread: boolean
  existsFollowsUnread: boolean
  footer?: boolean
}

export default function ArticleMenu({
  tab,
  setTab,
  existsHomeUnread,
  existsFollowsUnread,
  footer = false
}: Props) {
  const myself = useMyselfValue()
  const myPlayer = useMyPlayerValue()
  const [, toggleSidebar] = useSidebarOpen()
  const wrapperClass = footer
    ? 'flex md:hidden border-t'
    : 'hidden md:flex border-b'

  const shouldShowDM = useMemo(() => {
    const isAdmin =
      myPlayer && myPlayer?.authorityCodes.includes('AuthorityAdmin')
    return !!myself || isAdmin || false
  }, [myself, myPlayer])

  return (
    <div className={`${wrapperClass} base-border text-sm`}>
      <div className={`flex flex-1 text-center md:hidden`}>
        <button
          className='sidebar-background flex w-full justify-center px-4 py-2'
          onClick={toggleSidebar}
        >
          <Bars4Icon className={`mr-1 h-5 w-5`} />
        </button>
      </div>
      <HomeButton
        isActive={tab === 'home'}
        isFooter={footer}
        existsUnread={existsHomeUnread}
        onClickTab={() => setTab('home')}
      />
      {myself != null && (
        <FollowsButton
          isActive={tab === 'follow'}
          isFooter={footer}
          existsUnread={existsFollowsUnread}
          onClickTab={() => setTab('follow')}
        />
      )}
      {/* <SearchButton
        isActive={tab === 'search'}
        isFooter={footer}
        existsUnread={false}
        onClickTab={() => setTab('search')}
      /> */}
      {shouldShowDM && (
        <DirectMessageButton
          isActive={tab === 'dm'}
          isFooter={footer}
          existsUnread={false}
          onClickTab={() => setTab('dm')}
        />
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
    ? `box-border ${isFooter ? '' : 'border-b-2'} primary-border`
    : ''
  return (
    <div className={`flex-1 text-center ${borderClass}`}>
      <button
        className='sidebar-hover sidebar-background flex w-full justify-center px-4 py-2'
        onClick={() => onClickTab()}
      >
        {existsUnread && <span className='base-link mr-2 text-xs'>●</span>}
        {children}
      </button>
    </div>
  )
}

const HomeButton = (props: ButtonProps) => {
  return (
    <MenuButton {...props}>
      <HomeIcon
        className={`mr-1 h-5 w-5 ${
          props.isActive && props.isFooter ? 'base-link' : ''
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
        className={`mr-1 h-5 w-5 ${
          props.isActive && props.isFooter ? 'base-link' : ''
        }`}
      />
      <span className='hidden md:block'>フォロー中</span>
    </MenuButton>
  )
}

const SearchButton = (props: ButtonProps) => {
  return (
    <MenuButton {...props}>
      <MagnifyingGlassIcon
        className={`mr-1 h-5 w-5 ${
          props.isActive && props.isFooter ? 'base-link' : ''
        }`}
      />
      <span className='hidden md:block'>検索</span>
    </MenuButton>
  )
}

const DirectMessageButton = (props: ButtonProps) => {
  return (
    <MenuButton {...props}>
      <EnvelopeIcon
        className={`mr-1 h-5 w-5 ${
          props.isActive && props.isFooter ? 'base-link' : ''
        }`}
      />
      <span className='hidden lg:block'>ダイレクトメッセージ</span>
      <span className='hidden md:block lg:hidden'>DM</span>
    </MenuButton>
  )
}
