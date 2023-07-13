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

  return (
    <article
      id='article'
      className='relative flex h-screen max-h-screen w-full flex-1 flex-col'
    >
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
        <>
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
          <DirectMessagesArea
            className={`${tab === 'dm' ? '' : 'hidden'}`}
            game={game}
            myself={myself}
            openProfileModal={openProfileModal}
          />
        </>
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
