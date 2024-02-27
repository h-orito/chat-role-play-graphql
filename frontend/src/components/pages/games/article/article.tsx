import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import Modal from '@/components/modal/modal'
import FavoriteParticipants from './message-area/message-area/messages-area/message/favorite-participants'
import MessageArea, {
  MessageAreaRefHandle
} from './message-area/message-area/message-area'
import ArticleMenu from './article-menu'
import MessageFooterMenu from './message-footer-menu'
import { googleAdnsenseStyleGuard } from '@/components/adsense/google-adsense-guard'
import { useMyPlayerValue, useMyselfValue } from '../game-hook'
import DirectMessageGroupsArea from './message-area/direct-message/direct-message-groups-area'

type Props = {}

export interface ArticleRefHandle {
  fetchHomeLatest: () => void
}

const Article = forwardRef<ArticleRefHandle, Props>((_: Props, ref: any) => {
  const [tab, setTab] = useState('home')
  const [isOpenFavoritesModal, setIsOpenFavoritesModal] = useState(false)
  const toggleFavoritesModal = (e: any) => {
    if (e.target === e.currentTarget) {
      setIsOpenFavoritesModal(!isOpenFavoritesModal)
    }
  }
  const [favoriteMessageId, setFavoriteMessageId] = useState<string>('')
  const openFavoritesModal = async (messageId: string) => {
    setFavoriteMessageId(messageId)
    setIsOpenFavoritesModal(true)
  }

  const [existsHomeUnread, setExistsHomeUnread] = useState(false)
  const [existFollowsUnread, setExistFollowsUnread] = useState(false)

  const homeRef = useRef({} as MessageAreaRefHandle)
  const followRef = useRef({} as MessageAreaRefHandle)

  const handleTabChange = (tab: string) => {
    setTab(tab)
    if (tab === 'home') {
      homeRef.current.fetchLatest()
    } else if (tab === 'follow') {
      followRef.current.fetchLatest()
    } else {
    }
  }

  useImperativeHandle(ref, () => ({
    async fetchHomeLatest() {
      return homeRef.current.fetchLatest()
    }
  }))

  const getCurrentMessageAreaRef = () => {
    return tab === 'home' ? homeRef : followRef
  }
  const search = () => getCurrentMessageAreaRef().current.search()
  const scrollToTop = () => getCurrentMessageAreaRef().current.scrollToTop()
  const scrollToBottom = () =>
    getCurrentMessageAreaRef().current.scrollToBottom()

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
        existsFollowsUnread={existFollowsUnread}
      />
      <MessageArea
        ref={homeRef}
        className={`${tab === 'home' ? '' : 'hidden'}`}
        openFavoritesModal={openFavoritesModal}
        isViewing={tab === 'home'}
        existsUnread={existsHomeUnread}
        setExistUnread={setExistsHomeUnread}
      />
      {myself && (
        <MessageArea
          ref={followRef}
          className={`${tab === 'follow' ? '' : 'hidden'}`}
          openFavoritesModal={openFavoritesModal}
          isViewing={tab === 'follow'}
          existsUnread={existFollowsUnread}
          setExistUnread={setExistFollowsUnread}
          onlyFollowing
        />
      )}
      {shouldShowDM && (
        <DirectMessageGroupsArea
          className={`${tab === 'dm' ? '' : 'hidden'}`}
        />
      )}
      {isOpenFavoritesModal && (
        <Modal header='ふぁぼした人' close={toggleFavoritesModal} hideFooter>
          <FavoriteParticipants
            messageId={favoriteMessageId}
            close={toggleFavoritesModal}
          />
        </Modal>
      )}
      <MessageFooterMenu
        className={`${tab === 'dm' ? 'hidden' : ''}`}
        scrollToTop={scrollToTop}
        scrollToBottom={scrollToBottom}
      />
      <ArticleMenu
        tab={tab}
        setTab={setTab}
        existsHomeUnread={existsHomeUnread}
        existsFollowsUnread={existFollowsUnread}
        footer
      />
    </article>
  )
})

export default Article

type HeaderProps = { tab: string }
const ArticleHeader = ({ tab }: HeaderProps) => {
  const tabName =
    tab === 'home'
      ? 'ホーム'
      : tab === 'follow'
      ? 'フォロー'
      : tab === 'search'
      ? '検索'
      : 'ダイレクトメッセージ'
  return (
    <div className='sidebar-background base-border flex justify-center border-b px-4 py-2 font-bold md:hidden'>
      {tabName}
    </div>
  )
}
