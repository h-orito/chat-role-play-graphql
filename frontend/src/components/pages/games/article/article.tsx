import {
  Game,
  GameMessagesDocument,
  GameMessagesQuery,
  GameParticipant,
  MessagesLatestDocument,
  MessagesLatestQuery
} from '@/lib/generated/graphql'
import { useState } from 'react'
import Modal from '@/components/modal/modal'
import FavoriteParticipants from './message-area/message/favorite-participants'
import { useLazyQuery } from '@apollo/client'
import MessageArea from './message-area/message/message-area'
import DirectMessagesArea from './message-area/direct-message/direct-messages-area'
import ArticleMenu from './article-menu'

type ArticleProps = {
  game: Game
  myself: GameParticipant | null
  openProfileModal: (participantId: string) => void
  toggleSidebar: (e: any) => void
}

export default function Article({
  game,
  myself,
  openProfileModal,
  toggleSidebar
}: ArticleProps) {
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

  const [fetchMessages] = useLazyQuery<GameMessagesQuery>(GameMessagesDocument)
  const [fetchMessagesLatest] = useLazyQuery<MessagesLatestQuery>(
    MessagesLatestDocument
  )

  const [existsHomeUnread, setExistsHomeUnread] = useState(false)
  const [existFollowsUnread, setExistFollowsUnread] = useState(false)
  const [existSearchUnread, setExistSearchUnread] = useState(false)

  return (
    <article
      id='article'
      className='mut-height-guard relative flex h-screen max-h-screen w-full flex-1 flex-col'
    >
      <ArticleHeader tab={tab} />
      <ArticleMenu
        myself={myself}
        tab={tab}
        setTab={setTab}
        existsHomeUnread={existsHomeUnread}
        existsFollowsUnread={existFollowsUnread}
        toggleSidebar={toggleSidebar}
      />
      <MessageArea
        className={`${tab === 'home' ? '' : 'hidden'}`}
        game={game}
        myself={myself}
        fetchMessages={fetchMessages}
        fetchMessagesLatest={fetchMessagesLatest}
        openProfileModal={openProfileModal}
        openFavoritesModal={openFavoritesModal}
        isViewing={tab === 'home'}
        existsUnread={existsHomeUnread}
        setExistUnread={setExistsHomeUnread}
      />
      {myself && (
        <MessageArea
          className={`${tab === 'follow' ? '' : 'hidden'}`}
          game={game}
          myself={myself}
          fetchMessages={fetchMessages}
          fetchMessagesLatest={fetchMessagesLatest}
          openProfileModal={openProfileModal}
          openFavoritesModal={openFavoritesModal}
          isViewing={tab === 'follow'}
          existsUnread={existFollowsUnread}
          setExistUnread={setExistFollowsUnread}
          onlyFollowing
        />
      )}
      <MessageArea
        className={`${tab === 'search' ? '' : 'hidden'}`}
        game={game}
        myself={myself}
        fetchMessages={fetchMessages}
        fetchMessagesLatest={fetchMessagesLatest}
        openProfileModal={openProfileModal}
        openFavoritesModal={openFavoritesModal}
        isViewing={tab === 'search'}
        existsUnread={existSearchUnread}
        setExistUnread={setExistSearchUnread}
        searchable
      />
      {myself && (
        <DirectMessagesArea
          className={`${tab === 'dm' ? '' : 'hidden'}`}
          game={game}
          myself={myself}
          openProfileModal={openProfileModal}
        />
      )}
      {isOpenFavoritesModal && (
        <Modal header='ふぁぼした人' close={toggleFavoritesModal} hideFooter>
          <FavoriteParticipants
            game={game}
            myself={myself}
            messageId={favoriteMessageId}
            openProfileModal={openProfileModal}
            close={toggleFavoritesModal}
          />
        </Modal>
      )}
      <ArticleMenu
        myself={myself}
        tab={tab}
        setTab={setTab}
        existsHomeUnread={existsHomeUnread}
        existsFollowsUnread={existFollowsUnread}
        toggleSidebar={toggleSidebar}
        footer
      />
    </article>
  )
}

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
    <div className='flex justify-center border-b border-gray-300 px-4 py-2 font-bold md:hidden'>
      {tabName}
    </div>
  )
}
