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
import DirectMessagesArea from './message-area/direct-message/direct-messages-area'
import ArticleMenu from './article-menu'
import MessageFooterMenu, {
  MessageFooterMenuRefHandle
} from './message-footer-menu'
import { googleAdnsenseStyleGuard } from '@/components/adsense/google-adsense-guard'
import {
  useGameValue,
  useMyPlayerValue,
  useMyselfValue
} from '../../games_new/game-hook'

type Props = {
  openProfileModal: (participantId: string) => void
}

export interface ArticleRefHandle {
  fetchHomeLatest: () => void
}

const Article = forwardRef<ArticleRefHandle, Props>(
  (props: Props, ref: any) => {
    const { openProfileModal } = props
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
    const [existSearchUnread, setExistSearchUnread] = useState(false)

    const homeRef = useRef({} as MessageAreaRefHandle)
    const followRef = useRef({} as MessageAreaRefHandle)
    const searchRef = useRef({} as MessageAreaRefHandle)
    const messageFooterMenuRef = useRef({} as MessageFooterMenuRefHandle)
    const reply = (message: any) => messageFooterMenuRef.current?.reply(message)

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
      return tab === 'home' ? homeRef : tab === 'follow' ? followRef : searchRef
    }
    const search = () => getCurrentMessageAreaRef().current.search()
    const scrollToTop = () => getCurrentMessageAreaRef().current.scrollToTop()
    const scrollToBottom = () =>
      getCurrentMessageAreaRef().current.scrollToBottom()

    useEffect(() => {
      googleAdnsenseStyleGuard()
    }, [])

    const game = useGameValue()
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
          reply={reply}
          openProfileModal={openProfileModal}
          openFavoritesModal={openFavoritesModal}
          isViewing={tab === 'home'}
          existsUnread={existsHomeUnread}
          setExistUnread={setExistsHomeUnread}
        />
        {myself && (
          <MessageArea
            ref={followRef}
            className={`${tab === 'follow' ? '' : 'hidden'}`}
            reply={reply}
            openProfileModal={openProfileModal}
            openFavoritesModal={openFavoritesModal}
            isViewing={tab === 'follow'}
            existsUnread={existFollowsUnread}
            setExistUnread={setExistFollowsUnread}
            onlyFollowing
          />
        )}
        <MessageArea
          ref={searchRef}
          className={`${tab === 'search' ? '' : 'hidden'}`}
          reply={reply}
          openProfileModal={openProfileModal}
          openFavoritesModal={openFavoritesModal}
          isViewing={tab === 'search'}
          existsUnread={existSearchUnread}
          setExistUnread={setExistSearchUnread}
          searchable
        />
        {shouldShowDM && (
          <DirectMessagesArea
            className={`${tab === 'dm' ? '' : 'hidden'}`}
            openProfileModal={openProfileModal}
          />
        )}
        {isOpenFavoritesModal && (
          <Modal header='ふぁぼした人' close={toggleFavoritesModal} hideFooter>
            <FavoriteParticipants
              messageId={favoriteMessageId}
              openProfileModal={openProfileModal}
              close={toggleFavoritesModal}
            />
          </Modal>
        )}
        <MessageFooterMenu
          ref={messageFooterMenuRef}
          className={`${tab === 'dm' ? 'hidden' : ''}`}
          search={search}
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
  }
)

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
