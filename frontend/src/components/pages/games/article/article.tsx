import {
  Game,
  GameMessagesDocument,
  GameMessagesQuery,
  GameParticipant
} from '@/lib/generated/graphql'
import ArticleHeader from './article-header'
import { useState } from 'react'
import Modal from '@/components/modal/modal'
import FavoriteParticipants from './message-area/message/favorite-participants'
import { useLazyQuery } from '@apollo/client'
import MessageArea from './message-area/message/message-area'
import DirectMessagesArea from './message-area/direct-message/direct-messages-area'

type ArticleProps = {
  game: Game
  myself: GameParticipant | null
  openProfileModal: (participantId: string) => void
}

export default function Article({
  game,
  myself,
  openProfileModal
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

  return (
    <article
      id='article'
      className='relative flex h-screen max-h-screen w-full flex-1 flex-col'
    >
      <ArticleHeader myself={myself} tab={tab} setTab={setTab} />
      <MessageArea
        className={`${tab === 'home' ? '' : 'hidden'}`}
        game={game}
        myself={myself}
        fetchMessages={fetchMessages}
        openProfileModal={openProfileModal}
        openFavoritesModal={openFavoritesModal}
      />
      {myself && (
        <>
          <MessageArea
            className={`${tab === 'follow' ? '' : 'hidden'}`}
            game={game}
            myself={myself}
            fetchMessages={fetchMessages}
            openProfileModal={openProfileModal}
            openFavoritesModal={openFavoritesModal}
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
    </article>
  )
}
