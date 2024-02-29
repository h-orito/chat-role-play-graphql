import {
  ChangePeriod,
  ChangePeriodDocument,
  ChangePeriodMutation,
  ChangePeriodMutationVariables,
  Game,
  GameParticipant,
  MyGameParticipantDocument,
  MyGameParticipantQuery,
  MyGameParticipantQueryVariables,
  MyPlayerDocument,
  MyPlayerQuery,
  Player
} from '@/lib/generated/graphql'
import { useLazyQuery, useMutation } from '@apollo/client'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useRef } from 'react'

// game
const gameAtom = atom<Game | null>(null)
export const useGame = (game: Game): Game => {
  const setGame = useSetAtom(gameAtom)
  setGame(game)
  useEffect(() => {
    return () => setGame(null)
  }, [])
  return game
}
export const useGameValue = () => useAtomValue(gameAtom)!

// myself
const myselfAtom = atom<GameParticipant | null>(null)

export const useMyself = (
  gameId: string
): [myself: GameParticipant | null, refetchMyself: () => void] => {
  const [fetchMyself] = useLazyQuery<MyGameParticipantQuery>(
    MyGameParticipantDocument
  )
  const [myself, setMyselfAtom] = useAtom(myselfAtom)
  const fetch = async () => {
    const { data } = await fetchMyself({
      variables: { gameId } as MyGameParticipantQueryVariables
    })
    setMyselfAtom((data?.myGameParticipant as GameParticipant) ?? null)
  }
  useEffect(() => {
    fetch()
    return () => setMyselfAtom(null)
  }, [])
  return [myself, fetch]
}

export const useMyselfValue = () => useAtomValue(myselfAtom)

// player
const myPlayerAtom = atom<Player | null>(null)

export const useMyPlayer = (): Player | null => {
  const [fetchMyPlayer] = useLazyQuery<MyPlayerQuery>(MyPlayerDocument)
  const [myPlayer, setMyPlayer] = useAtom(myPlayerAtom)
  useEffect(() => {
    const fetch = async () => {
      const { data } = await fetchMyPlayer()
      if (data?.myPlayer == null) return
      setMyPlayer(data.myPlayer as Player)
    }
    fetch()
    return () => setMyPlayer(null)
  }, [])
  return myPlayer
}
export const useMyPlayerValue = () => useAtomValue(myPlayerAtom)

// ゲーム更新チェック
const periodChangeStatuses = [
  'Closed',
  'Opening',
  'Recruiting',
  'Progress',
  'Epilogue'
]
export const usePollingPeriod = (game: Game) => {
  const callback = () => async () => {
    if (!periodChangeStatuses.includes(game.status)) return
    const [changePeriod] =
      useMutation<ChangePeriodMutation>(ChangePeriodDocument)
    await changePeriod({
      variables: {
        input: {
          gameId: game.id
        } as ChangePeriod
      } as ChangePeriodMutationVariables
    })
  }

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

// sidebar
const sidebarOpenAtom = atom(false)
export const useSidebarOpen = () => {
  const [isOpen, setIsOpen] = useAtom(sidebarOpenAtom)
  const toggle = () => setIsOpen(!isOpen)
  useEffect(() => {
    return setIsOpen(false)
  }, [])
  return [isOpen, toggle] as const
}
