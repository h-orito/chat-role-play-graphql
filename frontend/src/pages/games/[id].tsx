import { createInnerClient } from '@/components/graphql/client'
import { idToBase64 } from '@/components/graphql/convert'
import ArticleModal from '@/components/modal/article-modal'
import Modal from '@/components/modal/modal'
import Article from '@/components/pages/games/article/article'
import Profile from '@/components/pages/games/profile/profile'
import Sidebar from '@/components/pages/games/sidebar/sidebar'
import {
  Game,
  GameDocument,
  GameParticipant,
  GameQuery,
  GameQueryVariables,
  MyGameParticipantDocument,
  MyGameParticipantQuery,
  MyGameParticipantQueryVariables
} from '@/lib/generated/graphql'
import { useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

export const getServerSideProps = async (context: any) => {
  const { id } = context.params
  const client = createInnerClient()
  const gameId = idToBase64(id, 'Game')
  const { data: gamedata } = await client.query<GameQuery>({
    query: GameDocument,
    variables: { id: gameId } as GameQueryVariables
  })
  return {
    props: {
      gameId: id,
      game: gamedata.game
    }
  }
}

type Props = {
  gameId: number
  game: Game
}

export default function GamePage({ gameId, game }: Props) {
  const [loading, setLoading] = useState(false)
  const [myself, setMyself] = useState<GameParticipant | null>(null)

  const [fetchMyself] = useLazyQuery<MyGameParticipantQuery>(
    MyGameParticipantDocument
  )
  const refetchMyself = async () => {
    const { data } = await fetchMyself({
      variables: { gameId: game.id } as MyGameParticipantQueryVariables
    })
    if (data?.myGameParticipant == null) setMyself(null)
    else setMyself(data.myGameParticipant as GameParticipant)
  }

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      await refetchMyself()
      setLoading(false)
    }
    fetch()
  }, [])

  const [isOpenProfileModal, setIsOpenProfileModal] = useState(false)
  const toggleProfileModal = (e: any) => {
    setIsOpenProfileModal(!isOpenProfileModal)
  }
  const [profileParticipantId, setProfileParticipantId] = useState<string>('')
  const openProfileModal = async (participantId: string) => {
    setProfileParticipantId(participantId)
    setIsOpenProfileModal(true)
  }

  if (loading) return <div>loading...</div>
  return (
    <main className='flex w-full'>
      <Sidebar
        game={game}
        myself={myself}
        openProfileModal={openProfileModal}
      />
      <Article
        game={game}
        myself={myself}
        openProfileModal={openProfileModal}
      />
      {isOpenProfileModal && (
        <ArticleModal
          header={
            game.participants.find((p) => p.id === profileParticipantId)?.name
          }
          close={toggleProfileModal}
          hideFooter
        >
          <Profile
            game={game}
            myself={myself}
            participantId={profileParticipantId}
            refetchMyself={refetchMyself}
            close={toggleProfileModal}
          />
        </ArticleModal>
      )}
    </main>
  )
}
