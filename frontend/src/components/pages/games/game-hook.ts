import {
  ChangePeriodDocument,
  ChangePeriodMutation,
  ChangePeriodMutationVariables,
  Game,
  GameParticipant,
  GameParticipantIcon,
  IconsDocument,
  IconsQuery,
  IconsQueryVariables,
  MyGameParticipantDocument,
  MyGameParticipantQuery,
  MyGameParticipantQueryVariables,
  MyPlayerDocument,
  MyPlayerQuery,
  MyPlayerQueryVariables,
  Player
} from '@/lib/generated/graphql'
import { useLazyQuery, useMutation } from '@apollo/client'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useRef } from 'react'
import { defaultDisplaySettings, useUserDisplaySettings } from './user-settings'

export { GameProvider, useGameValue } from './contexts/game-context'
// 発言可能なゲームステータス
export const talkableGameStatuses = [
  'Closed',
  'Opening',
  'Recruiting',
  'Progress',
  'Epilogue'
]
export const isGameMaster = (myPlayer: Player | null, game: Game) => {
  return (
    isAdmin(myPlayer) ||
    game.gameMasters.some((gm) => gm.player.id === myPlayer?.id)
  )
}
// プレイヤーとして参加可能なゲームステータス
const playerParticipatableGameStatuses = ['Recruiting', 'Progress']
// GMが参加可能なゲームステータス
const gameMasterParticipatableGameStatuses = ['Closed', 'Opening']
// ゲーム設定変更可能なゲームステータス
const gameSettingModifiableGameStatuses = [
  'Closed',
  'Opening',
  'Recruiting',
  'Progress',
  'Epilogue'
]
// 参加可能か
export const canParticipate = (
  game: Game,
  player: Player | null,
  myself: GameParticipant | null,
  isGameMaster: boolean
) => {
  if (!player || !!myself) return false
  return (
    (isGameMaster &&
      gameMasterParticipatableGameStatuses.includes(game.status)) ||
    playerParticipatableGameStatuses.includes(game.status)
  )
}
// ゲーム設定変更可能か
export const canModifyGameSetting = (game: Game, myPlayer: Player | null) => {
  return (
    isGameMaster(myPlayer, game) &&
    gameSettingModifiableGameStatuses.includes(game.status)
  )
}

// myself
const myselfAtom = atom<GameParticipant | null>(null)

export const useMyselfInit = (gameId: string): GameParticipant | null => {
  const [myself, refetchMyself] = useMyself(gameId)
  const setMyselfAtom = useSetAtom(myselfAtom)
  useEffect(() => {
    refetchMyself()
    return () => setMyselfAtom(null)
    // mount 時のみ初回取得・unmount 時に atom をクリア
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return myself
}
export const useMyself = (
  gameId: string
): [myself: GameParticipant | null, refetchMyself: () => void] => {
  const [fetchMyself] = useLazyQuery<
    MyGameParticipantQuery,
    MyGameParticipantQueryVariables
  >(MyGameParticipantDocument)
  const [myself, setMyselfAtom] = useAtom(myselfAtom)
  const fetch = async () => {
    const { data } = await fetchMyself({
      variables: { gameId }
    })
    setMyselfAtom((data?.myGameParticipant as GameParticipant) ?? null)
  }
  return [myself, fetch]
}

export const useMyselfValue = () => useAtomValue(myselfAtom)

// player
const myPlayerAtom = atom<Player | null>(null)

export const useMyPlayer = (): Player | null => {
  const [fetchMyPlayer] = useLazyQuery<MyPlayerQuery, MyPlayerQueryVariables>(
    MyPlayerDocument
  )
  const [myPlayer, setMyPlayer] = useAtom(myPlayerAtom)
  useEffect(() => {
    const fetch = async () => {
      const { data } = await fetchMyPlayer()
      if (data?.myPlayer == null) return
      setMyPlayer(data.myPlayer as Player)
    }
    fetch()
    return () => setMyPlayer(null)
    // mount 時のみ初回取得・unmount 時に atom をクリア
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return myPlayer
}
export const useMyPlayerValue = () => useAtomValue(myPlayerAtom)
const isAdmin = (myPlayer: Player | null) => {
  return myPlayer && myPlayer.authorityCodes.includes('AuthorityAdmin')
}

// ゲーム更新チェック
const periodChangeStatuses = [
  'Closed',
  'Opening',
  'Recruiting',
  'Progress',
  'Epilogue'
]
export const usePollingPeriod = (game: Game) => {
  const [changePeriod] = useMutation<
    ChangePeriodMutation,
    ChangePeriodMutationVariables
  >(ChangePeriodDocument)

  const callback = useCallback(async () => {
    if (!periodChangeStatuses.includes(game.status)) return

    await changePeriod({
      variables: {
        input: {
          gameId: game.id
        }
      }
    })
  }, [game.status, game.id, changePeriod])

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
    return () => setIsOpen(false)
    // unmount 時に閉じるだけのクリーンアップ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return [isOpen, toggle] as const
}

// icons
const iconsAtom = atom<Array<GameParticipantIcon>>([])
export const useIcons = (): void => {
  const myself = useMyselfValue()
  const setIconsAtom = useSetAtom(iconsAtom)
  const [fetchIcons] = useLazyQuery<IconsQuery, IconsQueryVariables>(
    IconsDocument
  )
  const fetch = async () => {
    if (!myself) return
    const { data } = await fetchIcons({
      variables: { participantId: myself.id }
    })
    if (data?.gameParticipantIcons == null) return
    setIconsAtom(data.gameParticipantIcons)
  }
  useEffect(() => {
    fetch()
    return () => setIconsAtom([])
    // myself 変化時にアイコン取得・unmount 時に空配列にリセット（fetch/setIconsAtom は意図的に外す）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myself])
}
export const useIconsValue = () => useAtomValue(iconsAtom)

// display settings
const displaySettingsAtom = atom(defaultDisplaySettings)
export const useUserDisplaySettingsAtom = () => {
  const [displaySettings, setDisplaySettings] = useUserDisplaySettings()
  const setAtom = useSetAtom(displaySettingsAtom)
  useEffect(() => {
    setAtom(displaySettings)
  }, [displaySettings, setAtom])
}
export const useUserDisplaySettingsValue = () =>
  useAtomValue(displaySettingsAtom)

// 発言欄の下部固定
// 1つ固定したら他の固定は解除する
// 解除するための関数を保存しておく
const fixedBottomAtom = atom({ fn: () => {} })
export const useFixedBottom = () => {
  const [cancelFunction, setCancelFunction] = useAtom(fixedBottomAtom)

  const canceler = (func: () => void) => {
    cancelFunction.fn()
    setCancelFunction({ fn: func })
  }
  return canceler
}
