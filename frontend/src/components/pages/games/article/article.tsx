import { useEffect, useMemo, useRef, useState } from 'react'
import Modal from '@/components/modal/modal'
import FavoriteParticipants from './message-area/message-area/messages-area/message/favorite-participants'
import MessageArea, {
  MessageAreaRefHandle
} from './message-area/message-area/message-area'
import ArticleMenu from './article-menu'
import { googleAdnsenseStyleGuard } from '@/components/adsense/google-adsense-guard'
import { useMyPlayerValue, useMyselfValue } from '../game-hook'
import DirectMessageGroupsArea from './message-area/direct-message/direct-message-groups-area'

const Article = () => {
  const [tab, setTab] = useState('home')
  const [existsHomeUnread, setExistsHomeUnread] = useState(false)
  const [existsToMeUnread, setExistsToMeUnread] = useState(false)

  const homeRef = useRef({} as MessageAreaRefHandle)
  const toMeRef = useRef({} as MessageAreaRefHandle)

  const handleTabChange = (tab: string) => {
    setTab(tab)
    if (tab === 'home' && existsHomeUnread) {
      homeRef.current.fetchLatest()
    } else if (tab === 'tome' && existsToMeUnread) {
      toMeRef.current.fetchLatest()
    } else {
    }
  }

  useEffect(() => {
    googleAdnsenseStyleGuard()
  }, [])

  const myPlayer = useMyPlayerValue()
  const myself = useMyselfValue()
  const shouldShowDM = useMemo(() => {
    const isAdmin =
      myPlayer && myPlayer?.authorityCodes.includes('AuthorityAdmin')
    return !!myself || isAdmin || false
  }, [myself, myPlayer])

  return (
    <article
      id='article'
      className='mut-height-guard base-background relative flex h-screen max-h-screen w-full flex-1 flex-col'
    >
      <ArticleHeader tab={tab} />
      <ArticleMenu
        tab={tab}
        setTab={handleTabChange}
        existsHomeUnread={existsHomeUnread}
        existsToMeUnread={existsToMeUnread}
      />
      <MessageArea
        ref={homeRef}
        className={`${tab === 'home' ? '' : 'hidden'}`}
        isViewing={tab === 'home'}
        existsUnread={existsHomeUnread}
        setExistUnread={setExistsHomeUnread}
      />
      {myself && (
        <MessageArea
          ref={toMeRef}
          className={`${tab === 'tome' ? '' : 'hidden'}`}
          isViewing={tab === 'tome'}
          existsUnread={existsToMeUnread}
          setExistUnread={setExistsToMeUnread}
          onlyToMe={true}
        />
      )}
      {shouldShowDM && (
        <DirectMessageGroupsArea
          className={`${tab === 'dm' ? '' : 'hidden'}`}
        />
      )}
      <ArticleMenu
        tab={tab}
        setTab={setTab}
        existsHomeUnread={existsHomeUnread}
        existsToMeUnread={existsToMeUnread}
        footer
      />
    </article>
  )
}

export default Article

type HeaderProps = { tab: string }
const ArticleHeader = ({ tab }: HeaderProps) => {
  const tabName =
    tab === 'home'
      ? 'ホーム'
      : tab === 'tome'
      ? '自分宛'
      : 'ダイレクトメッセージ'
  return (
    <div className='sidebar-background base-border flex justify-center border-b px-4 py-2 font-bold md:hidden'>
      {tabName}
    </div>
  )
}
