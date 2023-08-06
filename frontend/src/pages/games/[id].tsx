import Head from 'next/head'
import { createInnerClient } from '@/components/graphql/client'
import { idToBase64 } from '@/components/graphql/convert'
import ArticleModal from '@/components/modal/article-modal'
import Article from '@/components/pages/games/article/article'
import Profile from '@/components/pages/games/profile/profile'
import Sidebar from '@/components/pages/games/sidebar/sidebar'
import {
  ChangePeriod,
  ChangePeriodDocument,
  ChangePeriodMutation,
  ChangePeriodMutationVariables,
  Game,
  GameDocument,
  GameParticipant,
  GameQuery,
  GameQueryVariables,
  MessagesQuery,
  MyGameParticipantDocument,
  MyGameParticipantQuery,
  MyGameParticipantQueryVariables,
  MyPlayerDocument,
  MyPlayerQuery,
  Player
} from '@/lib/generated/graphql'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useEffect, useRef, useState } from 'react'

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
  const [myPlayer, setMyPlayer] = useState<Player | null>(null)

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

  const [fetchMyPlayer] = useLazyQuery<MyPlayerQuery>(MyPlayerDocument)
  const refetchMyPlayer = async () => {
    const { data } = await fetchMyPlayer()
    if (data?.myPlayer == null) return
    setMyPlayer(data.myPlayer as Player)
  }

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      await refetchMyself()
      await refetchMyPlayer()
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleSidebar = (e: any) => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // 1分に1回ゲーム更新チェック
  const usePollingPeriod = (callback: () => void) => {
    const ref = useRef<() => void>(callback)
    useEffect(() => {
      ref.current = callback
    }, [callback])

    useEffect(() => {
      const mutation = () => {
        ref.current()
      }
      mutation() // 初回だけ即時実行
      const timer = setInterval(mutation, 60000)
      return () => clearInterval(timer)
    }, [])
  }
  const [changePeriod] = useMutation<ChangePeriodMutation>(
    ChangePeriodDocument,
    {
      onCompleted(e) {},
      onError(error) {
        console.error(error)
      }
    }
  )
  const changePeriodIfNeeded = async () => {
    if (!['Opening', 'Recruiting', 'Progress'].includes(game.status)) return
    await changePeriod({
      variables: {
        input: {
          gameId: game.id
        } as ChangePeriod
      } as ChangePeriodMutationVariables
    })
  }
  usePollingPeriod(() => changePeriodIfNeeded())

  if (loading) return <div>loading...</div>
  return (
    <main className='flex w-full'>
      <Head>
        <title>{game.name}</title>
      </Head>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        game={game}
        myself={myself}
        myPlayer={myPlayer}
        openProfileModal={openProfileModal}
      />
      <Article
        game={game}
        myself={myself}
        openProfileModal={openProfileModal}
        toggleSidebar={toggleSidebar}
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
